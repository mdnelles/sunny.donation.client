import axios from "axios";
import "./config"; // adding config for folder specific build
////// playlists
var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes("3000")) serverPath = global.config.devPath;

export const updPlayListLayoutStr = (pListId, newString, theToken) => {
   return axios
      .post(serverPath + "/playlist/updplaylistls2", {
         pListId: pListId,
         newString: newString,
         token: theToken,
         caller: "PlayListFunctions.updPlayListLayoutStr",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > updPlayListLayoutStr " + err
         );
         return false;
      });
};

export const removePlayList = (id, theToken) => {
   return axios
      .post(serverPath + "/playlist/removeplaylist2", {
         id: id,
         token: theToken,
         caller: "PlayListFunctions.removePlayList",
      })
      .then((res) => {
         console.log("returned from removing data " + res);
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > removePlaylist " + err
         );
         return false;
      });
};

export const getPlayLists = (theToken) => {
   return axios
      .post(serverPath + "/playlist/getplaylist2", {
         token: theToken,
         caller: "PlayListFunctions.getPlayLists",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > getPlaylist " + err
         );
         return false;
      });
};

export const addPlayLists = (pData, theToken) => {
   return axios
      .post(serverPath + "/playlist/addplaylist2", {
         name: pData.name,
         placement: pData.placement,
         author: pData.author,
         date: pData.date,
         startDate: pData.startDate,
         endDate: pData.endDate,
         startTime: pData.startTime,
         endTime: pData.endTime,
         playOrder: pData.playOrder,
         duration: pData.duration,
         transDuration: pData.transDuration,
         fadeIn: pData.fadeIn,
         fadeOut: pData.fadeOut,
         type: pData.type,
         asset: pData.asset,
         idp: pData.idp,
         layout: pData.layout,
         bgMovie: pData.bgMovie,
         solo: pData.solo,
         token: theToken,
         caller: "PlayListFunctions.addPlayLists",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > addPlaylist " + err
         );
         return false;
      });
};

////// Layouts
export const removeLayout = (id, theToken) => {
   return axios
      .post(serverPath + "/playlist/removelayout2", {
         id: id,
         token: theToken,
         caller: "PlayListFunctions.removeLayout",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > remove layout " + err
         );
         return false;
      });
};

export const getLayouts = (theToken) => {
   return axios
      .post(serverPath + "/playlist/getlayouts2", {
         token: theToken,
         caller: "PlayListFunctions.getLayouts",
      })
      .then((res) => {
         //console.log(JSON.stringify(res.data))
         return res.data;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ PlaylistFunctions > getLayouts " + err
         );
         return false;
      });
};

export const addLayout = (pData, theToken) => {
   return axios
      .post(serverPath + "/playlist/addlayout2", {
         title: pData.title,
         sequence_id: pData.sequenceId,
         group: pData.group,
         fadeIn: pData.fadeIn,
         fadeOut: pData.fadeOut,
         duration: pData.duration,
         layout: pData.layout,
         asset: pData.asset,
         donorLevel: pData.donorLevel,
         type: pData.type,
         text: pData.text,
         quote: pData.quote,
         token: theToken,
         caller: "PlayListFunctions.addLayout",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ PlaylistFunctions > addSlide " + err);
         return false;
      });
};
