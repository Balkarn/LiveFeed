import './App.css';
import React, { useEffect/*, useState*/, Component } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import 'fontsource-roboto';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import EventIcon from '@material-ui/icons/Event';
import CreateIcon from '@material-ui/icons/Create';
import ForwardIcon from '@material-ui/icons/Forward';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import InputIcon from '@material-ui/icons/Input';
import CheckIcon from '@material-ui/icons/Check';
import PostAddIcon from '@material-ui/icons/PostAdd';

import TemplateComponent from './Screens/TemplateComponnet';
import HostEventComponent from './Screens/HostEventComponent';
import JoinEventComponent from './Screens/JoinEventComponent';
import EventHistoryComponent from './Screens/EventHistoryComponent';
import MeetingComponent from './Screens/MeetingComponent'
import AccountSettingComponent from './Screens/AccountSettingComponent';

export default function Main() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userID, setUserID] = React.useState(-1);
  
  if (!isLoggedIn) {
    return <LoginComponent setIsLoggedIn={setIsLoggedIn} setUserID={setUserID} />
  } else { //Otherwise render the main screen
    return (
      <>
      <Switch>
        <Route component={() => <MeetingComponent />} path='/meeting/:id' exact></Route>
        <Route component={() => <MenuScreen userID={userID} />} path='/' ></Route>
      </Switch>
      </>
    );
  }
}

