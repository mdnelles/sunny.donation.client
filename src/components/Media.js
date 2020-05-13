import React, { useState, useEffect } from 'react';
import { sizeSideBar } from './_sharedFunctions';
import { Alert, Button, Progress, Spinner } from 'reactstrap';
import { getMedia, removeFile } from './MediaFunctions';
import localForage from 'localforage';

const Mediarow = (props) => {
   let fType = '';
   if (props.name !== undefined) {
      let f = props.name.toString();
      if (f.includes('.mov') || f.includes('.avi') || f.includes('.mp4')) {
         fType = 'Movie';
      } else if (
         f.includes('.mp3') ||
         f.includes('.wav') ||
         f.includes('.mid') ||
         f.includes('.snd') ||
         f.includes('.ram')
      ) {
         fType = 'Audio';
      } else {
         fType = 'Image';
      }
   }

   return (
      <div
         className={
            'donors__edit__table-row flex_container_row font-gray padding10 marginRight ' +
            props.bgc
         }
      >
         <div className='donors__edit__table-item flex-4 leftpad15'>
            <a
               href={'./' + props.path_display}
               target='_blank'
               rel='noopener noreferrer'
            >
               {props.name}
            </a>
         </div>
         <div className='donors__edit__table-item flex-4'>{fType}</div>
         <div className='donors__edit__table-item flex-2'>
            <Button
               color='primary'
               onClick={() => props.deleteFile(props.name)}
            >
               Delete
            </Button>
         </div>
      </div>
   );
};

const AllMediaRows = (props) => {
   var tog = false,
      bgc;

   if (props.mediaObj === undefined || !Array.isArray(props.mediaObj)) {
      return <div></div>;
   } else {
      props.mediaObj.forEach((e, i) => {
         tog === false ? (bgc = 'whitebg') : (bgc = 'graybg');
         tog = !tog;
         props.mediaObj[i].bgc = bgc;
      });
      var date = 'Feb 6';
      return props.mediaObj.map((media) => (
         <Mediarow
            name={media.name}
            path_display={'/upload/' + media.name}
            key={media.name}
            date={date}
            bgc={media.bgc}
            deleteFile={props.deleteFile}
         />
      ));
   }
};

const Msgbar = (props) => {
   return (
      <Alert color={props.alertColor} className='marginRight vAlignMiddle'>
         <Spinner type='grow' color='primary' className={props.spin} />{' '}
         {props.msg}
      </Alert>
   );
};

