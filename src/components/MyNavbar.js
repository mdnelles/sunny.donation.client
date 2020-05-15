import React, { useState } from "react";
import { logout } from "./UserFunctions";
import {
   Collapse,
   Navbar,
   NavbarToggler,
   NavbarBrand,
   Nav,
   NavItem,
   NavLink,
   NavbarText,
} from "reactstrap";

export const MyNavbar = () => {
   const [menuDisplayClass, setMenuDisplayClass] = useState("displayNone"),
      [menuTop, setMenuTop] = useState(0),
      [menuLeft, setMenuLeft] = useState(0),
      [isOpen, setIsOpen] = useState(false);

   const toggle = () => setIsOpen(!isOpen);
   const mtoggle = () => {
      menuDisplayClass === "displayNone"
         ? setMenuDisplayClass("displayBlock")
         : setMenuDisplayClass("displayNone");
      var c = document.getElementById("pIcon").getBoundingClientRect();
      let iLeft = c.left;
      let iBottom = c.bottom;
      setMenuTop(iBottom);
      setMenuLeft(iLeft - 10);
      setTimeout(() => {
         setMenuDisplayClass("displayNone");
      }, 3000);
   };
   const logOut = (e) => {
      e.preventDefault();
      // install delay spinner here
      logout()
         .then(() => {
            localStorage.removeItem("usertoken");
            window.top.location = "/";
         })
         .catch((err) => {
            console.log("+++ error in file: " + __filename + "err=" + err);
         });
   };

   const dba = () => {
      document.location.href = "/dba";
   };

   return (
      <div>
         <div style={{ width: "100%" }}>
            <Navbar color='light' light expand='md'>
               <NavbarBrand href='/' target='_blank'>
                  <img
                     src='/img/sunnybrook_foundation_gray2.png'
                     style={{ width: 160, height: "auto", marginLeft: 15 }}
                  />
               </NavbarBrand>
               <NavbarToggler onClick={toggle} />
               <Collapse isOpen={isOpen} navbar>
                  <Nav className='mr-auto' navbar bg='light'>
                     <NavItem>
                        <NavLink href='/donor_cats'>Donors</NavLink>
                     </NavItem>
                     <NavItem>
                        <NavLink href='/playlists'>Playlists</NavLink>
                     </NavItem>
                     <NavItem>
                        <NavLink href='/users'>User</NavLink>
                     </NavItem>
                     <NavItem>
                        <NavLink href='/media'>Media</NavLink>
                     </NavItem>
                  </Nav>
                  <NavbarText>
                     <img
                        id='pIcon'
                        src='/img/logout.png'
                        className='logoutImg img-button'
                        alt='Logout'
                        style={{ borderRadius: 30 }}
                        onClick={() => mtoggle()}
                     />
                     <div
                        id='pmenu'
                        className={menuDisplayClass}
                        style={{ top: menuTop, left: menuLeft }}
                     >
                        <div
                           id='logoutPop'
                           className='pmStyle'
                           onClick={(event) => logOut(event)}
                        >
                           Logout
                        </div>
                        <div id='dba' className='pmStyle' onClick={() => dba()}>
                           DB Maint
                        </div>
                     </div>
                  </NavbarText>
               </Collapse>
            </Navbar>
         </div>
      </div>
   );
};

export default MyNavbar;

//export default withRouter(Landing)
