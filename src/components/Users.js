import React, { useState, useEffect } from "react";
import { getUsers, removeUser } from "./UserFunctions";
import { ModalAddUser } from "./ModalAddUser";
import { MyToast } from "./widgets/MyToast";
import localForage from "localforage";
import { restoreData } from "./DbaFunctions";
import { Button, ButtonGroup, Spinner, Table } from "reactstrap";

const Userow = (props) => {
   return (
      <tr key={"i-/" + props.email}>
         <th scope='row'>{props.first_name}</th>
         <td>{props.last_name}</td>
         <td>{props.email}</td>
         <td>
            <div
               onClick={() => {
                  props.removeUserStart(props.uuid);
               }}
               className='btn deleteBtn'
            >
               <i
                  className='fa fa-trash dgroup'
                  aria-hidden='true'
                  id={props.uuid}
                  onClick={() => {
                     props.removeUserStart(props.uuid);
                  }}
               ></i>
            </div>
         </td>
      </tr>
   );
};

const Allusers = (props) => {
   var tog = false,
      bgc;

   if (props.users !== undefined && Array.isArray(props.users)) {
      props.users.forEach((e, i) => {
         tog === false ? (bgc = "whitebg") : (bgc = "graybg");
         tog = !tog;
         props.users[i].bgc = bgc;
      });
   }

   return (
      <React.Fragment>
         {props.users.map((user) => (
            <Userow
               key={user.uuid}
               uuid={user.uuid}
               id={user.id}
               bgc={user.bgc}
               email={user.email}
               first_name={user.first_name}
               last_name={user.last_name}
               removeUserStart={props.removeUserStart}
               vis={
                  user.email === "test@test.com"
                     ? "displayNone"
                     : "displayBlock"
               }
            />
         ))}
      </React.Fragment>
   );
};

const Loading = (props) => {
   return (
      <div className={props.msgVisible}>
         <br />
         <center>
            <Spinner type='grow' color='blue' /> Loading users ...
         </center>
      </div>
   );
};

export const Users = () => {
   const [users, setUsers] = useState([]),
      [modal, setModal] = useState(false),
      [toastVisibility, setToastVisibility] = useState("displayNone"),
      [msgVisible, setMsgVisible] = useState("visible");

   const toggle = () => {
      setModal(!modal);
   };

   const toastToggle = () => {
      toastVisibility === "displayNone"
         ? setToastVisibility("displayBlock")
         : setToastVisibility("displayNone");
   };

   const removeUserStart = (theUuid) => {
      if (window.confirm("Are you sure you want to delete this?")) {
         {
            /* 
         // not storing changes in database in demo version so commented out
         if (theUuid !== undefined) {
            localForage
               .getItem("token", (err, theToken) => {
                  removeUser(theUuid, theToken)
                     .then((res) => {
                        setUsers(users.filter((user) => user.uuid !== theUuid));
                     })
                     .catch((err) => {
                        console.log("Err: could not remove user " + err);
                     });
               })
               .catch(() => {
                  window.location.href = "/"; // no token
               });
         }
      } else {
         return false;
      }
         */
         }
         setUsers(users.filter((user) => user.id !== theUuid));
      }
   };

   const addUserStart = (data) => {
      setUsers([...users, data]);
   };

   useEffect(() => {
      localForage
         .getItem("token", function (err, theToken) {
            document.body.style.background = "#ffffff";
            getUsers(theToken).then((res) => {
               setMsgVisible("hid");
               setUsers(res);
               restoreData(theToken).then(() => {
                  //datarestored
               });
            });
         })
         .catch((err) => {
            console.log(err);
            setTimeout(() => {
               window.location.href = "/"; // no token
            }, 2000);
         });
   }, []);

   let toastBody = `
   <ul>
   <li>This controls the CMS user administration for this application.</li>
   <li><span style="color:red">Changes made by <b>demo user</b> will no persist</span></li>
   </ul>
   `;

   return (
      <div className='appBody'>
         <h4>CMS Users</h4>
         <ButtonGroup size='sm' color='primary'>
            <Button color='primary' onClick={() => toastToggle()}>
               Info
            </Button>
            <Button color='primary' onClick={() => toggle()}>
               Add User
            </Button>
         </ButtonGroup>
         <div className={"p-1 rounded " + toastVisibility}>
            <MyToast title='CMS USERS' body={toastBody} />
         </div>
         <br />
         <div className='globalShad'>
            <Table striped>
               <thead>
                  <tr style={{ backgroundColor: "#bdddff" }}>
                     <th>First Name</th>
                     <th>Last Name</th>
                     <th>Email</th>
                     <th>Delete</th>
                  </tr>
               </thead>
               <tbody>
                  <Allusers users={users} removeUserStart={removeUserStart} />
               </tbody>
            </Table>
            <ModalAddUser
               addUserStart={addUserStart}
               toggle={toggle}
               modal={modal}
               setModal={setModal}
            />

            <Loading msgVisible={msgVisible} />
         </div>
      </div>
   );
};

export default Users;
