import React, { useState, useEffect } from "react";
import { getDonors, donorSwap, updateDonorsSQL, deleteSQL, deleteGroupFunct, updateKey } from './DonorFunctions'
import { sizeSideBar } from './_sharedFunctions'
import arraySort from 'array-sort'
import { ModalAddDonor } from './ModalAddDonor'
import { InputGroup, InputGroupAddon, Input, Button,Col, Spinner } from 'reactstrap';
import localForage from 'localforage'

 const Loading = (props) => {

  return (
      <div className={props.msgVisible}>
        <br />
        <center>
          <Spinner type="grow" color="blue"/> Loading Donors ...
        </center>
          
      </div>
  )
}

const Adonor = (props) => {

  return (
    <div className={"donors__edit__table-row flex_container_row font-gray " + props.bgc} >
        <input type="hidden" id="did" value={ props.id } />
        <input type="hidden" id="order" value="5" />

        <div className="donors__edit__table-item center flex-1 hide_query">
            <i aria-hidden="true" className="fa fa-arrow-up headerr_link" id={"au-" + props.id }  
              onClick={props.ArrowClick.bind(this)}></i>
        </div>
        <div className="donors__edit__table-item flex-1 hide_query ">
            <i aria-hidden="true" className="fa fa-arrow-down headerr_link" id={"ad-" + props.id } 
              onClick={props.ArrowClick.bind(this)}></i>
        </div>

        <div className="donors__edit__table-item flex-1 show_query display-none" >
            <span>&nbsp;</span>
        </div>
        {/* Name */}
        <div className="donors__edit__table-item flex-5" id={"donor-" + props.id }>
            <div style={{display: props.txtNamevs}} >
            { props.donorName }
            </div>
            <div style={{display:  props.inputNamevs}} >
                    <input type="text" defaultValue={ props.donorName } id={"dn-" + props.id } 
                    onChange={event => props.setTxtDonor(event.target.value)}    />
            </div>
        </div>
        {/* Letter */}
        <div className="donors__edit__table-item flex-1 floatl" id={"let-" + props.id }>
            <div style={{display:  props.txtLettervs}} >
                    {props.letter}
            </div>
            <div style={{display:  props.inputLettervs}} >
                    <input type="text" defaultValue={props.letter} id={"dl-" + props.id } size="3" 
                      onChange={event => props.setTxtLetter(event.target.value)} />
            </div>
        </div>
    
        <div className="donors__edit__table-item flex-1 show_query display-none" >
            <span>&nbsp;</span>
        </div>  
        {/* Del / Save */}
        <div className="donors__edit__table-item flex-2">
              <div className="btn deleteBtn" id={"del-" + props.id } style={{display:  props.delvs}} onClick={props.delDon.bind(this)}>
                  <i aria-hidden="true" className="fa fa-trash-o deleteBtn" 
                    id={"delb-" + props.id } onClick={props.delDon.bind(this)}></i>
              </div>
              <div className="btn saveBtn " id={"save-" + props.id } style={{display:  props.savevs }}  onClick={props.saveEdit.bind(this)}>
                  <i aria-hidden="true" className="fa fa-floppy-o saveBtn" 
                    id={"savei-" + props.id }  onClick={props.saveEdit.bind(this)}></i>
              </div>
        </div>
        {/* pencil(edit) / cancel */}
        <div className="donors__edit__table-item flex-2">
              <div className="btn editBtn" id={"edit-" + props.id } style={{display:  props.editvs }}>
                  <i aria-hidden="true" className="fa fa-pencil-square-o editd editBtnIcon" id={"editI-" + props.id } onClick={props.editDon.bind(this)}></i>
              </div>
              <div className="btn cancelBtn startHid" id={"can-" + props.id } style={{display: props.cancelvs }}  onClick={props.cancel.bind(this)}>
                <i aria-hidden="true" className="fa fa-reply cancelBtn" id={"reset-" + props.id }  onClick={props.cancel.bind(this)}></i>
              </div>
        </div>
    </div>
  )
}

