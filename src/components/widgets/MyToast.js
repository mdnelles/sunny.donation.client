import React from "react";
import { Table } from "reactstrap";
var parse = require("html-react-parser");
export const MyToast = (props) => {
   return (
      <div className='globalShad'>
         <Table>
            <tbody>
               <tr className='tableHeader'>
                  <th>{props.title}</th>
                  <th></th>
               </tr>
               <tr>
                  <td colSpan='2'>{parse(props.body)}</td>
               </tr>
            </tbody>
         </Table>
      </div>
   );
};
