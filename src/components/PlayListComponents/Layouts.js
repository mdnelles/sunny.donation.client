import React, {  useState, useEffect } from "react";
import { Toast, ToastBody, ToastHeader, Button } from 'reactstrap';
import './PlayList.css'

const SingleLayoutNotIn = (props) => {
  return (
    <Toast>
      <ToastHeader>
        {props.title} &nbsp; 
        <Button color="success" size="sm" onClick={() => {props.preModPlayList('add',props.id)}}>Add +</Button>
      </ToastHeader>
      <ToastBody>
        Layout Type: {props.layout} <br />
        Asset: {props.asset} <br />
        Level: {props.donorLevel}
      </ToastBody>
    </Toast>
  )
}

const LayoutsNotInPlaylist = props => {

  if(props.layOutNotIncl !== undefined && props.layOutNotIncl !== null){
    return (
      <div>
        {
          props.layOutNotIncl.map(aLayout => <SingleLayoutNotIn
            title={aLayout.title}
            layout={aLayout.layout}
            asset={aLayout.asset}
            donorLevel={aLayout.donorLevel}        
            id={aLayout.id}
            key={aLayout.id +'-'+aLayout.title}
            preModPlayList={props.preModPlayList}
          />)
          }
      </div>
    )
  } else {
    return (<div>No layouts not in playlist</div>)
  }
}

const SingleLayoutIn = (props) => {
  return (
    <Toast>
      <ToastHeader>
        {props.title} &nbsp; 
        <Button color="danger" size="sm" onClick={()=> {props.preModPlayList('remove',props.id)}}>Remove -</Button>
      </ToastHeader>
      <ToastBody>
        Layout Type: {props.layout} <br />
        Asset: {props.asset} <br />
        Level: {props.donorLevel}
      </ToastBody>
    </Toast>
  )
}

const LayoutsInPlaylist = props => {

  if(props.layOutIncl !== undefined && props.layOutIncl !== null){
    return (
      <div>
        {props.layOutIncl.map(aLayout => <SingleLayoutIn
          title={aLayout.title}
          layout={aLayout.layout}
          asset={aLayout.asset}
          donorLevel={aLayout.donorLevel}
          id={aLayout.id}
          key={aLayout.id +'-'+aLayout.title}
          preModPlayList={props.preModPlayList}
        />)}
      </div>
    )
  } else {
    return (<div>No layouts in playlist</div>)
  }
}


export const Layouts = (props) => {
    //pros = playListLayoutIdsStr layoutsArr
    const [ layOutIncl, setLayOutIncl ] = useState([])  // layouts in this playlist
    const [ layOutNotIncl, setLayOutNotIncl ] = useState([]); //useState([])
    const [ sideHeight, setSideHeight ] = useState(300)
    const [ initDone, setInitDone ] = useState(false)

    const preModPlayList = (action, id) => {
      props.modPlayList(action, id)

    }

    const sideBstyle = {
      height:sideHeight + 'px'
    }

    const sizeSideB = () => {  // responsive side bar adjustment
      let height = window.innerHeight; 
      setSideHeight(parseInt(height) - parseInt(280))
    }

    useEffect( () => {    
      sizeSideB();
      window.addEventListener('resize', sizeSideB);

      if(initDone === false){
        if(props.playListLayoutIdsStr === undefined 
            || props.playListLayoutIdsStr === null 
            || props.playListLayoutIdsStr === '' ){
          setLayOutNotIncl(props.layoutsArr)
        } else {
            var idList = ''
            if(props.playListLayoutIdsStr.toString().includes(',')) {
              idList  = props.playListLayoutIdsStr.split(',')
            } else {
              idList = [props.playListLayoutIdsStr]
            }
  
            idList = idList.map(id => parseInt(id))  // convert values to integer or NAN

            var outArr = [];
            var incArr = []

            props.layoutsArr.forEach( e => {
              var theID = parseInt(e.id);
              var result = idList.filter(id => theID === id)
              result.length > 0 ? incArr.push(e) : outArr.push(e)
            })

            setLayOutIncl(incArr)
            setLayOutNotIncl(outArr)
        }
      }

      setInitDone(true) // installed to prevent  infinite loop

    },[initDone,layOutIncl,layOutNotIncl,props.playListLayoutIdsStr,props.layoutsArr])
  //},[initDone,layOutIncl,layOutNotIncl,props.playListLayoutIdsStr])

    const whiteFont = { color:'#ffffff' }

    return (
      <div id="layouts" className="layoutBox">
        <h3>Layouts</h3><br />

        <div className="sideB greyBack" style={sideBstyle}>
          <h4 style={whiteFont}>Outstanding Layouts</h4>
          <LayoutsNotInPlaylist 
              layOutNotIncl={layOutNotIncl}
              preModPlayList={preModPlayList}/>
        </div>

        <div className="sideB blueBack" style={sideBstyle}>
          <h4 style={whiteFont}>Layouts Currently in Playlist</h4>
            <LayoutsInPlaylist 
              layOutIncl={layOutIncl}
              preModPlayList={preModPlayList}/>
        </div>

      </div>
    )
  }