import axios from "axios";
import "./config"; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes("3000")) serverPath = global.config.devPath;

export const getMedia = (token) => {
   return axios
      .post(serverPath + "/media/getmedia", {
         token: token,
         caller: "MediaFunctions.getMedia",
      })
      .then((res) => {
         // this needs to be an array of all the filenames
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ UserFunctions > getMedia " + err);
         return "-- Err: MediaFunctions.getMedia " + err;
      });
};

export const removeFile = (token, fileName) => {
   return axios
      .post(serverPath + "/media/removeFile", {
         token,
         fileName,
         caller: "MediaFunctions.getMedia",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("Err UserFunctions > removeFile => " + err);
         return "-- Err: MediaFunctions.removeFile => " + err;
      });
};
