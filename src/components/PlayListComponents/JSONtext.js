import React from 'react';
import './PlayList.css'

export const JSONtext = (props) => {

  //props.layoutsArr
  //props.playListObj
  var path = "uploads"
  const createLayout = (layoutId, layoutsArr,o) => {
    var thisLayout = ''
    layoutsArr.forEach( e => {
      if( e !== null && (parseInt(e.id) === parseInt(layoutId)))
          thisLayout = `{
            "id": ${e.id},
            "Title": "${e.title}",
            "Group": "${e.group}",
            "Fadein": ${e.fadeIn},
            "Fadeout": ${e.fadeOut},
            "Length": ${e.duration},
            "layout": "${e.layout}",
            "Asset": [
              "${path + e.asset}"
            ],
            "DonorLevel": "${e.donorLevel}",
            "Type": "${e.type}",
            "Text": "${e.text}",
            "Quote": "${e.quote}"
          },` 
    })
    
    return thisLayout
  }


  let layouts = ''

  if(props.playListLayoutIdsStr !== null && props.playListLayoutIdsStr !== undefined){
    let stringLoop = props.playListLayoutIdsStr +','
    let stringArray = stringLoop.split(',')
    stringArray.forEach( (e) => {
      layouts += createLayout(e, props.layoutsArr)
    })
    
  }



  var JSON = `
  {
    "placement": "${props.playListObj.placement}",
    "name": "${props.playListObj.name}",
    "meta": {
      "id": ${props.playListObj.id},
      "playlist_key": "${props.playListObj.playlist_key}",
      "name": "${props.playListObj.name}",
      "author": "${props.playListObj.author}",
      "date": "${props.playListObj.date}",
      "startDate": "${props.playListObj.startDate}",
      "endDate": "${props.playListObj.endDate}",
      "startTime": "${props.playListObj.startTime}",
      "endTime": "${props.playListObj.endTime}",
      "active": ${props.playListObj.active}
    },
    "playlist": [
      {
        "play_order": ${props.playListObj.playOrder},
        "duration": ${props.playListObj.duration},
        "transition": {
          "duration": ${props.playListObj.transDuration},
          "fadein": ${props.playListObj.fadeIn},
          "fadeout": ${props.playListObj.fadeOut},
          "Type": "${props.playListObj.type}",
          "Asset": "${path + props.playListObj.asset}"
        },
        "id": ${props.playListObj.idp},
        "layout": "${props.playListObj.layout}",
        "bgMovie": "${path + props.playListObj.bgMovie}",
        "solo": ${props.playListObj.solo},
        "layouts": [
          ${layouts}
        ]
      }
    ]
  }
  `

    return (
      <div id="json" className="defaultBox">

        <pre>
          {JSON}
        </pre>
        
      </div>
    )
  }