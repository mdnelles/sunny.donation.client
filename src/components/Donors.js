import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
   getDonors,
   donorSwap,
   updateDonorsSQL,
   deleteSQL,
   deleteGroupFunct,
   updateKey,
} from "./DonorFunctions";
import { MyToast } from "./widgets/MyToast";
import arraySort from "array-sort";
import { ModalAddDonor } from "./ModalAddDonor";
import {
   InputGroup,
   InputGroupAddon,
   Input,
   Button,
   ButtonGroup,
   Col,
   Spinner,
   Table,
} from "reactstrap";
import localForage from "localforage";

const Loading = (props) => {
   return (
      <div className={props.msgVisible}>
         <br />
         <center>
            <Spinner type='grow' color='blue' /> Loading Donors ...
         </center>
      </div>
   );
};

const Adonor = (props) => {
   let inNamevs = "",
      inLettervs = "",
      savevs = "";
   props.inputNamevs === undefined
      ? (inNamevs = "none")
      : (inNamevs = props.inputNamevs);
   props.inputLettervs === undefined
      ? (inLettervs = "none")
      : (inLettervs = props.inputLettervs);
   props.savevs === undefined ? (savevs = "none") : (savevs = props.savevs);
   return (
      <tr key={"i-/" + props.uuid}>
         <th scope='row'>
            <i
               aria-hidden='true'
               className={"fa fa-arrow-up headerr_link " + props.arrowVisClass}
               id={"au-" + props.id}
               onClick={props.ArrowClick.bind(this)}
            ></i>
         </th>
         <td>
            <i
               aria-hidden='true'
               className={
                  "fa fa-arrow-down headerr_link " + props.arrowVisClass
               }
               id={"ad-" + props.id}
               onClick={props.ArrowClick.bind(this)}
            ></i>
         </td>
         {/* Name */}
         <td>
            <div style={{ display: props.txtNamevs }}>{props.donorName}</div>
            <div style={{ display: inNamevs }}>
               <input
                  type='text'
                  defaultValue={props.donorName}
                  id={"dn-" + props.id}
                  onChange={(event) => props.setTxtDonor(event.target.value)}
               />
            </div>
         </td>
         {/* Letter */}
         <td>
            <div style={{ display: props.txtLettervs }}>{props.letter}</div>
            <div style={{ display: inLettervs }}>
               <input
                  type='text'
                  defaultValue={props.letter}
                  id={"dl-" + props.id}
                  size='3'
                  onChange={(event) => props.setTxtLetter(event.target.value)}
               />
            </div>
         </td>
         <td>
            {/* save */}
            <div
               className='btn deleteBtn'
               id={"del-" + props.id}
               style={{ display: props.delvs, width: 30 }}
               onClick={props.delDon.bind(this)}
            >
               <i
                  aria-hidden='true'
                  className='fa fa-trash-o deleteBtn'
                  id={"delb-" + props.id}
                  onClick={props.delDon.bind(this)}
               ></i>
            </div>
            <div
               className='btn saveBtn '
               id={"save-" + props.id}
               style={{ display: savevs, width: 30 }}
               onClick={props.saveEdit.bind(this)}
            >
               <i
                  aria-hidden='true'
                  className='fa fa-floppy-o saveBtn'
                  id={"savei-" + props.id}
                  onClick={props.saveEdit.bind(this)}
               ></i>
            </div>
         </td>
         <td>
            {/* edit*/}
            <div
               className='btn editBtn'
               id={"edit-" + props.id}
               style={{ display: props.editvs, width: 30 }}
            >
               <i
                  aria-hidden='true'
                  className='fa fa-pencil-square-o editd editBtnIcon'
                  id={"editI-" + props.id}
                  onClick={props.editDon.bind(this)}
               ></i>
            </div>
            <div
               className='btn cancelBtn startHid'
               id={"can-" + props.id}
               style={{ display: props.cancelvs, width: 30 }}
               onClick={props.cancel.bind(this)}
            >
               <i
                  aria-hidden='true'
                  className='fa fa-reply cancelBtn'
                  id={"reset-" + props.id}
                  onClick={props.cancel.bind(this)}
               ></i>
            </div>
         </td>
      </tr>
   );
};

