import React, { useState } from "react";
import { Nav, NavItem, NavLink } from 'reactstrap';

export const Navi = (props) => {
    const [acn1,setAcn1] = useState('active');
    const [acn2,setAcn2] = useState('');
    const [acn3,setAcn3] = useState('');
    const [lastActive, setLastActive] = useState('a')
  
    const startChangeVis = id => {
      console.log('here')
      if(lastActive === 'a'){
        setAcn1('')
      } else if (lastActive === 'b'){
        setAcn2('')
      } else if (lastActive === 'c'){
        setAcn3('')
      }
      if(id === 'a'){
        setAcn1('active')
        props.changeVis(id,lastActive)
        setLastActive('a')
      } else if(id === 'b') {
        setAcn2('active')
        props.changeVis(id,lastActive)
        setLastActive('b')
      } else if(id === 'c') {
        setAcn3('active')
        props.changeVis(id,lastActive)
        setLastActive('c')
      }
    }
  
    return(
    <div>
        <Nav tabs>
          <NavItem>
            <NavLink id="a" href="#" onClick={() => { startChangeVis('a')}} className={acn1}>Playlist Info</NavLink>
          </NavItem>
          <NavItem>
            <NavLink id="b" href="#"  onClick={() => { startChangeVis('b')}} className={acn2}>Playlist Layouts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink id="c" href="#"  onClick={() => { startChangeVis('c')}} className={acn3}>JSON text</NavLink>
          </NavItem>
        </Nav>
        <div className="padDiv"></div>
    </div>
    )
  }