const LoginComponent = (props) => {
	
  useEffect(() => {
    document.body.style.backgroundColor = "#15bfff"
  }, []); // Only run once

  var qs = require('qs');
  const phpurl = "http://localhost:80/server/php/index.php";
	
  const [SIGNUPnameTextfieldValue, SIGNUPsetNameTextfieldValue] = React.useState('');
  const [SIGNUPpasswordTextfieldValue, SIGNUPsetPasswordTextfieldValue] = React.useState('');
  const [SIGNUPpassword2TextfieldValue, SIGNUPsetPassword2TextfieldValue] = React.useState('');
  const [SIGNUPnameError, SIGNUPsetNameError] = React.useState(false);
  const [SIGNUPpError, SIGNUPsetpError] = React.useState(false);
  const [SIGNUPp2Error, SIGNUPsetp2Error] = React.useState(false);

  const [LOGINnameTextfieldValue, LOGINsetNameTextfieldValue] = React.useState('');
  const [LOGINpasswordTextfieldValue, LOGINsetPasswordTextfieldValue] = React.useState('');
  const [LOGINnameError, LOGINsetNameError] = React.useState(false);
  const [LOGINpError, LOGINsetpError] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //Function called whenever the name textfield is changed
  const SIGNUPhandleNameTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    SIGNUPsetNameTextfieldValue(eventVal);
    SIGNUPsetNameError(eventVal.length < 4);
  }

  //Function called whenever the password textfield is changed
  const SIGNUPhandlePasswordTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    SIGNUPsetPasswordTextfieldValue(eventVal);
    SIGNUPsetpError(eventVal.length < 4);
  }

  //Function called whenever the confirm password textfield is changed
  const SIGNUPhandlePassword2Textfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    SIGNUPsetPassword2TextfieldValue(eventVal);
    SIGNUPsetp2Error(eventVal !== SIGNUPpasswordTextfieldValue);
  }

  //Function called whenever the name textfield is changed
  const LOGINhandleNameTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    LOGINsetNameTextfieldValue(eventVal);
    LOGINsetNameError(eventVal.length < 4);
  }

  //Function called whenever the password textfield is changed
  const LOGINhandlePasswordTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    LOGINsetPasswordTextfieldValue(eventVal);
    LOGINsetpError(eventVal.length < 4);
  }
	
  //Function when the sign up button is clicked
  // Need FName, LName, Email, Role ('host'/'user')
  const SIGNUPsendValue = () => {
    var temp1 = SIGNUPnameTextfieldValue.length < 4 //setting a state isn't synchronous so store value in a temp variable
    var temp2 = SIGNUPpasswordTextfieldValue.length < 4
    var temp3 = SIGNUPpassword2TextfieldValue !== SIGNUPpasswordTextfieldValue
    SIGNUPsetNameError(temp1);
    SIGNUPsetpError(temp2);
    SIGNUPsetp2Error(temp3);
    if (!(temp1 || temp2 || temp3)) {

      // random email generation algorithm, so the database can be set to only allow unique email addresses to prevent spam user creation
      var email = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( var i = 0; i < 10; i++ ) {
        email += characters.charAt(Math.floor(Math.random() * 62));
      }

      var role = ''
      if (Math.random() < 0.4) {
        role = 'host';
      } else {
        role = 'user'
      }

      var data = {
        function:'signup',
        arguments:[SIGNUPnameTextfieldValue, SIGNUPpasswordTextfieldValue, "Ronald", "Reagan", email+"@aol.com", role]
      }

      axios.post(phpurl, qs.stringify(data))
          .then(res => {
            
            if (res.data.error) {
              console.log(res.data.error)
            }
            if (res.data.result) {
              console.log(res.data.result) 
              props.setIsLoggedIn(true)
            }
          })
          .catch(err => console.log(err));

      props.setIsLoggedIn(true) //TEMPORARY LINE FOR TESTING WITHOUT DATABASE
    } else {
      setOpen(true)
    }
  }

  //Function when the log in button is clicked
  //TODO Connect to backend
  const LOGINsendValue = () => {
    var temp1 = LOGINnameTextfieldValue.length < 4 //setting a state isn't synchronous so store value in a temp variable
    var temp2 = LOGINpasswordTextfieldValue.length < 4
    LOGINsetNameError(temp1);
    LOGINsetpError(temp2);
    if (!(temp1 || temp2)) {

      var data = {
        function:"login",
        arguments:[LOGINnameTextfieldValue, LOGINpasswordTextfieldValue]
      }
      axios.post(phpurl, qs.stringify(data))
          .then(res => {
            
            if (res.data.error) {
              console.log(res.data.error)
            }
            if (res.data.result) {
              props.setUserID(res.data.result)
              props.setIsLoggedIn(true)
            }
          })
          .catch(err => console.log(err));
    } else {
      setOpen(true)
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  return (

    <>

    <div className="whole">
      <div className="header">
        <h><span className="logo-header">LiveFeed</span></h>
        <p>The 2021 DBCampus Project</p>
      </div>

      <div className="main">
        <Paper elevation={10} >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<InputIcon />} label="Log In" />
            <Tab icon={<PostAddIcon />} label="Sign Up" />
          </Tabs>
          {tabValue === 1 ?
            <div>
              <div className="textfield">
                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Username'
                  value={SIGNUPnameTextfieldValue}
                  placeholder='Write your name here'
                  variant='outlined'
                  required
                  fullWidth="true"
                  onChange={SIGNUPhandleNameTextfield}
                  error={SIGNUPnameError}
                  className="input"
                  helperText={SIGNUPnameError ? 'Must be at least 4 Characters' : ' '}
                />
              </div>

              <div className="textfield">
                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Password'
                  value={SIGNUPpasswordTextfieldValue}
                  type="password"
                  required
                  fullWidth="true"
                  placeholder='Enter password here'
                  variant='outlined'
                  onChange={SIGNUPhandlePasswordTextfield}
                  error={SIGNUPpError}
                  className="input"
                  helperText={SIGNUPpError ? 'Must be at least 4 Characters' : ' '}
                />
              </div>

              <div className="textfield">
                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Confirm Password'
                  type="password"
                  value={SIGNUPpassword2TextfieldValue}
                  required
                  fullWidth="true"
                  placeholder='Enter password here'
                  variant='outlined'
                  onChange={SIGNUPhandlePassword2Textfield}
                  error={SIGNUPp2Error}
                  className="input"
                  helperText={SIGNUPp2Error ? 'Passwords must match' : ' '}
                />
              </div>

              <div className="button">
                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  fullWidth="true"
                  endIcon={<CheckIcon />}
                  onClick={SIGNUPsendValue}
                >
                    Sign Up
                </Button>

              </div>
            </div>
          : 
            <div>
              <div className="textfield">

                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Username'
                  placeholder='Write your name here'
                  variant='outlined'
                  value={LOGINnameTextfieldValue}
                  required
                  fullWidth="true"
                  onChange={LOGINhandleNameTextfield}
                  error={LOGINnameError}
                  className="input"
                  helperText={LOGINnameError ? 'Must be at least 4 Characters' : ' '}
                />

              </div>
              <div className="textfield">

                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Password'
                  type="password"
                  value={LOGINpasswordTextfieldValue}
                  required
                  fullWidth="true"
                  placeholder='Enter password here'
                  variant='outlined'
                  onChange={LOGINhandlePasswordTextfield}
                  error={LOGINpError}
                  className="input"
                  helperText={LOGINpError ? 'Must be at least 4 Characters' : ' '}
                />

              </div>
              <div className="button">

                <Button
                  variant='contained'
                  color='primary'
                  size='medium'
                  fullWidth="true"
                  endIcon={<CheckIcon />}
                  onClick={LOGINsendValue}
                >
                  Log In
                </Button>

              </div>
            </div>
          }
          
        </Paper>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}

      >
        <SnackbarContent style={{
          backgroundColor: '#ef5350',
        }}
          message="Invalid details"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>

    </div>
    </>
  );

}

const MenuScreen = (props) => {

  const [tabValue, setTabValue] = React.useState(2);

  return (
    <div className="whole">
        <TabBar setTabValue={setTabValue} />

        <div className="main2">
          <Paper elevation={10}>
            <div className="page">
              {tabValue === 0 && <HostEventComponent userID={props.userID} />}
              {tabValue === 1 && <TemplateComponent userID={props.userID} />}
              {tabValue === 2 && <JoinEventComponent userID={props.userID} />}
              {tabValue === 3 && <EventHistoryComponent />}
              {tabValue === 4 && <AccountSettingComponent />}
            </div>
          </Paper>
        </div>
      </div>
  )
}

const TabBar = ({setTabValue}) => {

  const [value, setValue] = React.useState(2)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabValue(newValue);
  }

  //Displays the username
  return (
    <div>

      <AppBar position="static" color="default" >
        <Tabs
          value={value}
          onChange={handleChange}
          scrollButtons="off"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Host Event" icon={<EventIcon />} />
          <Tab label="Template Creator" icon={<CreateIcon />} />
          <Tab label="Join Event" icon={<ForwardIcon />} />
          <Tab label="Event History" icon={<HistoryIcon />} />
          <Tab label="Account Settings" icon={<SettingsIcon />} />
        </Tabs>
      </AppBar>
      
    </div>
  );

}
