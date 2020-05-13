//import React, { Component } from 'react'
import React, { useState, useEffect } from "react";
import { getDonorCats, updateCounters } from './DonorFunctions'
import { sizeSideBar } from './_sharedFunctions'
//import { ModalUploadCsv } from './ModalUploadCsv' 
import localForage from 'localforage'
import { Spinner } from 'reactstrap';


const Loading = (props) => {

  return (
      <div className={props.msgVisible}>
        <br />
        <center>
          <Spinner type="grow" color="blue"/> Loading Donor Categories ...
        </center>
          
      </div>
  )
}

const DonorCat = props => {
  let tid = props.title; //.replace(/\D/g,'');
  let title = props.title.toString()
    .replace('2500000','2.5M')
    .replace('0000000','0M')
    .replace('000000','M')
    .replace('00000','00K')
    .replace('0000','0K')
    .replace('000','K')
    .replace('lifetime','')
  return(
    <div className="donors__list-item flex_container_column margin-bot8">
        <div className="donors__list-item-header flex_container_row">
            <p className="donors__list-item-title">{title}</p>
            <div className="buttonLG dgroup" id={tid}>
                <i className="fa fa-edit dgroup" id={""+tid} aria-hidden="true"></i>
            </div>
        </div>
        <div className="donors__list-item-info flex_container_column outlines">
            <p># of Entries: {props.count}</p>
            <p>Last edited: {props.date}</p>
            <p>Edited By: Admin</p>

        </div>
    </div>    
  )
}

const AllDonorCats = (props) => {

  return(
    <React.Fragment>
      {props.donorCats.map(dc => 
        <DonorCat author={dc.author} 
                  date={dc.date} 
                  count={dc.count}
                  title={dc.donorKey}
                  key={dc.donorKey}
        />        
        )}
    </React.Fragment>
  )
}

export const DonorCats = () => {

  const [ donorCats, setDonorCats ] = useState([]),
        [ thetoken, setThetoken ] = useState('Token not Set'),
        [ msgVisible, setMsgVisible ] = useState('visible'),
        butClick = (e) => window.location.href = '/getdonors/' + e.target.id

  useEffect(() => {    
    document.body.style.background = "#ffffff";
    window.addEventListener('resize', sizeSideBar);
  
    sizeSideBar();
    localForage.getItem('token', function(err, startToken) {
      setThetoken(startToken)
      setTimeout(() => {
        if(thetoken !== 'Token not Set'){
            setMsgVisible('hid')
            updateCounters(thetoken).then( ()=> {
                getDonorCats(thetoken).then(data => {
                    setDonorCats(data) // state is changed here - now will repaint
                    // add listener to each of the clicked edit icons
                    var c = document.getElementsByClassName("dgroup");
                    for (var i = 0; i < c.length; i++) c[i].addEventListener('click', butClick, false);
                })
            })
          }
        }, 1000);
      })
  }, [thetoken]);
  
  return (
    <div id="main" >

      <div className="donorCatsRow" id="donor_rows">
        {/*<ModalUploadCsv thetoken={thetoken}/>*/}
        <AllDonorCats donorCats={donorCats} thetoken={thetoken}/>
        <Loading msgVisible={msgVisible}/>
      </div>
      
    </div>
  )
}

