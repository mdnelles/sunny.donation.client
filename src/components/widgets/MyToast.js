import React from "react";
import { Table } from "reactstrap";
var parse = require("html-react-parser");
export const MyToast = (props) => {
   return (
      <div className='globalShad'>
         <Table>
            <tr className='tableHeader'>
               <th>{props.title}</th>
               <th></th>
            </tr>
            <tr>
               <td colspan='2'>{parse(props.body)}</td>
            </tr>
         </Table>
      </div>
   );
};
