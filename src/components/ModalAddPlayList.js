import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { AddPlayListForm } from './_forms/AddPlayListForm'
import { AddLayoutForm } from './_forms/AddLayoutForm'

const bstyle = () => {
    return {
        backgroundColor:'#cccccc',
        float:'right'
      }
}

/////////////

const AddPlaylist = props => {
    const isVisible = { display:props.visability }
    return (
    <div style={isVisible}>
        <AddPlayListForm toggle={props.toggle} thetoken={props.thetoken}/>
    </div>
    );
  }

const AddLayout = props => {
    const isVisible = { display:props.visability }
    return (
        <div style={isVisible}>
            <AddLayoutForm toggle={props.toggle} thetoken={props.thetoken} />
        </div>
    )
}

const HowTo = props => {
    const isVisible = { display:props.visability }
    return (
        <div style={isVisible}>
            <center>
                <img src="./img/howTo.jpg" alt="How to"/>
            </center>
        </div>
    )
}


export const ModalAddPlayList = (props) => {

    const { className } = props;
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(false);
    const [vis1, setVis1] = useState('none')
    const [vis2, setVis2] = useState('none')
    const [vis3, setVis3] = useState('none')

    const pretoggle = (e) => {
        setVis1('none')
        setVis2('none')
        setVis3('none')

        if(e.target.id === 'addPlaylist'){
            setVis1('block')
            setModalTitle('Add Playlist')
        } else if(e.target.id === 'addLayout') {
            setVis2('block')
            setModalTitle('Add Layout')
        } else if(e.target.id === 'howTo') {
            setVis3('block')
            setModalTitle('How To')
        }

        setModal(!modal);
    }
    
    const toggle = () => setModal(!modal);

    return (
        <div>
            <div className="playlists__edit__add-playlist only-button flex_container_row no-shrink" style={{bstyle}}>
            <div className="buttonGR" id="addPlaylist" onClick={pretoggle.bind(this)}>&#x2b; Add Playlist</div>
            <div className="leftpad15"></div>
            <div className="buttonGR" id="addLayout"onClick={pretoggle.bind(this)}> &#x2b; Add Layout</div>
            <div className="leftpad15"></div>
            <div className="buttonGR" id="howTo" onClick={pretoggle.bind(this)}> &#x2b; How To</div>

            </div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle} thetoken={props.thetoken}> {modalTitle}</ModalHeader>
                <ModalBody>
                    <AddPlaylist addPlaylistStart={props.addPlaylistStart} 
                                    toggle={toggle} 
                                    thetoken={props.thetoken}
                                    visability={vis1}/>
                    <AddLayout 
                        addPlaylistStart={props.addPlaylistStart} 
                        toggle={toggle}  
                        thetoken={props.thetoken}
                        visability={vis2}/>

                    <HowTo toggle={toggle} 
                            visability={vis3}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}