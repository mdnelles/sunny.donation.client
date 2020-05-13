import React, { useState, useEffect } from "react";
import { getck, login } from "./UserFunctions";
import { Spinner } from "reactstrap";
import localForage from "localforage";
import Recaptcha from "react-recaptcha";

const Msgbar = (props) => {
   const aStyle = {
      paddingRight: "50px",
      paddingBottom: "20px",
      color: "#444",
      textShadow: "1px 1px #aaaaaa",
   };
   return (
      <div style={aStyle}>
         <Spinner type='grow' color='light' className={props.spin} />{" "}
         {props.msg}
      </div>
   );
   /*return (
      <Alert color="light" className="marginRight" style={aStyle}>
          <Spinner type="grow" color="light" className={props.spin}/> {props.msg}
      </Alert>
  )*/
};

export const Landing = () => {
   const [email, setEmail] = useState("test@test.com"),
      [password, setPassword] = useState("password"),
      [captchaKey, setCaptchaKey] = useState("na"),
      [submitVisibleClass, setSubmitVisibleClass] = useState("displayNone"),
      [msg, setMsg] = useState("Enter valid credentials to proceed"),
      [spin, setSpin] = useState("visible");

   const captcha = () => {
      setSubmitVisibleClass("displayBlock");
   };

   function onSubmit(e) {
      e.preventDefault();
      setSpin("visible");
      setMsg("Checking credentials...");
      const user = {
         email: email,
         password: password,
      };

      if (
         email === null ||
         email === undefined ||
         email === "" ||
         password === null ||
         password === undefined ||
         password === ""
      ) {
         setSpin("hid");
         setMsg("Please ender valid login credentials");
      } else {
         localForage.setItem("token", false); // clear old token if exists
         login(user)
            .then((res) => {
               if (parseInt(res) !== null) {
                  localForage.setItem("token", res);

                  setTimeout(() => {
                     window.location.href = "/users";
                  }, 1000);
               } else {
                  console.log("+++ unhandled error here: " + __filename);
                  setSpin("hid");
                  setMsg("Login Failed");
               }
            })
            .catch((err) => {
               console.log("+++ error in file: " + __filename + "err=" + err);
            });
      }
   }

   let captchaPlace = "";
   if (captchaKey !== undefined && captchaKey !== "na") {
      // dont forget to add the following to the index.html file
      // <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      console.log("here");
      captchaPlace = (
         <Recaptcha
            sitekey={captchaKey}
            render='explicit'
            verifyCallback={(event) => captcha(event)}
         />
      );
   } else {
      captchaPlace = "";
   }

   useEffect(() => {
      setSpin("hid");
      setMsg("Enter valid credentials to proceed");
      document.body.style.background =
         "#f3f3f3 url('img/blue_background.png') left top";
      console.log("captchaKey: " + captchaKey);
      if (captchaKey === "na") {
         getck().then((data) => {
            if (data !== undefined && data.length > 10) {
               setTimeout(() => {
                  setCaptchaKey(data);
               }, 200); // delay to ensure data is set
            } else {
               console.log("Err: not authorized for captch key");
            }
         });
      }
   }, [captchaKey]);

   return (
      <div className='vertical-center center-outer'>
         <div className='center-inner'>
            <div className='login__container flex_container_column'>
               <div className='login__logo-container flex_container_row'>
                  <div className='login__logo flex_container_column'>
                     <a
                        href='https://sunnybrook.ca/foundation/'
                        target='_blank'
                     >
                        <img src='/img/sunnybrook_foundation_white2.png' />
                     </a>

                     <h3>CMS System</h3>
                  </div>
               </div>
            </div>

            <div className='login__credentials-container flex_container_column'>
               <div className={submitVisibleClass}>
                  <Msgbar msg={msg} spin={spin} />
               </div>
               <form noValidate onSubmit={onSubmit}>
                  <div className='login__form flex_container_column'>
                     <div className='padding20'>{captchaPlace}</div>
                     <div className={"padding20 " + submitVisibleClass}>
                        <input
                           type='email'
                           className='form-control borderless'
                           name='email'
                           placeholder='Enter email'
                           value={email}
                           onChange={(event) => setEmail(event.target.value)}
                        />
                     </div>
                     <div className={"padding20 " + submitVisibleClass}>
                        <input
                           type='password'
                           className='form-control borderless'
                           name='password'
                           placeholder='Password'
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                        />
                     </div>
                  </div>
                  <div className={submitVisibleClass}>
                     <button className='login__login-button' type='submit'>
                        Login
                     </button>
                  </div>
                  <br></br>
               </form>
            </div>
         </div>
      </div>
   );
};
