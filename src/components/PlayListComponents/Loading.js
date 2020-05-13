import React from 'react';
import { Spinner } from 'reactstrap';

export const Loading = () => {
    return (
      <div id="json" className="defaultBox">
          <br />
          <center>Loading...<br />
               <Spinner type="grow" color="primary" />
          </center>
      </div>
    )
  }