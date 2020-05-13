import axios from "axios";
import localForage from "localforage";
import "./config"; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes("3000")) serverPath = global.config.devPath;

console.log("server path:" + serverPath);

export const register = (newUser, theToken) => {
   return axios
      .post(serverPath + "/user/register", {
         uuid: newUser.uuid,
         first_name: newUser.first_name,
         last_name: newUser.last_name,
         email: newUser.email,
         password: newUser.password,
         admin: newUser.admin,
         token: theToken,
         caller: "UserFunctions.register",
      })
      .then((res) => {
         console.log("Registered");
         return res;
      })
      .catch((err) => {
         console.log("ClientSide Error @ UserFunctions > getUsers " + err);
         return "++Error Loc 10";
      });
};

export const removeUser = (theUuid, token) => {
   return axios
      .post(serverPath + "/user/remove_user", {
         theUuid,
         token,
         caller: "UserFunctions.register",
      })
      .then((res) => {
         console.log("User Removed");
         return 1;
      })
      .catch((err) => {
         console.log("ClientSide Error @ UserFunctions > removeUser " + err);
         return "++Error Loc 02";
      });
};

export const getUsers = (theToken) => {
   return axios
      .post(serverPath + "/user/getusers", {
         token: theToken,
         caller: "UserFunctions.register",
      })
      .then((res) => {
         //console.log(res.data)
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ UserFunctions > getUsers " + err);
         return "++Error Loc 07";
      });
};

export const userIsLoggedIn = (token) => {
   return axios
      .post(serverPath + "/user/islogged", {
         token: token,
         caller: "UserFunctions.register",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("Err (catch) UserFunctions > userIsLoggedIn ... " + err);
         document.location.href = "/";
         return false;
      });
};

export const login = (user) => {
   return axios
      .post(serverPath + "/user/login", {
         email: user.email,
         password: user.password,
         caller: "UserFunctions.register",
      })
      .then((res) => {
         return res.data.token;
      })
      .catch((err) => {
         console.log("Error (catch) UserFunctions > login" + err);
         return 0;
      });
};

export const logout = () => {
   localForage.setItem("token", "x", () => {
      window.location.href = "/";
   });
};

export const getck = () => {
   return axios
      .post(serverPath + "/captcha/get_key", {
         caller: "UserFunctions.getCaptcha",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("Err (catch) UserFunctions.getCaptcha: " + err);
         return false;
      });
};
