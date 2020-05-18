import React, { useState, useEffect } from "react";
import { get_date } from "./_sharedFunctions";

import { MyToast } from "./widgets/MyToast";
import {
   restoreData,
   getDBs,
   makeRandom,
   rmDupes,
   restoreFromNew,
} from "./DbaFunctions";
import {
   Alert,
   ButtonGroup,
   Input,
   InputGroup,
   InputGroupAddon,
   Button,
   Spinner,
} from "reactstrap";
import localForage from "localforage";

export const Dba = () => {
   const [alertMsg, setAlertMsg] = useState(""),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [alertType, setAlertType] = useState("primary"),
      [alertvisible, setAlertVisible] = useState("hid"),
      [spinVis, setSpinVis] = useState("hid"),
      [thetoken, setThetoken] = useState("Token not Set");

   const loading = `Loading...`;
   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   const restoreDataStart = () => {
      setAlertVisible("visible");
      setAlertType("primary");
      setAlertMsg("  loading");
      setSpinVis("visible");
      restoreData(thetoken).then((res) => {
         setAlertType("success");
         setAlertMsg(JSON.stringify(res));
         setSpinVis("hid");
      });
   };
   function removeDupes() {
      setAlertVisible("visible");
      setAlertType("primary");
      setAlertMsg("  loading");
      setSpinVis("visible");
      rmDupes("dtn_live", thetoken).then((res) => {
         setAlertType("success");
         setAlertMsg(JSON.stringify(res));
         setSpinVis("hid");
      });
   }
   function preMakeRandom() {
      setAlertVisible("visible");
      setAlertType("primary");
      setAlertMsg("updating ... ");
      makeRandom(thetoken).then((res) => {
         setAlertType("success");
         setAlertMsg(JSON.stringify(res.data));
      });
   }

   useEffect(() => {
      if (thetoken === "Token not Set") {
         localForage.getItem("token", function (err, startToken) {
            console.log(startToken);
            setThetoken(startToken);
         });
      }
   }, [thetoken]);

   return (
      <div className='appBody'>
         <h4>Database Administration</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
            <Button color='primary' onClick={() => removeDupes()}>
               Remove Duplicated
            </Button>
            <Button color='primary' onClick={() => preMakeRandom()}>
               Make Names Private
            </Button>
         </ButtonGroup>
         <div className={"p-1 rounded " + toastVisibility}>
            <MyToast title='DB Admin' body='Back up and Restore Data' />
         </div>
         <br />

         <div>
            <Alert color={alertType} id='alert' className={alertvisible}>
               <Spinner color='primary' className={spinVis} />
               {alertMsg}
            </Alert>
         </div>

         <div className='globalShad' style={{ padding: 15 }}>
            <div id='existingDbs'>
               <div id='spin1'></div>
               <InputGroup>
                  <InputGroupAddon addonType='prepend'>
                     <Button onClick={() => restoreDataStart()}>
                        Restore Data
                     </Button>
                  </InputGroupAddon>
               </InputGroup>
               This is a demo app. To restore data to it's original fidelity you
               can use this feature.
            </div>
         </div>
      </div>
   );
};
