import React, { useEffect, useState } from "react";
import {
   getPlayLists,
   getLayouts,
   removePlayList,
   removeLayout,
} from "./PlayListFunctions";
import { sizeSideBar } from "./_sharedFunctions";
import { ModalAddPlayList } from "./ModalAddPlayList";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import localForage from "localforage";
import { Spinner } from "reactstrap";

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
      <div
         className={
            "flex_container_row header_back pad5 marginRight " + props.bgc
         }
      >
         <div className='txt_div flex-3 font-gray leftpad15'>{props.title}</div>
         <div className='txt_div font-gray flex-2'>{props.layout}</div>
         <div className='txt_div font-gray flex-3'>{props.asset}</div>
         <div className='txt_div font-gray flex-1 marginRight'>
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
         </div>
      </div>
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
      <div
         className={
            "flex_container_row flex_container_row no-shrink pad5 marginRight " +
            props.bgc
         }
      >
         <div className='txt_div font-gray flex-3 leftpad15'>{props.name}</div>
         <div className='txt_div font-gray flex-3'>{props.author} </div>
         <div className='txt_div font-gray flex-2'>{props.startDate}</div>
         <div className='txt_div font-gray flex-1 '>
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
         </div>
      </div>
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

   // on page load / componentDidMount
   useEffect(() => {
      window.addEventListener("resize", sizeSideBar);
      sizeSideBar();
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
      <div id='main'>
         <ModalAddPlayList thetoken={thetoken} />

         <br />
         <h5>Play Lists</h5>
         <div className='donors__edit__table-header flex_container_row no-shrink pad5'>
            <div className='txt_div  font-white flex-3 leftpad15'>Playlist</div>
            <div className='txt_div font-white flex-3'>Author </div>
            <div className='txt_div font-white  flex-2'>StartDate</div>
            <div className='txt_div font-white  flex-1'></div>
         </div>

         <Playlists
            playListsArr={playListsArr}
            removePlayListStart={removePlayListStart}
            thetoken={thetoken}
         />
         <div style={spacer} />
         <Loading msgVisible={msgVisible} />

         <h5>Layouts</h5>
         <div className='donors__edit__table-header flex_container_row no-shrink'>
            <div className='txt_div  font-white flex-3 leftpad15'>Title</div>
            <div className='txt_div font-white flex-3'>Layout</div>
            <div className='txt_div font-white  flex-2'>Asset</div>
            <div className='txt_div font-white  flex-1'></div>
         </div>
         <Layouts
            layoutsArr={layoutsArr}
            removeLayoutStart={removeLayoutStart}
            thetoken={thetoken}
         />
         <Loading msgVisible={msgVisible} />
      </div>
   );
};

const spacer = {
   width: "100%",
   padding: 10,
};
