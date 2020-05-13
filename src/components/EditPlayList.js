
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { getPlayLists, getLayouts, updPlayListLayoutStr } from './PlayListFunctions'
import { sizeSideBar } from './_sharedFunctions'
import { Navi } from './PlayListComponents/Navi'
import { Info } from './PlayListComponents/Info'
import { Layouts } from './PlayListComponents/Layouts'
import { JSONtext } from './PlayListComponents/JSONtext'
import { Loading } from './PlayListComponents/Loading'
import localForage from 'localforage'

export const EditPlayList = () => {

  const  [ playListLayoutIdsStr, setPlayListLayoutIdsStr] = useState(''),
  			 [ layoutsArr, setLayoutsArr] = useState([]),
  			 [ playListID, setPlayListID] = useState(''),
  			 [ id,setid] = useState(''),
				 [ playlist_key,setplaylist_key] = useState(''),
				 [ placement,setplacement] = useState(''),
				 [ name,setname] = useState(''),
				 [ author,setauthor] = useState(''),
				 [ date,setdate] = useState(''),
				 [ startDate,setstartDate] = useState(''),
				 [ endDate,setendDate] = useState(''),
				 [ startTime,setstartTime] = useState(''),
				 [ endTime,setendTime] = useState(''),
				 [ playOrder,setplayOrder] = useState(''),
				 [ duration,setduration] = useState(''),
				 [ transDuration,settransDuration] = useState(''),
				 [ fadeIn,setfadeIn] = useState(''),
				 [ fadeOut,setfadeOut] = useState(''),
				 [ type,settype] = useState(''),
				 [ asset,setasset] = useState(''),
				 [ idp,setidp] = useState(''),
				 [ layout,setlayout] = useState(''),
				 [ bgMovie,setbgMovie] = useState(''),
				 [ solo,setsolo] = useState(''),
         [ active,setactive]              = useState(''),
         [ showInfo, setShowInfo ]        = useState(true),
  			 [ showLayouts, setShowLayouts ]  = useState(false),
  			 [ showLoading, setShowLoading ]  = useState(false),
  			 [ showJSON, setShowJSON ]        = useState(false),
  			 [ textOpac, setTextOpac ]        = useState(false),
         [ playListObj, setPlayListObj]   = useState([]),
  			 [ thetoken, setThetoken] = useState('Token not Set');

  const doStripe = arr => {
    var tog = false, bgc;

    arr.forEach( (e,i) => {
      tog === false ? bgc = 'whitebg' : bgc = 'graybg'
      tog =! tog; 
      arr[i].bgc = bgc;
    })
    return arr
  }

  const modPlayList = (action, id) => {
    changeVis('d','b')
    var idList = '';
    if (playListLayoutIdsStr !== null &&
        playListLayoutIdsStr.toString().includes(','))  idList  = playListLayoutIdsStr.split(',')
    else                                                idList = [playListLayoutIdsStr]
    
    idList = idList.map(id => parseInt(id))  // convert values to integer
    idList = idList.filter(id => !isNaN(id))  // remove NaN

    if (action === 'remove') {
      idList = idList.filter( a =>  parseInt(a) !== parseInt(id) )
    } else {
      idList.push(id)
    }
    var newString = JSON.stringify(idList)
              .replace('[','')
              .replace(']','')
    updPlayListLayoutStr(playListID,newString,thetoken).then( ()=> {
      setPlayListLayoutIdsStr(newString)
      setTimeout(() => {
        changeVis('b','d')
      }, 800);
      
    })
  }


  const textOpacToggle  = () => setTextOpac(!textOpac) 

  const changeVis = (newActive, lastActive) => {
      if(lastActive === 'a')      setShowInfo(false)
      else if(lastActive === 'b') setShowLayouts(false)
      else if(lastActive === 'c') setShowJSON(false)
      else if(lastActive === 'd') setShowLoading(false)

      if(newActive === 'a')       setShowInfo(true)
      else if(newActive === 'b')  setShowLayouts(true)
      else if(newActive === 'c')  setShowJSON(true)
      else if(newActive === 'd')  setShowLoading(true)
  }

  useEffect(() => { 
    window.addEventListener('resize', sizeSideBar);
    sizeSideBar();
    let temp = window.location.href.toString().split('/')
    let rest = temp[temp.length -1].toString()
 
    localForage.getItem('token', function(err, startToken) {
      setThetoken(startToken)
      setTimeout(() => {
        if(thetoken !== 'Token not Set'){

          setPlayListID(rest)    
          getLayouts(thetoken).then(res2 => {
            getPlayLists(thetoken).then(res1 => {

              res1 = doStripe(res1)
              res2 = doStripe(res2)
              if(res2 !== undefined && res2 !== []){
                setLayoutsArr(res2)
              }
              if(res1 !== undefined && res1 !== []){
                res1.forEach( e => {
            
                  if(parseInt(e.id) === parseInt(rest)) {
                    setPlayListObj(e)
                    setid(e.id) 
                    setplaylist_key(e.playlist_key) 
                    setplacement(e.placement) 
                    setname(e.name) 
                    setauthor(e.author) 
                    setdate(e.date) 
                    setstartDate(e.startDate) 
                    setendDate(e.endDate) 
                    setstartTime(e.startTime) 
                    setendTime(e.endTime) 
                    setplayOrder(e.playOrder) 
                    setduration(e.duration) 
                    settransDuration(e.transDuration) 
                    setfadeIn(e.fadeIn) 
                    setfadeOut(e.fadeOut) 
                    settype(e.type) 
                    setasset(e.asset) 
                    setidp(e.idp) 
                    setlayout(e.layout) 
                    setbgMovie(e.bgMovie) 
                    setsolo(e.solo)
                    setactive(e.active)
                
                    // the following hold the object containing the Layout ids in order
                    if(e.playListLayoutIdsStr !== undefined && e.playListLayoutIdsStr !== ''){
                        setPlayListLayoutIdsStr(e.playListLayoutIdsStr)
                    }

                  }
                })
              }
            })
          })

        }
      }, 100);
    })

  }, [thetoken]);
  


  return (
    <div id="main"  >
      <h3>Edit Playlist ID: {playListID}</h3>
        <Navi changeVis={changeVis} />
        
        <CSSTransition
          in={showInfo}
          timeout={400}
          classNames="list-transition"
          unmountOnExit
          appear
          onEntered={textOpacToggle}
          onExit={textOpacToggle}
        >
            <Info 
              id={id} 
              playlist_key={playlist_key} 
              placement={placement} 
              name={name} 
              author={author} 
              date={date} 
              startDate={startDate} 
              endDate={endDate} 
              startTime={startTime} 
              endTime={endTime} 
              playOrder={playOrder} 
              duration={duration} 
              transDuration={transDuration} 
              fadeIn={fadeIn} 
              fadeOut={fadeOut} 
              type={type} 
              asset={asset} 
              idp={idp} 
              ayout={layout} 
              bgMovie={bgMovie} 
              solo={solo} 
              active={active}
              playListLayoutIdsStr={playListLayoutIdsStr}
            />
        </CSSTransition>

        <CSSTransition
          in={showLayouts}
          timeout={400}
          classNames="list-transition"
          unmountOnExit
          appear
          onEntered={textOpacToggle}
          onExit={textOpacToggle}
        >
            <Layouts  
                layoutsArr={layoutsArr} 
                modPlayList={modPlayList}
                playListLayoutIdsStr={playListLayoutIdsStr}
            />
        </CSSTransition>

        <CSSTransition
          in={showJSON}
          timeout={400}
          classNames="list-transition"
          unmountOnExit
          appear
          onEntered={textOpacToggle}
          onExit={textOpacToggle}
        >
            <JSONtext 
              layoutsArr={layoutsArr}
              playListObj={playListObj}
              playListLayoutIdsStr={playListLayoutIdsStr}
            />
        </CSSTransition>

        <CSSTransition
          in={showLoading}
          timeout={400}
          classNames="list-transition"
          unmountOnExit
          appear
          onEntered={textOpacToggle}
          onExit={textOpacToggle}
        >
            <Loading />
        </CSSTransition>

    </div>
  )
}

