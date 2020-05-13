import React, { useState, useEffect } from "react";
import {
   Alert,
   Button,
   FormGroup,
   Input,
   Label,
   Spinner,
   Tooltip,
} from "reactstrap";
import { addPlayLists } from "./../PlayListFunctions";
import { get_date3 } from "./../_sharedFunctions";
import { getMedia } from "../MediaFunctions";
import localForage from "localforage";

import { v4 as uuidv4 } from "uuid";

export const AddPlayListForm = (props) => {
   const [PLnamep, setPLNamep] = useState("");
   const [placementp, setPlacementp] = useState("right");
   const [authorp, setAuthorp] = useState("Admin");
   const [datep, setDatep] = useState(get_date3);
   const [startDatep, setStartDatep] = useState(get_date3);
   const [endDatep, setEndDatep] = useState(get_date3);
   const [startTimep, setStartTimep] = useState("00:00:00");
   const [endTimep, setEndTimep] = useState("00:00:00");
   const [playOrderp, setPlayOrderp] = useState("0");
   const [durationp, setDurationp] = useState("30");
   const [transDurationp, setTransDurationp] = useState("10");
   const [fadeInp, setFadeInp] = useState("5");
   const [fadeOutp, setFadeOutp] = useState("5");
   const [typep, setTypep] = useState("None Specified");
   const [assetp, setAssetp] = useState("None Specified");
   const [idp, setIdp] = useState(uuidv4());
   const [layoutp, setLayoutp] = useState("artistic");
   const [bgMoviep, setBgMoviep] = useState("None Specified");
   const [solop, setSolop] = useState("true");

   const [mediaObjp, setMediaObjp] = useState([]);
   const [movieArrp, setMovieArrp] = useState([]);
   const [spinClassp, setSpinClassp] = useState("visible");
   const [alertClassp, setAlertClassp] = useState("primary");
   const [alertMsgp, setAlertMsgp] = useState("Loading media....");
   const [thetoken, setThetoken] = useState("Token not Set");

   function onSubmit(e) {
      e.preventDefault();

      // do validation
      var errMsg = "";

      if (errMsg !== "") {
         setAlertClassp("visible");
         setAlertMsgp("Error:" + errMsg);
      } else {
         const newPlaylist = {
            name: PLnamep,
            placement: placementp,
            author: authorp,
            date: datep,
            startDate: startDatep,
            endDate: endDatep,
            startTime: startTimep,
            endTime: endTimep,
            playOrder: playOrderp,
            duration: durationp,
            transDuration: transDurationp,
            fadeIn: fadeInp,
            fadeOut: fadeOutp,
            type: typep,
            asset: assetp,
            idp: idp,
            layout: layoutp,
            bgMovie: bgMoviep,
            solo: solop,
         };
         addPlayLists(newPlaylist, props.thetoken)
            .then((res) => {
               console.log(res);
               if (res !== undefined) {
                  alert("New playlist has been uploaded");
                  props.toggle();
                  setTimeout(() => {
                     let refresh = document.location.href;
                     document.location.href = refresh;
                  }, 500); // delay while modal receeds
               }
            })
            .catch((err) => {
               console.log("Error #111s: " + err);
            });
      }
   }

   const grayFormGroup = {
      backgroundColor: "#eeeeee",
      padding: 5,
   };

   const [tooltipOpen, setTooltipOpen] = useState(false);

   const toggletool = () => setTooltipOpen(!tooltipOpen);

   useEffect(() => {
      if (thetoken === "Token not Set") {
         localForage.getItem("token", function (err, startToken) {
            setThetoken(startToken);
            getMedia(startToken).then((res) => {
               console.log("AddPlayListForm > res = ");
               console.log(res);
               setMediaObjp(res);
               setMovieArrp(
                  res.filter(
                     (ar) =>
                        ar.name.includes(".mov") || ar.name.includes(".mp4")
                  )
               );
               /*                    res.forEach( (e,i) => {
                        if(e.name.includes('.mov') || e.name.includes('.mp4')){
                            tmp.push(e.name)
                        }
                    }) */

               //setMovieArrp(tmp)
               console.log(movieArrp);
               setAlertMsgp("Media assets have been loaded");
               setSpinClassp("hid");
            });
         });
      }
   }, [thetoken, movieArrp]);

   return (
      <form noValidate onSubmit={onSubmit}>
         <Alert color='primary' id='errmsg' className={alertClassp}>
            <Spinner type='grow' color='primary' className={spinClassp} />
            <pre>{alertMsgp}</pre>
         </Alert>
         <FormGroup style={grayFormGroup}>
            <Label for='name'>Name</Label>
            <Input
               type='text'
               id='PLnamep'
               placeholder='Play List Name'
               value={PLnamep}
               onChange={(event) => setPLNamep(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='placement'>Placement</Label>
            <Input
               type='select'
               onChange={(event) => setPlacementp(event.target.value)}
               id='placementp'
               placeholder='placement'
               value={placementp}
            >
               <option value='right'>right</option>
               <option value='left'>left</option>
               <option value='top'>top</option>
               <option value='bottom'>bottom</option>
            </Input>
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='author'>Author</Label>
            <Input
               type='text'
               id='authorp'
               placeholder='author'
               value={authorp}
               onChange={(event) => setAuthorp(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='date'>Date</Label>
            <Input
               type='text'
               id='datep'
               placeholder='date'
               value={datep}
               onChange={(event) => setDatep(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='startDate'>Start Date</Label>
            <Input
               type='text'
               name='startDatep'
               id='startDatep'
               placeholder='Start Date'
               value={startDatep}
               onChange={(event) => setStartDatep(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='endDatep'>End Date &nbsp;</Label>
            <Input
               type='text'
               name='endDatep'
               id='endDatep'
               placeholder='End Datep'
               value={endDatep}
               onChange={(event) => setEndDatep(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='startTimep'>Start Time</Label>
            <Input
               type='text'
               id='startTimep'
               placeholder='Start Time'
               value={startTimep}
               onChange={(event) => setStartTimep(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='endtime'>End Time</Label>
            <Input
               type='text'
               id='endTimep'
               placeholder='End Time'
               value={endTimep}
               onChange={(event) => setEndTimep(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='endtime'>
               Play Order &nbsp;
               <span className='rounded1' id='tool1'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool1'
                  toggle={toggletool}
               >
                  (A Number) Which determines the positional order on the
                  playlist
               </Tooltip>
            </Label>
            <Input
               type='text'
               id='playOrder'
               size='4'
               placeholder='End Time'
               value={playOrderp}
               onChange={(event) => setPlayOrderp(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='endtime'>
               Duration &nbsp;
               <span className='rounded1' id='tool2'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool2'
                  toggle={toggletool}
               >
                  (A Number) Seconds in play time
               </Tooltip>
            </Label>
            <Input
               type='text'
               id='durationp'
               placeholder='Duration'
               value={durationp}
               onChange={(event) => setDurationp(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            {" "}
            &nbsp;
            <Label for='endtime'>
               Transition Duration &nbsp;
               <span className='rounded1' id='tool3'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool3'
                  toggle={toggletool}
               >
                  (A Number) Seconds allocated for the transition
               </Tooltip>
            </Label>
            <Input
               type='text'
               id='transDurationp'
               placeholder='Duration'
               value={transDurationp}
               onChange={(event) => setTransDurationp(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='endtime'>
               Fade In &nbsp;
               <span className='rounded1' id='tool4'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool4'
                  toggle={toggletool}
               >
                  Sepecifies in frame when the playlist items should animate in
               </Tooltip>
            </Label>
            <Input
               type='text'
               id='fadeInp'
               size='4'
               placeholder='End Time'
               value={fadeInp}
               onChange={(event) => setFadeInp(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='endtime'>
               Fade Out &nbsp;
               <span className='rounded1' id='tool4'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool4'
                  toggle={toggletool}
               >
                  Sepecifies in frame when the playlist items should animate out
               </Tooltip>
            </Label>
            <Input
               type='text'
               id='fadeOutp'
               size='4'
               placeholder='End Time'
               value={fadeOutp}
               onChange={(event) => setFadeOutp(event.target.value)}
            />
         </FormGroup>

         <FormGroup>
            <Label for='endtime'>
               Type &nbsp;
               <span className='rounded1' id='tool5'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool5'
                  toggle={toggletool}
               >
                  A dictionary description of the transition type
               </Tooltip>
            </Label>
            <Input
               type='select'
               onChange={(event) => setTypep(event.target.value)}
               id='typep'
               placeholder='Type'
               value={typep}
            >
               <option value='None Specified'>--</option>
               <option value='disolve'>disolve</option>
               <option value='fade'>fade</option>
            </Input>
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='placement'>Asset</Label>
            <Input
               type='select'
               onChange={(event) => setAssetp(event.target.value)}
               id='assetp'
               placeholder='asset'
               value={assetp}
            >
               <option value='None Specified'>NA</option>
               {mediaObjp.map((media) => (
                  <option key={media.name} value={media.name}>
                     {media.name}
                  </option>
               ))}
            </Input>
         </FormGroup>

         <FormGroup>
            <Label for='endtime'>ID</Label>
            <Input
               type='text'
               id='idp'
               size='4'
               placeholder='id'
               value={idp}
               onChange={(event) => setIdp(event.target.value)}
            />
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='layoutp'>Layout</Label>
            <Input
               type='select'
               onChange={(event) => setLayoutp(event.target.value)}
               name='layoutp'
               id='layoutp'
               placeholder='layout'
               value={layoutp}
            >
               <option value='artistic'>artistic</option>
               <option value='bgImage'>bgImage</option>
               <option value='fullScreen'>fullScreen</option>
               <option value='hangingQuote'>hangingQuote</option>
               <option value='names'>names</option>
               <option value='nameList'>nameList</option>
               <option value='profilesFullscreen'>profilesFullscreen</option>
               <option value='text'>text</option>
               <option value='thankYou'>thankYou</option>
               <option value='titleSection'>titleSection</option>
            </Input>
         </FormGroup>

         <FormGroup>
            <Label for='bgMovie'>Background Movie</Label>
            <Input
               type='select'
               onChange={(event) => setBgMoviep(event.target.value)}
               id='bgMoviep'
               placeholder='bgMovie'
               value={bgMoviep}
            >
               <option value='None Specified'>NA</option>
               {movieArrp.map((movie) => (
                  <option key={movie.name} value={movie.name}>
                     {movie.name}
                  </option>
               ))}
            </Input>
         </FormGroup>

         <FormGroup style={grayFormGroup}>
            <Label for='solop'>
               Solo &nbsp;
               <span className='rounded1' id='tool6'>
                  ?
               </span>
               <Tooltip
                  placement='right'
                  isOpen={tooltipOpen}
                  target='tool6'
                  toggle={toggletool}
               >
                  (true or false) is this a solo playlist. If so all others will
                  halt during the process
               </Tooltip>
            </Label>
            <Input
               type='select'
               onChange={(event) => setSolop(event.target.value)}
               id='solop'
               placeholder='solo'
               value={solop}
            >
               <option value='true'>true</option>
               <option value='false'>false</option>
            </Input>
         </FormGroup>

         <Button type='submit' color='primary' block>
            Submit
         </Button>
      </form>
   );
};