const Alldonors = (props) => {

  var tog = false, bgc, first, last, arrowsArr = [];
  
  // the following is to stripe the lines for easier visuals
  props.donorArr.forEach( (e,i) => {
    // get first and last because need to remove first and last sort arrows
    if(first === undefined) first = e.id.toString();
    last = e.id.toString();
    tog === false ? bgc = 'whitebg' : bgc = 'graybg'
    tog =! tog; 
    props.donorArr[i].bgc = bgc;
    arrowsArr.push('au-' + e.id.toString())
    arrowsArr.push('ad-' + e.id.toString())
  })

  if(props.searchLetter === false){ // only show arrows when search letter filter is not applied
    setTimeout(() => {
      arrowsArr.forEach( (e,i) => {
        if(document.getElementById(e) !== null && document.getElementById(e) !== undefined){
          document.getElementById(e).style.display = 'block'  // make all arrows viewable
        }
      })
      // then hide first and last (up down respectively)
      if(document.getElementById('au-' + first)){
        document.getElementById('au-' + first).style.display = 'none'
        document.getElementById('ad-' + last).style.display = 'none'
      }
    }, 250);
  } else {
    arrowsArr.forEach( (e,i) => {
      document.getElementById(e).style.display = 'none'  // make all arrows viewable
    })
  }


  return(
    props.donorArr.map(donor => <Adonor
        id={donor.id }
        key={donor.id}
        bgc={donor.bgc}
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
      />)
  )
}

