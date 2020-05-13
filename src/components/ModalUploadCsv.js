import React, { useState } from 'react';
import { Alert, Button,  FormGroup,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


/////////////

const UploadCSVForm = (props) => {

    return (
        <div>
            <Alert color="danger" id="errmsg" className="hideStart"></Alert>
            

            <form method="post" encType="multipart/form-data" >

                <Alert color="dark">
                        Playlist CSV Format:<br /><br />
                        "id","donorKey","donorName","Letter","donor_order"
                </Alert>

                <FormGroup>
                    <input type="file" id="file" color="primary"  />
                </FormGroup>
                <Button type="submit" color="primary" block  onClick={onClick}>Submit</Button>

            </form>

        </div>
    );
  }


  export const ModalUploadCsv = (props) => {

    const {className } = props;
    const [modal, setModal] = useState(false);
    const [alertClass, setAlertClass] = useState('hid');
    const [alertText, setAlertText] = useState('');
    const toggle = () => setModal(!modal);

    return (
        <div>
            <div className="donors__CSV-upload flex_container_row pad5">
                <Alert color="success" className={alertClass}>
                    {alertText}
                </Alert>
            </div>


            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}> Upload CSV</ModalHeader>
                <ModalBody>
                    <UploadCSVForm addCSVStart={props.addCSVStart} toggle={toggle}/>
                </ModalBody>
                <ModalFooter>
                {/*<Button color="secondary" onClick={toggle}>Cancel</Button>*/}
                </ModalFooter>
            </Modal>

        </div>
    );
}


export default ModalUploadCsv;