export const Media = () => {
   const [mediaObj, setMediaObj] = useState({}),
      [upVis, setUpVis] = useState('displayNone'),
      [file, setFile] = useState(''),
      [alertColor, setAlertColor] = useState('secondary'),
      [msg, setMsg] = useState('Loading Media ...'),
      [spin, setSpin] = useState('displayInLineBlock '),
      [viewProgress, setViewProgress] = useState('displayNone'),
      [uploadRunning, setUploadRunning] = useState(0),
      [uploadTotal, setUploadTotal] = useState(0),
      [percentComplete, setPercentComplete] = useState(0),
      [fileSize, setFileSize] = useState(0),
      [thetoken, setThetoken] = useState('Token not Set');

   const deleteFile = (fileName) => {
      setSpin('displayBlock');
      setMsg(`Deleting Media File <b>${fileName}</b>`);
      removeFile(thetoken, fileName).then((data) => {
         setSpin('displayNone');
         console.log(data);
         if (data === 'ok') {
            setAlertColor('success');
            setMsg(`Deleted file ${fileName}`);
            setMediaObj(mediaObj.filter((obj) => obj.name !== fileName));
            //console.log(mediaObj.filter(obj => obj.name !== fileName))
         } else {
            setMsg(`Could not delete ${fileName}`);
         }
      });
   };

   const loadHandler = (event) => {
      var resMsg = event.target.responseText;
      if (resMsg !== undefined && resMsg.toString().includes('rror')) {
         setAlertColor('danger');
         setViewProgress('displayNone');
      } else {
         setAlertColor('success');
         setTimeout(() => {
            setViewProgress('displayNone');
         }, 2000);
      }

      setMsg(resMsg);
   };

   const errorHandler = (event) => {
      setAlertColor('danger');
      setMsg('Error uploading file please contact the administrator');
   };

   const abortHandler = (event) => {
      setAlertColor('danger');
      setMsg('File Upload Aborted');
   };

   const uploadProgressHandler = (event) => {
      setAlertColor('info');
      setUploadRunning(event.loaded);
      setUploadTotal(event.total);
      var percent = (event.loaded / event.total) * 100;
      var progress = Math.round(percent);
      setPercentComplete(progress);
   };

   const startUploadFile = (e) => {
      setAlertColor('primary');
      setSpin('visible');
      setMsg(`Uploading Media ...`);
      setViewProgress('displayBlock');
      e.preventDefault();

      var formData = new FormData();
      var xhr = new XMLHttpRequest();

      formData.append('files', file); // this is a state object set onChange
      formData.append('token', thetoken);
      formData.append('caller', 'Mediajs.startUploadFile');
      xhr.open('post', '/media/uploadfile', true);

      xhr.addEventListener('error', errorHandler, false);
      xhr.upload.addEventListener('progress', uploadProgressHandler, false);
      xhr.addEventListener('load', loadHandler, false);
      xhr.addEventListener('abort', abortHandler, false);

      xhr.send(formData);
   };

   const onChangeHandler = (event) => {
      var mime = event.target.files[0].type;
      if (event.target.files[0].size > 11000000) {
         setAlertColor('danger');
         setMsg('This file size is too big (10MB max)');
         setUpVis('displayNone');
      } else if (
         mime === undefined ||
         (!mime.includes('image') &&
            !mime.includes('video') &&
            !mime.includes('audio'))
      ) {
         setAlertColor('danger');
         setMsg('Wrong filetype: must be Image, Audio or Video');
         setUpVis('displayNone');
      } else {
         setAlertColor('success');
         setMsg('File size is accpeted');
         setFile(event.target.files[0]); // doing singe file at a time for AWS
         setFileSize(event.target.files[0].size);
         setUpVis('displayInLineBlock');
      }
   };

   useEffect(() => {
      document.body.style.background = '#ffffff';
      window.addEventListener('resize', sizeSideBar);
      sizeSideBar();
      localForage.getItem('token', function(err, startToken) {
         setThetoken(startToken);
         getMedia(startToken).then((res) => {
            setMediaObj(res);
            setSpin('displayNone');
            if (msg === 'Loading Media ...') {
               setAlertColor('success');
               setMsg('Media has loaded ');
            }
         });
      });
   }, [msg]);

   return (
      <div id='main'>
         <Alert color='primary'>
            <div id='formWrapper'>
               <form encType='multipart/form-data' method='post'>
                  <Button
                     color='primary'
                     className={upVis}
                     onClick={(event) => startUploadFile(event)}
                     type='button'
                  >
                     Upload
                  </Button>
                  <input
                     type='file'
                     name='file'
                     id='file'
                     onChange={onChangeHandler}
                     className='fileUp'
                  />
                  <input type='hidden' name='file_size' value={fileSize} />
                  <div className={viewProgress}>
                     <div className='text-center'>
                        {uploadRunning} of {uploadTotal} - ({percentComplete}%)
                     </div>
                     <Progress value={percentComplete} />
                  </div>
               </form>
            </div>
         </Alert>

         <Msgbar alertColor={alertColor} msg={msg} spin={spin} />

         <div className='donors__edit__table-header flex_container_row no-shrink'>
            <div className='donors__edit__table-item flex-4 leftpad15'>
               File
            </div>

            <div className='donors__edit__table-item flex-4'>Type</div>
            <div className='donors__edit__table-item flex-2'>Delete</div>
         </div>

         <AllMediaRows mediaObj={mediaObj} deleteFile={deleteFile} />
      </div>
   );
};
