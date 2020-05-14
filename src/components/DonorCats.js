//import React, { Component } from 'react'
import React, { useState, useEffect } from "react";
import { getDonorCats, updateCounters } from "./DonorFunctions";
import { sizeSideBar } from "./_sharedFunctions";
//import { ModalUploadCsv } from './ModalUploadCsv'
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

const DonorCat = (props) => {
   let tid = props.title; //.replace(/\D/g,'');
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
      <div style={{ marginBottom: 5 }}>
         <div className='toastWrapper'>
            <div className='toastTitleBar'>
               <div className='leftToastTitle'>{title}</div>
               <div className='rightToastTitle'>
                  <p align='right'>
                     <img
                        src='./img/icon_blue_edit.png'
                        style={{ width: 40, height: 28 }}
                     />
                  </p>
               </div>
            </div>
            <div className='toastBody'>
               <ul>
                  <li># of Entries: {props.count}</li>
                  <li>Last edited: {props.date}</li>
                  <li>Edited By: Admin</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

const AllDonorCats = (props) => {
   return (
      <React.Fragment>
         {props.donorCats.map((dc) => (
            <DonorCat
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
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible"),
      butClick = (e) => (window.location.href = "/getdonors/" + e.target.id);

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
                     var c = document.getElementsByClassName("dgroup");
                     for (var i = 0; i < c.length; i++)
                        c[i].addEventListener("click", butClick, false);
                  });
               });
            }
         }, 1000);
      });
   }, [thetoken]);

   return (
      <div className='appBody'>
         <h4>Donor Catagories</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
         </ButtonGroup>
         <div className={"p-3 my-2 rounded " + toastVisibility}>
            <Toast>
               <ToastHeader>Donor Categories</ToastHeader>
               <ToastBody>
                  Donors are grouped in categories based on monetary
                  contributions. You can click the edit icon in each box to
                  query respectively.
               </ToastBody>
            </Toast>
         </div>
         <br />
         <Loading msgVisible={msgVisible} />
         <br />
         <div className='p-3  my-2 rounded'>
            {/*<ModalUploadCsv thetoken={thetoken}/>*/}
            <AllDonorCats donorCats={donorCats} thetoken={thetoken} />
         </div>
      </div>
   );
};
