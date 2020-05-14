import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import localForage from "localforage";

import { userIsLoggedIn } from "./components/UserFunctions";
import "./App.css";

import Loading from "./components/Loading";
import MyNavbar from "./components/MyNavbar";
import Navleft from "./components/Navleft";
import Register from "./components/Register";
import { Users } from "./components/Users";
import { Donors } from "./components/Donors";
import { DonorCats } from "./components/DonorCats";
import { PlayLists } from "./components/PlayLists";
import { EditPlayList } from "./components/EditPlayList";
import { Media } from "./components/Media";
import { Dba } from "./components/Dba";

export const AppWrapper = () => {
   const [activeSession, setActiveSession] = useState("loading");

   useEffect(() => {
      localForage
         .getItem("token", function (err, theToken) {
            if (err) {
               console.error("token err -> " + err);
            } else {
               userIsLoggedIn(theToken)
                  .then((data) => {
                     // imported fun
                     if (data === true || data === "true") {
                        setActiveSession("ok");
                     } else {
                        window.location.href = "/";
                     }
                  })
                  .catch((err) => {
                     console.log("user is not logged in " + err);
                     window.location.href = "/";
                  });
            }
         })
         .catch((err) => {
            console.log("user is not logged in " + err);
            window.location.href = "/";
         });
   }, []);

   var ret = "";
   if (activeSession === "no") {
      ret = <Redirect to='/' />;
   } else if (activeSession === "loading") {
      ret = <Route path='/' component={Loading} />;
   } else {
      ret = (
         <div>
            <MyNavbar />
            <Navleft />
            <div className='appHolder '>
               <Route exact path='/register' component={Register} />
               <Route exact path='/getdonors' component={Donors} />
               <Route exact path='/getdonors/:qry' component={Donors} />
               <Route exact path='/donor_cats' component={DonorCats} />
               <Route exact path='/playlists' component={PlayLists} />
               <Route
                  exact
                  path='/edit_playlist/:qry'
                  component={EditPlayList}
               />
               <Route exact path='/users' component={Users} />
               <Route exact path='/media' component={Media} />
               <Route exact path='/dba' component={Dba} />
            </div>
         </div>
      );
   }

   return ret;
};
