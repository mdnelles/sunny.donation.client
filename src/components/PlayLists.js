import React, { useEffect, useState } from "react";
import {
   getPlayLists,
   getLayouts,
   removePlayList,
   removeLayout,
} from "./PlayListFunctions";
import { MyToast } from "./widgets/MyToast";
import { ModalAddPlayList } from "./ModalAddPlayList";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import localForage from "localforage";
import { Button, ButtonGroup, Spinner, Table } from "reactstrap";

const Loading = (props) => {
   return (
      <div className={props.msgVisible}>
         <br />
         <center>
            <Spinner type='grow' color='blue' /> Loading ...
         </center>
      </div>
   );
};

const Layout = (props) => {
   return (
      <React.Fragment>
         <tr key={props.key}>
            <td>{props.title}</td>
            <td>{props.layout}</td>
            <td>{props.asset}</td>
            <td>
               <div
                  className='btn deleteBtn visible'
                  id={"j-" + props.id}
                  onClick={props.removeLayoutStart.bind(this)}
               >
                  <i
                     aria-hidden='true'
                     className='fa fa-trash-o deleteBtn'
                     id={"i-" + props.id}
                     onClick={props.removeLayoutStart.bind(this)}
                  ></i>
               </div>
            </td>
         </tr>
      </React.Fragment>
   );
};

const Layouts = (props) => {
   return props.layoutsArr.map((layout) => (
      <Layout
         key={uuidv4()}
         removeLayoutStart={props.removeLayoutStart}
         bgc={layout.bgc}
         title={layout.title}
         asset={layout.asset}
         layout={layout.layout}
         id={layout.id}
      />
   ));
};

/////////////////// playlist components
const PlayList = (props) => {
   return (
      <React.Fragment>
         <tr key={props.key}>
            <td>{props.name}</td>
            <td>{props.author}</td>
            <td>{props.startDate}</td>
            <td>
               <Link to={"/edit_playlist/" + props.id}>
                  <div className='btn editBtn' id={"edit-" + props.id}>
                     <i
                        aria-hidden='true'
                        className='fa fa-pencil-square-o editd editBtnIcon'
                     ></i>
                  </div>
               </Link>

               <div
                  className='btn deleteBtn visible'
                  id={"j-" + props.id}
                  onClick={props.removePlayListStart.bind(this)}
               >
                  <i
                     aria-hidden='true'
                     className='fa fa-trash-o deleteBtn'
                     id={"i-" + props.id}
                     onClick={props.removePlayListStart.bind(this)}
                  ></i>
               </div>
            </td>
         </tr>
      </React.Fragment>
   );
};

const Playlists = (props) => {
   return props.playListsArr.map((playlist) => (
      <PlayList
         key={uuidv4()}
         id={playlist.id}
         name={playlist.name}
         author={playlist.author}
         startDate={playlist.startDate}
         endDate={playlist.endDate}
         removePlayListStart={props.removePlayListStart}
         bgc={playlist.bgc}
      />
   ));
};

export const PlayLists = () => {
   const [playListsArr, setPlayListsArr] = useState([]),
      [layoutsArr, setLayoutsArr] = useState([]),
      [thetoken, setThetoken] = useState("Token not Set"),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible");

   const removePlayListStart = (e) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this?")) {
         var [, id] = e.target.id.toString().split("-");
         removePlayList(id, thetoken).then(() => {
            setPlayListsArr([
               ...doStripe(
                  playListsArr.filter(
                     (alist) => parseInt(alist.id) !== parseInt(id)
                  )
               ),
            ]);
         });
      } else {
         return false;
      }
   };

   const removeLayoutStart = (e) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this?")) {
         console.log("LAYOUT -- e.target.id = " + e.target.id);
         var [, id] = e.target.id.toString().split("-");
         console.log("attempting to remove id:" + id);
         removeLayout(id, thetoken).then(() => {
            setLayoutsArr(
               doStripe(
                  layoutsArr.filter(
                     (alayout) => parseInt(alayout.id) !== parseInt(id)
                  )
               )
            );
         });
      } else {
         return false;
      }
   };

   const doStripe = (arr) => {
      var tog = false,
         bgc;

      arr.forEach((e, i) => {
         tog === false ? (bgc = "whitebg") : (bgc = "graybg");
         tog = !tog;
         arr[i].bgc = bgc;
      });
      return arr;
   };

   const toggle = () => {
      //setModal(!modal);
   };

   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   // on page load / componentDidMount
   useEffect(() => {
      localForage.getItem("token", function (err, startToken) {
         setThetoken(startToken);
         setTimeout(() => {
            if (thetoken !== "Token not Set") {
               getLayouts(thetoken).then((res2) => {
                  getPlayLists(thetoken).then((res1) => {
                     setMsgVisible("hid");
                     if (res2 !== undefined && res2 !== [] && res2 !== false) {
                        res2 = doStripe(res2);
                        setLayoutsArr(res2);
                     }
                     if (res1 !== undefined && res1 !== false && res1 !== []) {
                        res1 = doStripe(res1);
                        setPlayListsArr(res1);
                     }
                  });
               });
            }
         }, 100);
      });
   }, [thetoken]);

   return (
      <div className='appBody'>
         <h4>Playlists</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
            <Button color='primary'>Add Playlist</Button>
            <Button color='primary'>Add Layout</Button>
         </ButtonGroup>
         <div className={"p-1 rounded " + toastVisibility}>
            <MyToast
               title='Playlist'
               body='This controls the CMS user administration for this
                  application.'
            />
         </div>
         <ModalAddPlayList thetoken={thetoken} />

         <br />
         <h5>Play Lists</h5>

         <div className='globalShad'>
            <Table striped>
               <thead>
                  <tr className='tableHeader'>
                     <th>Playlist</th>
                     <th>Author</th>
                     <th>Start Date</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  <Playlists
                     playListsArr={playListsArr}
                     removePlayListStart={removePlayListStart}
                     thetoken={thetoken}
                  />
               </tbody>
            </Table>
         </div>
         <div style={spacer} />
         <Loading msgVisible={msgVisible} />

         <h5>Layouts</h5>
         <div className='globalShad'>
            <Table striped>
               <thead>
                  <tr className='tableHeader'>
                     <th>Title</th>
                     <th>Layout</th>
                     <th>Asset</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  <Layouts
                     layoutsArr={layoutsArr}
                     removeLayoutStart={removeLayoutStart}
                     thetoken={thetoken}
                  />
               </tbody>
            </Table>
            <Loading msgVisible={msgVisible} />
         </div>
      </div>
   );
};

const spacer = {
   width: "100%",
   padding: 10,
};