const Alldonors = (props) => {
   var tog = false,
      bgc,
      first,
      last,
      arrowsArr = [];

   // the following is to stripe the lines for easier visuals
   props.donorArr.forEach((e, i) => {
      // get first and last because need to remove first and last sort arrows
      if (e.id !== undefined) {
         if (first === undefined) first = e.id.toString();
         last = e.id.toString();
         tog === false ? (bgc = "whitebg") : (bgc = "graybg");
         tog = !tog;
         props.donorArr[i].bgc = bgc;
         arrowsArr.push("au-" + e.id.toString());
         arrowsArr.push("ad-" + e.id.toString());
      }
   });

   if (props.searchLetter === false) {
      // only show arrows when search letter filter is not applied
      setTimeout(() => {
         arrowsArr.forEach((e, i) => {
            if (
               document.getElementById(e) !== null &&
               document.getElementById(e) !== undefined
            ) {
               document.getElementById(e).style.display = "block"; // make all arrows viewable
            }
         });
         // then hide first and last (up down respectively)
         if (document.getElementById("au-" + first)) {
            document.getElementById("au-" + first).style.display = "none";
            document.getElementById("ad-" + last).style.display = "none";
         }
      }, 250);
   } else {
      arrowsArr.forEach((e, i) => {
         document.getElementById(e).style.display = "none"; // make all arrows viewable
      });
   }

   return props.donorArr.map((donor) => (
      <Adonor
         id={donor.id}
         key={uuidv4()}
         bgc={donor.bgc}
         arrowVisClass={props.arrowVisClass}
         order={donor.donor_order}
         donorKey={donor.donorKey}
         donorName={donor.donorName}
         letter={donor.letter}
         delvs={donor.delvs}
         savevs={donor.savevs}
         editvs={donor.editvs}
         cancelvs={donor.cancelvs}
         txtNamevs={donor.txtNamevs}
         inputNamevs={donor.inputNamevs}
         txtLettervs={donor.txtLettervs}
         inputLettervs={donor.inputLettervs}
         ArrowClick={props.ArrowClick}
         setTxtLetter={props.setTxtLetter}
         setTxtDonor={props.setTxtDonor}
         delDon={props.delDon}
         editDon={props.editDon}
         cancel={props.cancel}
         saveEdit={props.saveEdit}
         thetoken={props.thetoken}
      />
   ));
};

