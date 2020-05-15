import React, { useState } from "react";
import {
   Alert,
   Button,
   Col,
   FormGroup,
   Input,
   Label,
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Row,
} from "reactstrap";
import { v4 as uuidv4 } from "uuid";

const AddDonorForm = (props) => {
   let tmp = document.location.href.toString().split("/");

   const [donorKey, setDonorKey] = useState(tmp[tmp.length - 1]); // from url
   const [donorName, setDonorName] = useState("");
   const [letter, setLetter] = useState("");
   const [alertClass, setAlertClass] = useState("hid");
   const [alertMsg, setAlertMsg] = useState("");
   //const [errors, setErrors] = useState('')

   function onSubmit(e) {
      e.preventDefault();

      // do validation

      let errs = [];
      if (donorKey === undefined || donorKey.length < 1)
         errs.push("Donor Key Invalid");
      if (donorName === undefined || donorName.length < 1)
         errs.push("Donor Name Invalid");
      if (letter === undefined || letter.length < 1)
         errs.push("Letter Invalid");

      if (errs[0] !== undefined) {
         let clerr = "Donor not added:";
         errs.forEach((e, i) => {
            clerr += "\n, " + e;
         });
         setAlertClass("visible");
         setAlertMsg(clerr);
      } else {
         let id = uuidv4();
         let letterUpper = letter.replace(/^./, (lt) => lt.toUpperCase());
         let donorNameFormatted = donorName.replace(/^./, (don) =>
            don.toUpperCase()
         );
         const newDonor = {
            id: id,
            donorKey: donorKey,
            donorName: donorNameFormatted,
            letter: letterUpper,
            donor_order: "999",
            bgc: "dummy",
            thetoken: props.thetoken,
         };

         props.addDonorObj(newDonor);
         setTimeout(() => {
            props.toggle();
         }, 500);
         {
            /* 
                 addDonor(newDonor)
            .then((res) => {
               console.log(res);
               if (res !== undefined) {
                  alert("New donor has been uploaded");
                  props.toggle();
                  setTimeout(() => {
                     let refresh = document.location.href;
                     document.location.href = refresh;
                  }, 500); // delay while modal receeds
               }
            })
            .catch((err) => {
               console.log("Error #111: " + err);
            });
        */
         }
      }
   }

   return (
      <form noValidate onSubmit={onSubmit}>
         <Alert color='info' id='errmsg' className={alertClass}>
            {alertMsg}
         </Alert>
         <FormGroup>
            <Input
               type='text'
               name='donorKey'
               id='fdonorKey'
               placeholder='Donor Key'
               value={donorKey}
               onChange={(event) => setDonorKey(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Input
               type='text'
               name='donorName'
               id='donorName'
               placeholder='Donor Name'
               value={donorName}
               onChange={(event) => setDonorName(event.target.value)}
            />
         </FormGroup>
         <FormGroup>
            <Input
               type='text'
               name='letter'
               id='letter'
               placeholder='Letter'
               value={letter}
               onChange={(event) => setLetter(event.target.value)}
            />
         </FormGroup>

         <Button type='submit' color='primary' block>
            Submit
         </Button>
      </form>
   );
};

export const ModalAddDonor = (props) => {
   const { className } = props;
   const [modal, setModal] = useState(false);

   return (
      <div>
         <Row>
            <Col sm='12' md={{ size: 4, offset: 3 }}>
               <table>
                  <thead>
                     <tr>
                        <td>
                           <span style={{ fontSize: "1.2em", marginRight: 10 }}>
                              Limit By Letter
                           </span>
                        </td>
                        <td>
                           <Input
                              style={{ width: 40 }}
                              type='text'
                              id='live_letter'
                              value={props.theLetter}
                              onChange={props.letChange.bind(this)}
                           />
                        </td>
                     </tr>
                  </thead>
               </table>
            </Col>
         </Row>

         <Modal
            isOpen={props.modal}
            toggle={() => props.toggle()}
            className={className}
         >
            <ModalHeader toggle={() => props.toggle()}> Add Donor</ModalHeader>
            <ModalBody>
               <AddDonorForm
                  addDonorStart={props.addDonorStart}
                  toggle={() => props.toggle()}
                  addDonorObj={props.addDonorObj}
               />
            </ModalBody>
            <ModalFooter>
               <Button color='secondary' onClick={() => props.toggle()}>
                  Cancel
               </Button>
            </ModalFooter>
         </Modal>
      </div>
   );
};
