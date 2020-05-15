import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { AddPlayListForm } from "./_forms/AddPlayListForm";
import { AddLayoutForm } from "./_forms/AddLayoutForm";

const bstyle = () => {
   return {
      backgroundColor: "#cccccc",
      float: "right",
   };
};

/////////////

const AddPlaylist = (props) => {
   const isVisible = { display: props.visability };
   return (
      <div style={isVisible}>
         <AddPlayListForm toggle={props.toggle} thetoken={props.thetoken} />
      </div>
   );
};

const AddLayout = (props) => {
   const isVisible = { display: props.visability };
   return (
      <div style={isVisible}>
         <AddLayoutForm toggle={props.toggle} thetoken={props.thetoken} />
      </div>
   );
};

const HowTo = (props) => {
   const isVisible = { display: props.visability };
   return (
      <div style={isVisible}>
         <center>
            <img src='./img/howTo.jpg' alt='How to' />
         </center>
      </div>
   );
};

export const ModalAddPlayList = (props) => {
   return (
      <div>
         <div
            className='playlists__edit__add-playlist only-button flex_container_row no-shrink'
            style={{ bstyle }}
         >
            <div
               className='buttonGR'
               id='addPlaylist'
               onClick={(event) => props.pretoggle(event)}
            >
               &#x2b; Add Playlist
            </div>
            <div className='leftpad15'></div>
            <div
               className='buttonGR'
               id='addLayout'
               onClick={(event) => props.pretoggle(event)}
            >
               {" "}
               &#x2b; Add Layout
            </div>
            <div className='leftpad15'></div>
            <div
               className='buttonGR'
               id='howTo'
               onClick={(event) => props.pretoggle(event)}
            >
               {" "}
               &#x2b; How To
            </div>
         </div>
         <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle} thetoken={props.thetoken}>
               {" "}
               {props.modalTitle}
            </ModalHeader>
            <ModalBody>
               <AddPlaylist
                  addPlaylistStart={props.addPlaylistStart}
                  toggle={props.toggle}
                  thetoken={props.thetoken}
                  visability={props.vis1}
               />
               <AddLayout
                  addPlaylistStart={props.addPlaylistStart}
                  toggle={props.toggle}
                  thetoken={props.thetoken}
                  visability={props.vis2}
               />

               <HowTo toggle={props.toggle} visability={props.vis3} />
            </ModalBody>
            <ModalFooter>
               <Button color='secondary' onClick={props.toggle}>
                  Cancel
               </Button>
            </ModalFooter>
         </Modal>
      </div>
   );
};