export const Donors = () => {
   const [donorArr, setDonorArr] = useState([]),
      [donorArr2, setDonorArr2] = useState([]),
      [searchLetter, setSearchLetter] = useState(false),
      [txtDonor, setTxtDonor] = useState(""),
      [coAmount, setCoAmount] = useState(0),
      [arrowVisClass, setArrowVisClass] = useState("displayBlock"),
      [txtLetter, setTxtLetter] = useState(""),
      [theLetter, setTheLetter] = useState(""),
      [thetoken, setThetoken] = useState("Token not Set"),
      [title, setTitle] = useState(""),
      [oldKey, setOldKey] = useState(""),
      [renderClass, setRenderClass] = useState("displayNone"),
      [titleTxtDisplay, setTitleTxtDisplay] = useState("block"),
      [titleInputDisplay, setTitleInputDisplay] = useState("none"),
      [modal, setModal] = useState(false),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible");

   const saveEdit = (e) => {
      // edit donor click function
      e.stopPropagation();
      e.preventDefault();
      let [, id] = e.target.id.toString().split("-");
      id = parseInt(id);
      donorArr.forEach((e, i) => {
         if (e.id === id) {
            e.delvs = "block"; // vs = view style
            e.savevs = "none";
            e.editvs = "block";
            e.cancelvs = "none";
            e.txtNamevs = "block";
            e.inputNamevs = "none";
            e.txtLettervs = "block";
            e.inputLettervs = "none";
            e.letter = txtLetter;
            e.donorName = txtDonor;
         }
      });

      setDonorArr([...donorArr]);

      //updateSQL(id, [{txtLetter:'letter'}]txtDonor}], [{'letter','donorName'}], 'Donor')
      var updIds = [id, id];
      var updNewVals = [txtLetter, txtDonor];
      var updField = ["letter", "donorName"];
      // uncomment following line if it is not demo
      //updateDonorsSQL(updIds, updNewVals, updField, thetoken);
   };

   const editDon = (e) => {
      // edit donor click function
      e.stopPropagation();
      e.preventDefault();
      let [, id] = e.target.id.toString().split("-");
      id = parseInt(id);

      donorArr.forEach((e, i) => {
         if (e.id === id) {
            e.delvs = "none"; // vs = view style
            e.savevs = "block";
            e.editvs = "none";
            e.cancelvs = "block";
            e.txtNamevs = "none";
            e.inputNamevs = "block";
            e.txtLettervs = "none";
            e.inputLettervs = "block";
            setTxtDonor(e.donorName); // set state to current row value
            setTxtLetter(e.letter); // set state (letter) to current row value
         } else {
            // turn off the rest
            e.delvs = "block"; // vs = view style
            e.savevs = "none";
            e.editvs = "block";
            e.cancelvs = "none";
            e.txtNamevs = "block";
            e.inputNamevs = "none";
            e.txtLettervs = "block";
            e.inputLettervs = "none";
         }
      });
      setDonorArr([...donorArr]);
   };

   const cancel = (e) => {
      // edit donor click function
      e.stopPropagation();
      e.preventDefault();
      let [, id] = e.target.id.toString().split("-");
      id = parseInt(id);

      donorArr.forEach((e, i) => {
         if (e.id === id) {
            e.delvs = "block"; // vs = view style
            e.savevs = "none";
            e.editvs = "block";
            e.cancelvs = "none";
            e.txtNamevs = "block";
            e.inputNamevs = "none";
            e.txtLettervs = "block";
            e.inputLettervs = "none";
         }
      });
      setDonorArr([...donorArr]);
   };

   const delDon = (e) => {
      // delete donor click function
      e.stopPropagation();
      e.preventDefault();
      let [, id] = e.target.id.toString().split("-");
      id = parseInt(id);
      setDonorArr([...donorArr.filter((donor) => donor.id !== id)]);
      deleteSQL(id, "Donors", thetoken).then((res) => {
         console.log(res);
      });
   };

   const ArrowClick = (e) => {
      let donorArrNS = donorArr;
      e.stopPropagation();
      e.preventDefault();

      var ret2 = donorSwap(e.target.id, donorArrNS);
      if (ret2.updArr !== undefined && ret2.updArr.length > 2) {
         setDonorArr([...ret2.updArr]);
         ret2.updArr = []; // empty array so the object is smaller
         var updIds = [ret2.displacedID, ret2.clkID];
         var updNewVals = [ret2.displacedNewOrderNo, ret2.clkNewOrderNo];
         var updField = ["donor_order", "donor_order"];
         updateDonorsSQL(updIds, updNewVals, updField, thetoken).then((res) => {
            console.log(res);
         });
      }
   };

   const deleteGroup = (e) => {
      if (typeof e !== undefined) {
         e.stopPropagation();
         e.preventDefault();
         let temp = window.location.href.toString().split("/");
         let rest = temp[temp.length - 1].toString();

         if (window.confirm("Are you sure you want to delete the group ?")) {
            alert("got here");
            deleteGroupFunct(rest, thetoken).then(() => {
               window.location.href = "/donor_cats";
            });
         } else {
            return false;
         }
      }
   };

   const editGroup = (e) => {
      e.stopPropagation();
      setTitleTxtDisplay("none");
      setTitleInputDisplay("block");
   };

   const cancelGroup = (e) => {
      e.stopPropagation();
      setTitleTxtDisplay("block");
      setTitleInputDisplay("none");
   };

   const toggle = () => {
      setModal(!modal);
   };

   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   const updKey = () => {
      updateKey(title, oldKey, thetoken).then(() => {
         let refresh = document.location.href;
         document.location.href = refresh.toString().replace(oldKey, title);
      });
   };

   const letChange = (e) => {
      let l = e.target.value;
      setTheLetter(l.toUpperCase());
      if (l.length > 1) {
         // if more than one letter is entered - truncate
         l = l.charAt(2);
         setTheLetter(l.toUpperCase());
      }

      if (l === undefined || l === "") {
         setDonorArr(donorArr2);
         setSearchLetter(false);
         setArrowVisClass("displayBlock");
      } else {
         setArrowVisClass("displayNone");
         setSearchLetter(true);
         let lu = l.toUpperCase();
         let filteredDonorArr = donorArr2.filter(
            (entry) => entry.letter === l || entry.letter === lu
         );
         setDonorArr(filteredDonorArr);
      }
   };
   const addDonorObj = (newDonor) => {
      let temp = [...donorArr, newDonor];
      temp = arraySort(temp, "donorName");

      temp.forEach((e, i) => {
         e.delvs = "block"; // vs = view style
         e.savevs = "none";
         e.editvs = "block";
         e.cancelvs = "none";

         e.donor_order = i;

         e.txtNamevs = "block"; // vs = view style
         e.inputNamevs = "none";
         e.txtLettervs = "block";
         e.inputLettervs = "none";
      });
      setDonorArr(temp);
      setDonorArr2(temp);
      console.log("newDonor");
      console.log(newDonor);
      console.log(temp);
   };

   useEffect(() => {
      console.log("in useEffect");
      console.log(donorArr);
      localForage.getItem("token", function (err, startToken) {
         setThetoken(startToken);
         setTimeout(() => {
            if (thetoken !== "Token not Set") {
               let temp = window.location.href.toString().split("/");
               let rest = temp[temp.length - 1].toString();
               setCoAmount(rest.toString().replace("lifetime", ""));
               setTitle(rest);
               setOldKey(rest);
               //rest attribute being sent is url REST to specify which grp returned
               getDonors(rest, thetoken).then((data) => {
                  // do origonal sort by
                  setMsgVisible("hid");
                  data = arraySort(data, "donor_order");

                  data.forEach((e, i) => {
                     e.delvs = "block"; // vs = view style
                     e.savevs = "none";
                     e.editvs = "block";
                     e.cancelvs = "none";

                     e.txtNamevs = "block"; // vs = view style
                     e.inputNamevs = "none";
                     e.txtLettervs = "block";
                     e.inputLettervs = "none";
                  });
                  setDonorArr(data);
                  setDonorArr2(data); // state is changed here - now will repaint
                  setRenderClass("displayBlock");
               });
            }
         }, 100);
      });
   }, [thetoken]);

   let MyToastBody = `
        <ul>
        <li>
            This page contains the list of donors who have
            generously contributed \$${coAmount} over a lifetime
        </li>
        <li>
            To reduce list but first letter only use 'Limit By
            Letter'
            </li>
            <li>
        Up/Down Arrows re-oder List for displayc
        </li>
        <li>
        This is in demo mode so changes will not persist
        </li>
        <ul>
        `;

   let MyToastTitle = `Donors organized by monetary value
`;

   return (
      <div className='appBody'>
         <h4>Donors Lifetime ${coAmount}</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
            <Button color='primary' onClick={() => toggle()}>
               Add New Donor
            </Button>
         </ButtonGroup>

         <div className={toastVisibility}>
            <MyToast title={MyToastTitle} body={MyToastBody} />
         </div>

         <ModalAddDonor
            letChange={letChange}
            searchLetter={searchLetter}
            theLetter={theLetter}
            toggle={toggle}
            modal={modal}
            setModal={setModal}
            addDonorObj={addDonorObj}
         />

         <div id='rendered' className='globalShad'>
            <Table style={{ marginBottom: -8 }}>
               <thead>
                  <tr className='tableHeader'>
                     <td>
                        <div style={{ display: titleTxtDisplay }}>{title}</div>
                        <div style={{ display: titleInputDisplay }}>
                           <InputGroup>
                              <Input
                                 bsSize='sm'
                                 value={title}
                                 onChange={(event) =>
                                    setTitle(event.target.value)
                                 }
                              />
                              <InputGroupAddon addonType='append'>
                                 <Button color='success' onClick={updKey}>
                                    update
                                 </Button>
                              </InputGroupAddon>
                           </InputGroup>
                        </div>
                     </td>
                     <td style={{ width: 20 }}>
                        <div
                           style={{ display: titleInputDisplay }}
                           className='buttonLG dgroup'
                           onClick={cancelGroup}
                        >
                           &#8635;
                        </div>
                        <div
                           style={{ display: titleTxtDisplay }}
                           className='buttonLG dgroup'
                           onClick={editGroup.bind(this)}
                        >
                           <i
                              className='fa fa-edit dgroup'
                              aria-hidden='true'
                              onClick={editGroup.bind(this)}
                           ></i>
                        </div>
                     </td>
                     <td style={{ width: 20 }}>
                        <div
                           className='buttonLG dgroup'
                           onClick={deleteGroup.bind(this)}
                        >
                           <i
                              className='fa fa-trash dgroup'
                              aria-hidden='true'
                              onClick={deleteGroup.bind(this)}
                           ></i>
                        </div>

                        <button
                           className='save startHid'
                           id='edit_dcat'
                        ></button>
                     </td>
                  </tr>
               </thead>
            </Table>
         </div>

         {/* Table */}

         <div className='globalShad'>
            <Table striped>
               <thead>
                  <tr className='tableHeader'>
                     <th>
                        <i
                           aria-hidden='true'
                           className='fa fa-arrow-up headerr_link'
                           style={{ opactiy: 0.5 }}
                        ></i>
                     </th>
                     <th>
                        <i
                           aria-hidden='true'
                           className='fa fa-arrow-down'
                           style={{ opactiy: 0.5 }}
                        ></i>
                     </th>
                     <th>Name</th>
                     <th>Letter</th>
                     <th>Delete</th>
                     <th>Edit</th>
                  </tr>
               </thead>
               <tbody>
                  <Alldonors
                     arrowVisClass={arrowVisClass}
                     key={uuidv4()}
                     donorArr={donorArr}
                     ArrowClick={ArrowClick}
                     delDon={delDon}
                     editDon={editDon}
                     setTxtLetter={setTxtLetter}
                     setTxtDonor={setTxtDonor}
                     cancel={cancel}
                     saveEdit={saveEdit}
                     searchLetter={searchLetter}
                     thetoken={thetoken}
                  />
               </tbody>
            </Table>

            <Loading msgVisible={msgVisible} />
         </div>
      </div>
   );
};
