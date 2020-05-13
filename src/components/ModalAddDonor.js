import React, { useState } from 'react';
import { Alert, Button,  FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { addDonor } from './DonorFunctions'

const bstyle = () => {
    return {
        backgroundColor:'#cccccc',
        float:'right'
      }
}

/////////////

const AddDonorForm = (props) => {

    let tmp = document.location.href.toString().split('/')

    const [donorKey, setDonorKey] = useState(tmp[tmp.length-1]) // from url
    const [donorName, setDonorName] = useState('')
    const [letter, setLetter] = useState('')
    const [alertClass, setAlertClass] = useState('hid')
    const [alertMsg, setAlertMsg] = useState('')
    //const [errors, setErrors] = useState('')

    function onSubmit(e) {
        e.preventDefault()
    
        // do validation

        let errs = [];
        if(donorKey === undefined || donorKey.length < 1) errs.push('Donor Key Invalid')
        if(donorName === undefined || donorName.length < 1) errs.push('Donor Name Invalid')
        if(letter === undefined || letter.length < 1) errs.push('Letter Invalid')

        if(errs[0] !== undefined){
            let clerr = 'Donor not added:' 
            errs.forEach( (e,i) => {
                clerr += "\n, " + e 
            })
            setAlertClass('visible')
            setAlertMsg(clerr)
        } else {
            const newDonor = {
                donorKey: donorKey,
                donorName: donorName,
                letter: letter,
                donor_order: '999',
                bgc: 'dummy',
                thetoken:props.thetoken
            }
            addDonor(newDonor).then( res => {
                console.log(res)
                if(res !== undefined){
                    alert('New donor has been uploaded')
                    props.toggle()
                    setTimeout(() => {
                        let refresh = document.location.href
                        document.location.href = refresh
                    }, 500); // delay while modal receeds 
                }
    
            }).catch( err => {
                console.log('Error #111: ' + err)
            })
        }

    }

    return (
    <form noValidate onSubmit={onSubmit}>
        <Alert color="info" id="errmsg" className={alertClass}>{alertMsg}</Alert>
        <FormGroup>
            <Input type="text" 
                    name="donorKey" 
                    id="fdonorKey" 
                    placeholder="Donor Key" 
                    value={donorKey}
                    onChange={event => setDonorKey(event.target.value)}      
                    />
        </FormGroup>

        <FormGroup>
          <Input type="text" 
                name="donorName" 
                id="donorName" 
                placeholder="Donor Name" 
                value={donorName}
                onChange={event => setDonorName(event.target.value)}       
                />
        </FormGroup>
        <FormGroup>
          <Input type="text" 
                name="letter" 
                id="letter" 
                placeholder="Letter"
                value={letter}
                onChange={event => setLetter(event.target.value)}      
                />
        </FormGroup>


        <Button type="submit" color="primary" block>Submit</Button>
        
      </form>
    );
  }

export const ModalAddDonor = (props) => {


    const { className } = props;
    const [modal, setModal] = useState(false);
    
    const toggle = () => setModal(!modal);

    return (
        <div>
            <div className="donors__edit__add-donor only-button flex_container_row no-shrink" style={{bstyle}}>
            
                <input  className="ng-untouched ng-pristine ng-valid" 
                    placeholder="Letter" 
                    type="text" 
                    id="live_letter" 
                    value={props.theLetter}
                    onChange={props.letChange.bind(this)}
                    size="5"/>
                
                <button id="addDonor" onClick={toggle}>Add New Donor</button>
            </div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}> Add Donor</ModalHeader>
                <ModalBody>
                    <AddDonorForm addDonorStart={props.addDonorStart} toggle={toggle}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}