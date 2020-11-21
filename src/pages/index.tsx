import React,{useState, useEffect} from 'react';
import {Formik,Form,Field,} from 'formik';
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Styles from './index.module.css'
import Footer from '../components/Footer'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }),
);
export default function Home(){
  const classes = useStyles();
  interface mydata {
    ref: object
    ts: number
    data: {
      subject:string,
      chapter: string,
      topic: string,
      content:string,
    }
  }
  const [mydata, setData] = useState<null | mydata[]>(null);
  const [fetchdata, setFetchdata] = useState(false);
  const [updatingData, setUpdatingData] = useState(undefined)
  const [updateData, setUpdateData] = useState(false)
  const handleOpenUpdate = () => {
    setUpdateData(true);
  };
  
  const handleCloseUpdate = () => {
    setUpdateData(false);
  };
  useEffect(()=>{
    fetch('/.netlify/functions/read',{
      method: 'get'
    })
    .then(response => response.json())
    .then(data => {
      setData(data.data)
      console.log(data.data)
    })
    .catch(e =>{
      console.log(e)
    })
  },[fetchdata])

  const updatemessage = (id:string) => {
    var updateData = mydata.find(messa=>messa.ref["@ref"].id === id)
    setUpdatingData(updateData)
  }

  const deletemessage = (deletedata:mydata)=>{
    fetch(`/.netlify/functions/delete`,{
      method: 'post',
      body: JSON.stringify({id:deletedata.ref["@ref"].id})
    })
    .then(response => response.json())
    .then(data => {
      setFetchdata(data)
    })
  }

  const createBody = (
    <Formik
      initialValues={{subject:"" ,chapter:"",topic:"",content:""}}
      onSubmit={(value,action)=>{
        fetch(`/.netlify/functions/create`,{
          method:'post',
          body: JSON.stringify(value),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            subject:"",
            chapter:"",
            topic:"",
            content:""
          },
        })
        setFetchdata(false)
        
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="subject"
        label="Your Subject Name"
        name="subject"
        type="text"
        required
        />

        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="chapter"
        label="Your Chapter Name"
        name="chapter"
        type="text"
        required
        />
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="topic"
        label="Your Topic Name"
        name="topic"
        type="text"
        required
        
        />
        <br/>
        <Field
        as={TextareaAutosize}
        rowsMin={10}
        id="content"
        label="Your Learned Content"
        name="content"
        type="text"
        placeholder="Message"
        style={{width:"500px",marginTop:"10px"}}
        />
        <br/>
        <Button type="submit" variant="contained" color="primary">create message</Button>
        
      </Form>
    )}</Formik>
    
  )
  const updateBody = (
    <Formik
      initialValues={{subject:updatingData !== undefined ?
      updatingData.data.subject:"",  
      chapter:updatingData !== undefined ? 
      updatingData.data.chapter: "",
      topic:updatingData !== undefined ? 
      updatingData.data.topic: "",
      content:updatingData !== undefined ? 
      updatingData.data.content: "",
      }}
      onSubmit={(value,action)=>{
        fetch(`/.netlify/functions/update`,{
          method:'post',
          body: JSON.stringify({
            chapter: value.chapter,
            id:updatingData.ref["@ref"].id,
          }),
        })
        setFetchdata(true)
        action.resetForm({
          values:{
            subject:"",  
            chapter:"",
            topic:"",
            content:""
          },
        })
        setFetchdata(false)
        handleCloseUpdate()
      }}
      
    >{formik => (
      <Form
      onSubmit={formik.handleSubmit}
      >
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="subject"
        label="Your Subject Name"
        name="subject"
        type="text"
        required
        />

        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="chapter"
        label="Your Chapter Name"
        name="chapter"
        type="text"
        required
        />
        <Field
        style={{padding:"0 10px 5px 0"}}
        variant="outlined"
        as={TextField}
        id="topic"
        label="Your Topic Name"
        name="topic"
        type="text"
        required
        
        />
        <br/>
        <Field
        as={TextareaAutosize}
        rowsMin={10}
        id="content"
        label="Your Learned Content"
        name="content"
        type="text"
        placeholder="Message"
        style={{width:"500px",marginTop:"10px"}}
        />
        <br/>
        <Button type="submit" variant="contained" color="primary">update</Button>
        <Button type="button" variant="contained" onClick={handleCloseUpdate}>close</Button>
      </Form>
    )}</Formik>
  )
  return(
    <div >
      <h2 className={Styles.title}>Welcome to Shaikh CRUD App</h2>
      <Box m={1} p={1}>
      {createBody}
      </Box>
          
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={updateData}
        onClose={handleCloseUpdate}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper}>
          {updateBody}
          
        </div>
      </Modal>
      {mydata === null || mydata === undefined ? (
        <div>
          <CircularProgress/>
        </div>
      ):mydata.length >= 1 ? (
        <Box >
          <Box m={1} p={1} >
    
            {mydata.map((ind,i)=>(
              <Box  key={i} m={1} p={1} className={Styles.databox}>
                <Box p={1}  >
                  <h1 style={{paddingRight:"50%px"}}>
                      Subject: {ind.data.subject}
                  </h1>
                  <h2>
                      Chapter: {ind.data.chapter}
                  </h2>
                  <h3>
                      Topic: {ind.data.topic}
                  </h3>
                  <h4>
                    Learned: 
                  </h4>
                  <p>{ind.data.content}</p>
                </Box>
                <Button color="primary" onClick={()=>{
                handleOpenUpdate()
                updatemessage(ind.ref["@ref"].id)
                }}>update</Button>
                <Button color="secondary" onClick={()=>{
                  deletemessage(ind)
                }}>Delete</Button>
              </Box>
            ))}
          </Box>
        </Box>
      ):(
        <div className={Styles.record}>No Records</div>
      )}
      <Footer />
    </div>
  )
}