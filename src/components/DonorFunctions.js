import axios from "axios";
import arraySort from "array-sort";
import $ from "jquery";
import "./config"; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes("3000")) serverPath = global.config.devPath;

export const updateCounters = (theToken) => {
   return axios
      .post(serverPath + "/donors/updatecounters2", {
         token: theToken,
         caller: "DonorFunctions.updateCounters",
      })
      .then(() => {
         console.log("counters updated");
         return 1;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ DonorFunctions > update counters" + err
         );
         return false;
      });
};

export const updateKey = (title, oldKey, theToken) => {
   return axios
      .post(serverPath + "/donors/updatekey2", {
         title: title,
         oldKey: oldKey,
         token: theToken,
         caller: "DonorFunctions.updateKey",
      })
      .then(() => {
         console.log("donorKey Updated");
         return 1;
      })
      .catch((err) => {
         console.log(
            "ClientSide Error @ DonorFunctions > update donor key" + err
         );
         return false;
      });
};

export const deleteGroupFunct = (donorKey, theToken) => {
   return axios
      .post(serverPath + "/donors/deletegroup2", {
         donorKey: donorKey,
         token: theToken,
         caller: "DonorFunctions.deleteGroupFunct",
      })
      .then(() => {
         console.log("Group Delete");
         return 1;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunctions > delete group" + err);
         return false;
      });
};

export const addDonor = (newDonor, thetoken) => {
   return axios
      .post(global.config.routerPath + "/donors/adddonor2", {
         donorKey: newDonor.donorKey,
         donorName: newDonor.donorName,
         letter: newDonor.letter,
         donor_order: newDonor.donor_order,
         bgc: newDonor.bgc,
         thetoken: newDonor.thetoken,
         caller: "DonorFunctions.addDonor",
      })
      .then(() => {
         console.log("Registered");
         return 1;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunctions > addDonor " + err);
         return false;
      });
};

export const downLoadCSV = (theToken) => {
   console.log("in download csv");
   return axios
      .post(serverPath + "/donors/downloadcsv2", {
         token: theToken,
         caller: "DonorFunctions.downloadCSV",
      })
      .then((res) => {
         // link to csv file
         return res;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunction > download CSV" + err);
         return false;
      });
};

export const upload = () => {
   return new Promise((resolve, reject) => {
      var data = new FormData();
      $.each($("#file")[0].files, function (i, file) {
         data.append("file-" + i, file);
      });

      $.ajax({
         url: serverPath + "/donors/uploadcsv2",
         data: data,
         cache: false,
         contentType: false,
         processData: false,
         method: "POST",
         type: "POST", // For jQuery < 1.9
         error: function (err) {
            reject(err);
         },
         success: function (data) {
            resolve(data);
         },
      });
   });
};

export const deleteSQL = (id, modelName, theToken) => {
   var jo = {
      id: id,
      modelName: modelName,
      token: theToken,
      caller: "DonorFunctions.deleteSQL",
   };
   return axios
      .post(serverPath + "/donors/deletesql2", jo)
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunction > deleteSQL " + err);
         return false;
      });
};

export const updateDonorsSQL = (ids, newVals, fields, theToken) => {
   var jo = {
      ids: ids,
      newVals: newVals,
      fields: fields,
      token: theToken,
      caller: "DonorFunctions.updateDonorSQL",
   };
   return axios
      .post(serverPath + "/donors/updatesqldonors2", jo)
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunction > updateSQL " + err);
         return false;
      });
};

export const getDonors = (rest, theToken) => {
   return axios
      .post(serverPath + "/donors/getdonors2", {
         rest: rest,
         token: theToken,
         caller: "DonorFunctions.getDonors",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunction > getDonors " + err);
         return false;
      });
};

export const getDonorCats = (theToken) => {
   return axios
      .post(serverPath + "/donors/donor_category2", {
         token: theToken,
         caller: "DonorFunctions.getDonorCats",
      })
      .then((res) => {
         return res.data;
      })
      .catch((err) => {
         console.log("ClientSide Error @ DonorFunction > getDonors " + err);
         return false;
      });
};

export const donorSwap = (cid, donorArr) => {
   // direction is up or down only
   var direction = "down";
   if (cid.includes("u")) direction = "up";
   var [, id] = cid.toString().split("-");
   id = parseInt(id);
   var addressOfId = "",
      newOrder = "",
      oldOrder;

   donorArr.forEach((e, i) => {
      //console.log('comparing parseInt(donorArr[i].id)' + parseInt(donorArr[i].id) + ' <-> ' + id)
      if (parseInt(donorArr[i].id) === id) {
         addressOfId = i;
         oldOrder = donorArr[i].donor_order;
      }
   });

   if (addressOfId === undefined || addressOfId === "") {
      donorArr = [];
      var displacedID; // Store the id of the displaced donor order (for SQL update)
      var displacedNewOrderNo; // Store the new 'donor_order' of the displaced donor order (for SQL update)
      var clkID; // clicked arrow id (for SQL update)
      var clkNewOrderNo; // clicked arrow new 'donor_order'  (for SQL update)
   } else if (direction === "down") {
      newOrder = donorArr[addressOfId + 1].donor_order; // get donor_order of displaced
      // displaced
      donorArr[addressOfId + 1].donor_order = oldOrder; // update the displaced
      displacedID = donorArr[addressOfId + 1].id;
      // clicked
      donorArr[addressOfId].donor_order = newOrder; // upadating the clicked on
   } else {
      newOrder = donorArr[addressOfId - 1].donor_order;
      // displaced
      donorArr[addressOfId - 1].donor_order = oldOrder;
      displacedID = donorArr[addressOfId - 1].id;
      displacedNewOrderNo = oldOrder;
      // clicked
      donorArr[addressOfId].donor_order = newOrder;
   }
   displacedNewOrderNo = oldOrder;
   clkID = donorArr[addressOfId].id;
   clkNewOrderNo = newOrder;

   donorArr = arraySort(donorArr, "donor_order");
   return {
      displacedID: displacedID,
      displacedNewOrderNo: displacedNewOrderNo,
      clkID: clkID,
      clkNewOrderNo: clkNewOrderNo,
      updArr: donorArr,
   };
};
