import React, { useState, useEffect } from 'react';
import { Alert, Button,  FormGroup, Input, Label, Spinner } from 'reactstrap';
import { addLayout } from '../PlayListFunctions'
import { getDonorCats } from '../DonorFunctions'
import { getMedia } from '../MediaFunctions'
import localForage from 'localforage'

export const AddLayoutForm = (props) => {

    const [title, setTitle] = useState('My Layout ')
    const [sequenceId, setSequenceId] = useState(5)
    const [group, setGroup] = useState('None Specified')
    const [fadeIn, setFadeIn] = useState('10')
    const [fadeOut, setFadeOut] = useState('10')
    const [duration, setDuration] = useState('30')
    const [layout, setLayout] = useState('artistic')
    const [asset, setAsset] = useState('None Specified')
    const [donorLevel, setDonorLevel] = useState('None Specified')
    const [type, setType] = useState('None Specified')
    const [text, setText] = useState('')
    const [quote, setQuote] = useState('')

    const [mediaObj, setMediaObj] = useState([])
    const [donorCatsArr, setDonorCatsArr] = useState([])
    const [spinClass, setSpinClass] = useState('visible')
    const [alertClass, setAlertClass] = useState('primary')
    const [alertMsg, setAlertMsg] = useState('Loading media....')
    const [thetoken, setThetoken] = useState('Token not Set');
    //const [errors, setErrors] = useState('')

    function onSubmit(e) {
        e.preventDefault()
    
        // do validation
        var errMsg = ''
        //if( id === undefined || id === '') errMsg += "\n\tID missing, "
        if( fadeIn === undefined || fadeIn === '') errMsg += "\n\tFade in requires a numeric value , "
        if( fadeOut === undefined || fadeOut === '') errMsg += "\n\tFade out requires a numeric value,  "
        if( duration === undefined || duration === '') errMsg += "\n\tDuration requires a numeric value, "
    
        if(errMsg !== ''){
            setAlertClass('visible')
            setAlertMsg('Error:' + errMsg )
        } else {
            const newLayout = {
                title: title,
                sequenceId: sequenceId,
                group: group,
                fadeIn: fadeIn,
                fadeOut: fadeOut,
                duration: duration,
                layout: layout,
                asset: asset,
                donorLevel: donorLevel,
                type: type,
                text: text,
                quote: quote
            }
            addLayout(newLayout,props.thetoken).then( res => {
                if(res !== undefined){
                    alert('New playlist has been uploaded')
                    props.toggle()
                   
                    setTimeout(() => {
                        let refresh = document.location.href
                        document.location.href = refresh
                    }, 500); // delay while modal receeds
                
                }
    
            }).catch( err => {
                console.log('Err: addLayout ->   ' + err)
            })
        }

    }

    useEffect(() => { 
        
        console.log("In use effect \n donorCats=")
        if(thetoken === 'Token not Set'){
            localForage.getItem('token', function(err, startToken) {
                setThetoken(startToken)
                getMedia(startToken).then( res => {
                    getDonorCats(startToken).then(res2 => {
                        if(res !== false && res2 !== false) {
                            setDonorCatsArr(res2)
                            setMediaObj(res)
                            setAlertMsg('Media has loaded')
                        } else {
                            setAlertMsg('Token has expired')
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 5000);
                        }
                        setSpinClass('hid')
                    })
                })
            });
        }
    }, [thetoken])


    return (
        <form noValidate onSubmit={onSubmit}>
            <Alert color="primary" id="errmsg" className={alertClass}> 
                <Spinner type="grow" color="primary" className={spinClass}/><pre>{alertMsg}</pre>
            </Alert>
            <FormGroup>
            <Label for="name">Title</Label>
                <Input type="text" 
                        name="title" 
                        id="title" 
                        placeholder="Title (optional)"
                        value={title}
                        onChange={event => setTitle(event.target.value)}      
                        />
            </FormGroup>

            <FormGroup>
            <Label for="name">Sequence Id</Label>
                <Input type="text" 
                        name="sequenceId" 
                        id="sequenceId" 
                        placeholder="sequence id"
                        value={sequenceId}
                        onChange={event => setSequenceId(event.target.value)}      
                        />
            </FormGroup>

            <FormGroup>
            <Label for="name">Group</Label>
                <Input type="text" 
                        name="group" 
                        id="group"
                        placeholder="Group (optional)"
                        value={group}
                        onChange={event => setGroup(event.target.value)}      
                        />
            </FormGroup>

            <FormGroup>
            <Label for="name">Fade In (seconds)</Label>
                <Input type="text" 
                        name="fadeIn" 
                        id="fadeIn"
                        placeholder="Fade In (seconds)"
                        value={fadeIn}
                        onChange={event => setFadeIn(event.target.value)}      
                        />
            </FormGroup>

            <FormGroup>
            <Label for="name">Fade Out (seconds)</Label>
                <Input type="text" 
                        name="fadeOut" 
                        id="fadeOut"
                        placeholder="Fade Out (seconds)"
                        value={fadeOut}
                        onChange={event => setFadeOut(event.target.value)}      
                        />
            </FormGroup>


            <FormGroup>
            <Label for="name">Layout Duration</Label>
                <Input type="text" 
                        name="duration" 
                        id="duration"
                        placeholder="duration (seconds)"
                        value={duration}
                        onChange={event => setDuration(event.target.value)}      
                        />
            </FormGroup>

            <FormGroup>
                <Label for="placement">Layout</Label>
                <Input type="select" onChange={event => setLayout(event.target.value)}   
                    name="layout" 
                    id="layout" 
                    placeholder="layout" 
                    value={layout}>
                        <option value="artistic">artistic</option>
                        <option value="bgImage">bgImage</option>
                        <option value="fullScreen">fullScreen</option>
                        <option value="hangingQuote">hangingQuote</option>
                        <option value="names">names</option>
                        <option value="nameList">nameList</option>
                        <option value="profilesFullscreen">profilesFullscreen</option>
                        <option value="text">text</option>
                        <option value="thankYou">thankYou</option>
                        <option value="titleSection">titleSection</option>
                </Input>                    
            </FormGroup>

            <FormGroup>
                <Label for="placement">Asset</Label>
                <Input type="select" onChange={event => setAsset(event.target.value)}   
                    name="asset" 
                    id="asset" 
                    placeholder="asset" 
                    value={asset}>
                        <option value='None Specified'>NA</option>
                    {mediaObj.map(media => <option key={media.name} 
                                                   value={media.name}>{media.name}</option>)}                        

                </Input>                    
            </FormGroup>

            <FormGroup>
                <Label for="placement">Donor Level</Label>
                <Input type="select" onChange={event => setDonorLevel(event.target.value)}   
                    name="donorLevel" 
                    id="donorLevel" 
                    placeholder="donorLevel" 
                    value={donorLevel}>
                        <option value='None Specified'>NA</option>
                        {donorCatsArr.map(cat => <option key={cat.donorKey} 
                                                   value={cat.donorKey}>{cat.donorKey}</option>)}   
                </Input>                    
            </FormGroup>

            <FormGroup>
                <Label for="placement">Type</Label>
                <Input type="select" onChange={event => setType(event.target.value)}   
                    name="type" 
                    id="type" 
                    placeholder="type" 
                    value={type}>
                        <option value='None Specified'>NA</option>
                        <option value="dissolve">dissolve</option>
                        <option value="fade">fade</option>
                </Input>                    
            </FormGroup>

            <FormGroup>
                <Label for="text">Text</Label>
                <Input type="textarea" 
                        name="text" 
                        id="text" 
                        onChange={event => setText(event.target.value)}  />
            </FormGroup>

            <FormGroup>
                <Label for="text">Quote</Label>
                <Input type="textarea" 
                        name="quote" 
                        id="quote"
                        onChange={event => setQuote(event.target.value)}  />
            </FormGroup>


            <Button type="submit" color="primary" block>Submit</Button>
            
        </form>
    )

}