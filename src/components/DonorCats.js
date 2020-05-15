//import React, { Component } from 'react'
import React, { useState, useEffect } from "react";
import { getDonorCats, updateCounters } from "./DonorFunctions";
import { sizeSideBar } from "./_sharedFunctions";
import { MyToast } from "./widgets/MyToast";
import localForage from "localforage";
import {
   Col,
   Button,
   ButtonGroup,
   Row,
   Spinner,
   Table,
   Toast,
   ToastBody,
   ToastHeader,
} from "reactstrap";

const Loading = (props) => {
   return (
      <div className={props.msgVisible}>
         <br />
         <center>
            <Spinner type='grow' color='blue' /> Loading Donor Categories ...
         </center>
      </div>
   );
};
const go = (loc) => {
   window.location.href = "/getdonors/" + loc;
};
const DonorRow = (props) => {
   let tid = props.title,
      actual = ""; //.replace(/\D/g,'');
   if (props.title !== undefined) {
      actual = parseInt(props.title.toString().replace("lifetime", ""))
         .toLocaleString("en-US", { style: "currency", currency: "CND" })
         .replace("CND", "");
   }

   let title = props.title
      .toString()
      .replace("2500000", "2.5M")
      .replace("0000000", "0M")
      .replace("000000", "M")
      .replace("00000", "00K")
      .replace("0000", "0K")
      .replace("000", "K")
      .replace("lifetime", "");
   return (
      <tr key={props.title}>
         <td>{title}</td>
         <td>${actual}</td>
         <td>{props.count}</td>
         <td>{props.date}</td>
         <td>Admin</td>
         <td>
            <div
               className='buttonLG dgroup'
               id={tid}
               onClick={(event) => go(event.target.id)}
            >
               <i
                  className='fa fa-edit dgroup'
                  id={tid}
                  onClick={(event) => go(event.target.id)}
               ></i>
            </div>
         </td>
      </tr>
   );
};

const AllDonorCats = (props) => {
   return (
      <React.Fragment>
         {props.donorCats.map((dc) => (
            <DonorRow
               author={dc.author}
               date={dc.date}
               count={dc.count}
               title={dc.donorKey}
               key={dc.donorKey}
            />
         ))}
      </React.Fragment>
   );
};

export const DonorCats = () => {
   const [donorCats, setDonorCats] = useState([]),
      [thetoken, setThetoken] = useState("Token not Set"),
      [modal, setModal] = useState(false),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible");

   const butClick = (e) =>
      (window.location.href = "/getdonorCats/" + e.target.id);

   const toggle = () => {
      setModal(!modal);
   };

   const addDonorCatStart = (data) => {
      alert("fearture not available for demo");
      //setDonorCats([...users, data]);
   };

   const removeDonorStart = (theUuid) => {
      alert("Feature not available in demo version");
      /*
      if (window.confirm("Are you sure you want to delete this?")) {

         if (theUuid !== undefined) {
            localForage
               .getItem("token", (err, theToken) => {
                  removeDonor(theUuid, theToken)
                     .then((res) => {
                        setUsers(users.filter((user) => user.uuid !== theUuid));
                     })
                     .catch((err) => {
                        console.log("Err: could not remove user " + err);
                     });
               })
               .catch(() => {
                  window.location.href = "/"; // no token
               });
         }
      } else {
         return false;
      }*/
   };

   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   useEffect(() => {
      localForage.getItem("token", function (err, startToken) {
         setThetoken(startToken);
         setTimeout(() => {
            if (thetoken !== "Token not Set") {
               setMsgVisible("hid");
               updateCounters(thetoken).then(() => {
                  getDonorCats(thetoken).then((data) => {
                     setDonorCats(data); // state is changed here - now will repaint
                     // add listener to each of the clicked edit icons
                     //var c = document.getElementsByClassName("dgroup");
                     //for (var i = 0; i < c.length; i++)
                     //   c[i].addEventListener("click", butClick, false);
                  });
               });
            }
         }, 1000);
      });
   }, [thetoken]);

   return (
      <div className='appBody'>
         <h4>Donor Categories</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
         </ButtonGroup>
         <div className={"p-1 rounded " + toastVisibility}>
            <MyToast
               title='Donor Categories'
               body='
               <ul>
               <li>
                  DonorCats are grouped in categories based on monetary
                  contributions. 
               </li>
               <li>
                  You can click the edit icon in each box to query respectively
               </li>'
            />
         </div>
         <br />
         <div className='globalShad'>
            <Table striped>
               <thead>
                  <tr style={{ backgroundColor: "#bdddff" }}>
                     <th>Category</th>
                     <th>Actual</th>
                     <th>Count</th>
                     <th>eDate</th>
                     <th>Admin</th>
                     <th>View</th>
                  </tr>
               </thead>
               <tbody>
                  <AllDonorCats
                     donorCats={donorCats}
                     removeDonorStart={removeDonorStart}
                  />
               </tbody>
            </Table>

            <Loading msgVisible={msgVisible} />
         </div>
      </div>
   );
};
