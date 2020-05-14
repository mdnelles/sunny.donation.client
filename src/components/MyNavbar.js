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
   UncontrolledDropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
   NavbarText,
} from "reactstrap";

export const MyNavbar = () => {
   const [menuDisplayClass, setMenuDisplayClass] = useState("displayNone"),
      [isOpen, setIsOpen] = useState(false);

   const toggle = () => setIsOpen(!isOpen);
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
                     <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                           <img
                              src='/img/logout.png'
                              className='logoutImg img-button'
                              alt='Logout'
                           />
                        </DropdownToggle>
                        <DropdownMenu right>
                           <DropdownItem onClick={() => dba()}>
                              DB Maint
                           </DropdownItem>
                           <DropdownItem divider />
                           <DropdownItem onClick={(event) => logOut(event)}>
                              Log Out
                           </DropdownItem>
                        </DropdownMenu>
                     </UncontrolledDropdown>
                  </Nav>
                  <NavbarText>
                     <img
                        src='/img/sunnybrook_foundation_gray2.png'
                        style={{ width: 160, height: "auto", marginLeft: 15 }}
                     />
                  </NavbarText>
               </Collapse>
            </Navbar>
         </div>
      </div>
   );
};

export default MyNavbar;

//export default withRouter(Landing)