export const Donors = () => {

  const [donorArr, setDonorArr] = useState([]),
        [donorArr2, setDonorArr2] = useState([]),
  			[searchLetter, setSearchLetter] = useState(false),
  			[txtDonor, setTxtDonor] = useState(''),
  			[txtLetter, setTxtLetter] = useState(''),
  			[theLetter, setTheLetter] = useState(''),
  			[thetoken, setThetoken] = useState('Token not Set'),
  			[title,setTitle] = useState(''),
  			[oldKey,setOldKey] = useState(''),
  			[titleTxtDisplay,setTitleTxtDisplay] = useState('block'),
  			[titleInputDisplay,setTitleInputDisplay] = useState('none'),
        [ msgVisible, setMsgVisible] = useState('visible')

  const saveEdit = (e) => {  // edit donor click function
    e.stopPropagation(); e.preventDefault();
    let [,id] = e.target.id.toString().split('-');
    id = parseInt(id)
    donorArr.forEach( (e,i) => {
      if(e.id === id){
        e.delvs = 'block'  // vs = view style
        e.savevs = 'none'
        e.editvs = 'block'
        e.cancelvs = 'none'
        e.txtNamevs = 'block'
        e.inputNamevs = 'none'
        e.txtLettervs = 'block'
        e.inputLettervs = 'none'
        e.letter = txtLetter
        e.donorName = txtDonor
      }
    })

    setDonorArr([...donorArr])
    
    //updateSQL(id, [{txtLetter:'letter'}]txtDonor}], [{'letter','donorName'}], 'Donor')
    var updIds = [id,id]
    var updNewVals = [txtLetter,txtDonor]
    var updField = ['letter','donorName']
    updateDonorsSQL(updIds, updNewVals, updField, thetoken)
  }

  const editDon = (e) => {  // edit donor click function
    e.stopPropagation(); e.preventDefault();
    let [,id] = e.target.id.toString().split('-');
    id = parseInt(id)

    donorArr.forEach( (e,i) => {
      if(e.id === id){
        e.delvs = 'none'  // vs = view style
        e.savevs = 'block'
        e.editvs = 'none'
        e.cancelvs = 'block'
        e.txtNamevs = 'none'
        e.inputNamevs = 'block'
        e.txtLettervs = 'none'
        e.inputLettervs = 'block'
        setTxtDonor(e.donorName)  // set state to current row value
        setTxtLetter(e.letter)    // set state (letter) to current row value
      } else { // turn off the rest
        e.delvs = 'block'  // vs = view style
        e.savevs = 'none'
        e.editvs = 'block'
        e.cancelvs = 'none'
        e.txtNamevs = 'block'
        e.inputNamevs = 'none'
        e.txtLettervs = 'block'
        e.inputLettervs = 'none'
      }
    })
    setDonorArr([...donorArr])
  }

  const cancel = (e) => {  // edit donor click function
    e.stopPropagation(); e.preventDefault();
    let [,id] = e.target.id.toString().split('-');
    id = parseInt(id)

    donorArr.forEach( (e,i) => {
      if(e.id === id){
        e.delvs = 'block'  // vs = view style
        e.savevs = 'none'
        e.editvs = 'block'
        e.cancelvs = 'none'
        e.txtNamevs = 'block'
        e.inputNamevs = 'none'
        e.txtLettervs = 'block'
        e.inputLettervs = 'none'
      }
    })
    setDonorArr([...donorArr])
  }

  const delDon = (e) => { // delete donor click function
    e.stopPropagation(); e.preventDefault();
    let [,id] = e.target.id.toString().split('-');
    id = parseInt(id)
    setDonorArr([...donorArr.filter(donor => donor.id !== id)])
    deleteSQL(id,'Donors',thetoken).then( (res) => {
      console.log(res)
    })
  }
  
  const ArrowClick = (e) => {
    let donorArrNS = donorArr
    e.stopPropagation(); e.preventDefault();

    var ret2 = donorSwap(e.target.id, donorArrNS)
    if(ret2.updArr !== undefined && ret2.updArr.length > 2){
        setDonorArr([...ret2.updArr])
        ret2.updArr = [] // empty array so the object is smaller
        var updIds = [ret2.displacedID,ret2.clkID]
        var updNewVals = [ret2.displacedNewOrderNo,ret2.clkNewOrderNo]
        var updField = ['donor_order','donor_order']
        updateDonorsSQL(updIds, updNewVals, updField,thetoken)
          .then(res => {console.log(res)})
    } 
  }


  const deleteGroup = (e) => {
    if(typeof e !==  undefined){
      e.stopPropagation(); e.preventDefault();
      let temp = window.location.href.toString().split('/')
      let rest = temp[temp.length -1].toString()
  
      if( window.confirm("Are you sure you want to delete the group ?") ){
          alert('got here')
          deleteGroupFunct(rest,thetoken).then( () => {
            window.location.href = '/donor_cats'
          })
      } else{
          return false;
      }    
    }
  }

  const editGroup = (e) => {
    e.stopPropagation()
    setTitleTxtDisplay('none')
    setTitleInputDisplay('block')
  }

  const cancelGroup = (e) => {
    e.stopPropagation()
    setTitleTxtDisplay('block')
    setTitleInputDisplay('none')
  }

  const updKey = () => {
    updateKey(title,oldKey,thetoken).then( ()=> {
      let refresh = document.location.href
      document.location.href = refresh.toString().replace(oldKey,title)
    })
  }

  const letChange = (e) => {
    let l = e.target.value
    setTheLetter(l.toUpperCase())
    if(l.length > 1){   // if more than one letter is entered - truncate
      l = l.charAt(2);
      setTheLetter(l.toUpperCase())
    }
    
    if(l === undefined || l === ''){
      setDonorArr(donorArr2)
      setSearchLetter(false)
    } else {
      setSearchLetter(true)
      let lu = l.toUpperCase();
      let filteredDonorArr=  donorArr2.filter( entry => ( entry.letter === l || entry.letter === lu))
      setDonorArr(filteredDonorArr)
    }
  }

  useEffect(() => { 
 
      document.getElementById('rendered').style.display = 'none'
      document.body.style.background = "#ffffff";
      window.addEventListener('resize', sizeSideBar);
      sizeSideBar();

      localForage.getItem('token', function(err, startToken) {
        setThetoken(startToken)
        setTimeout(() => {
          if(thetoken !== 'Token not Set'){

            let temp = window.location.href.toString().split('/')
            let rest = temp[temp.length -1].toString()
            setTitle(rest);
            setOldKey(rest)
            //rest attribute being sent is url REST to specify which grp returned
            getDonors(rest,thetoken).then(data => {
                // do origonal sort by     
                setMsgVisible('hid')      
                data = arraySort(data, 'donor_order')

                data.forEach( (e,i) => {
                  e.delvs = 'block'  // vs = view style
                  e.savevs = 'none'
                  e.editvs = 'block'
                  e.cancelvs = 'none'

                  e.txtNamevs = 'block'  // vs = view style
                  e.inputNamevs = 'none'
                  e.txtLettervs = 'block'
                  e.inputLettervs = 'none'
                })
                setDonorArr(data) 
                setDonorArr2(data) // state is changed here - now will repaint
                document.getElementById('rendered').style.display = 'block'
            })

          }
        }, 100);
      })


  },[thetoken]);


  return(
    <div id="main" donorarr={donorArr}>
        
        <ModalAddDonor letChange={letChange} 
                      searchLetter={searchLetter} 
                      theLetter={theLetter}/>
        
        <div id="rendered">
            <div className="donors__edit__list-title flex_container_row">
                <div className="donors__edit__title-box" id="title_box">
                  <div style={{display: titleTxtDisplay}}>{title}</div>  
                  <div style={{display: titleInputDisplay}}>
                    <Col md={4}>
                      <InputGroup>
                        <Input bsSize="sm" value={title} onChange={event => setTitle(event.target.value)} />
                        <InputGroupAddon addonType="append"><Button color="success" onClick={updKey}>update</Button></InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </div>
                </div>
                
                <div style={{display: titleInputDisplay}} className="buttonLG dgroup" onClick={cancelGroup}>
                  &#8635;
                </div>                
                <div style={{display: titleTxtDisplay}} className="buttonLG dgroup" onClick={editGroup.bind(this)}>
                  <i className="fa fa-edit dgroup"  aria-hidden="true" onClick={editGroup.bind(this)}></i>
                </div>
                <div className="buttonLG dgroup" onClick={deleteGroup.bind(this)}>
                  <i className="fa fa-trash dgroup"  aria-hidden="true" onClick={deleteGroup.bind(this)}></i>
                </div>

                <button className="save startHid" id="edit_dcat"></button>
            </div>
        </div>


        <div className="donors__edit__table-header flex_container_row no-shrink">
            <div className="donors__edit__table-item center flex-1 hide_query">
                <span><i aria-hidden="true" className="fa fa-arrow-up "></i></span>
            </div>
            <div className="donors__edit__table-item flex-1 hide_query">
                <span><i aria-hidden="true" className="fa fa-arrow-down"></i></span>
            </div>
            <div className="donors__edit__table-item flex-1 show_query display-none" >
                <span>&nbsp;</span>
            </div>
            <div className="donors__edit__table-item flex-5">
                Name
            </div>
            <div className="donors__edit__table-item center flex-1 floatr">
                Letter
            </div>

            <div className="donors__edit__table-item flex-1 show_query display-none">
                <span>&nbsp;</span>
            </div>                        
            <div className="donors__edit__table-item flex-2">
                Delete
            </div>
            <div className="donors__edit__table-item flex-2">
                Edit
            </div>
        </div>

        <div id="AllDonorsWrapper" style={adr}>

          <Alldonors donorArr={donorArr} 
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
          <Loading msgVisible={msgVisible}/>
        </div>
        


    </div>  
  )
}

const adr = {
  marginRight:'10px'
}