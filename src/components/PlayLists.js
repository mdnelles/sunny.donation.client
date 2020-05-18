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

const PlaceholderWhileLoading = () => {
   {
      return <React.Fragment></React.Fragment>;
   }
};

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
      <React.Fragment key={"k" + props.kk}>
         <tr>
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
         key={props.id}
         kk={props.id}
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
         <tr key={props.kk}>
            <td>
               {props.name}
               <br />
               {props.kk}
            </td>
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
   props.playListsArr.forEach((e) => {
      e.key = uuidv4();
   });
   return props.playListsArr.map((playlist) => (
      <PlayList
         kk={playlist.playlist_key.toString()}
         key={playlist.playlist_key.toString()}
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

let theLayouts;

export const PlayLists = () => {
   const [playListsArr, setPlayListsArr] = useState([]),
      [layoutsArr, setLayoutsArr] = useState([]),
      [thetoken, setThetoken] = useState("Token not Set"),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible"),
      [modal, setModal] = useState(false),
      [gotData, setGotData] = useState(false),
      [modalTitle, setModalTitle] = useState(false),
      [vis1, setVis1] = useState("none"),
      [vis2, setVis2] = useState("none"),
      [vis3, setVis3] = useState("none");

   const pretoggle = (e) => {
      setVis1("none");
      setVis2("none");
      setVis3("none");

      if (e.target.id === "addPlaylist") {
         setVis1("block");
         setModalTitle("Add Playlist");
      } else if (e.target.id === "addLayout") {
         setVis2("block");
         setModalTitle("Add Layout");
      } else if (e.target.id === "howTo") {
         setVis3("block");
         setModalTitle("How To");
      }

      setModal(!modal);
   };

   const toggle = () => setModal(!modal);

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
         var [, id] = e.target.id.toString().split("-");
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

   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   // on page load / componentDidMount
   useEffect(() => {
      if (gotData === false) {
         localForage.getItem("token", function (err, startToken) {
            setThetoken(startToken);
            setTimeout(() => {
               if (thetoken !== "Token not Set") {
                  getLayouts(thetoken).then((res2) => {
                     getPlayLists(thetoken).then((res1) => {
                        setMsgVisible("hid");
                        if (
                           res2 !== undefined &&
                           res2 !== [] &&
                           res2 !== false
                        ) {
                           res2 = doStripe(res2);
                           setLayoutsArr(res2);
                        }
                        if (
                           res1 !== undefined &&
                           res1 !== false &&
                           res1 !== []
                        ) {
                           res1 = doStripe(res1);
                           setPlayListsArr(res1);
                        }
                        setGotData(true);
                     });
                  });
               }
            }, 100);
         });
      }
   }, [thetoken, modal]);

   {
      layoutsArr !== undefined && layoutsArr.length > 1
         ? (theLayouts = (
              <Layouts
                 layoutsArr={layoutsArr}
                 removeLayoutStart={removeLayoutStart}
                 thetoken={thetoken}
                 key={uuidv4()}
              />
           ))
         : (theLayouts = <PlaceholderWhileLoading />);
   }

   return (
      <div className='appBody'>
         <h4>Playlists</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
            <Button
               color='primary'
               id='addPlaylist'
               onClick={(event) => pretoggle(event)}
            >
               Add Playlist
            </Button>
            <Button
               color='primary'
               id='addLayout'
               onClick={(event) => pretoggle(event)}
            >
               Add Layout
            </Button>
            <Button
               color='primary'
               id='howTo'
               onClick={(event) => pretoggle(event)}
            >
               How To
            </Button>
         </ButtonGroup>
         <div className={"p-1 rounded " + toastVisibility}>
            <MyToast
               title='Playlist'
               body='This is Where playlist and layouts are made.  For more help use the HOW TO diagram.'
            />
         </div>
         <ModalAddPlayList
            thetoken={thetoken}
            modalTitle={modalTitle}
            pretoggle={pretoggle}
            modal={modal}
            toggle={toggle}
            vis1={vis1}
            vis2={vis2}
            vis3={vis3}
         />

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
               <tbody>{theLayouts}</tbody>
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
