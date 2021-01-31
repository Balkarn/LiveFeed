import './App.css';
import React/*, { useEffect, useState }*/ from "react";
import { TextField, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';


export default function LoginScreen() {

  const [nameTextfieldValue, setNameTextfieldValue] = React.useState('');
  const [passwordTextfieldValue, setPasswordTextfieldValue] = React.useState('');
  const [password2TextfieldValue, setPassword2TextfieldValue] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [pError, setpError] = React.useState(false);
  const [p2Error, setp2Error] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  //Function called whenever the name textfield is changed
  const handleNameTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    setNameTextfieldValue(eventVal);
    setNameError(eventVal.length < 4);
  }

  //Function called whenever the password textfield is changed
  const handlePasswordTextfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    setPasswordTextfieldValue(eventVal);
    setpError(eventVal.length < 4);
  }

  //Function called whenever the confirm password textfield is changed
  const handlePassword2Textfield = event => {
    var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
    setPassword2TextfieldValue(eventVal);
    setp2Error(eventVal !== passwordTextfieldValue);
  }

  //Function when the send button is clicked
  const sendValue = () => {
    var temp1 = nameTextfieldValue.length < 4 //setting a state isn't synchronous so store value in a temp variable
    var temp2 = passwordTextfieldValue.length < 4
    var temp3 = password2TextfieldValue !== passwordTextfieldValue
    setNameError(temp1);
    setpError(temp2);
    setp2Error(temp3);
    if (!(temp1 | temp2 | temp3)) {
      var formData = new FormData();
      formData.append("username", nameTextfieldValue);
      formData.append("password", passwordTextfieldValue);
      const url = "http://localhost:80/react-backend/";
      axios.post(url, formData)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
      setIsLoggedIn(true)
    }
  }

  if (!isLoggedIn) { //If the user has not yet logged in render the login component

    return (
      <div className="whole">
        <div className="header">
          <h><span className="logo-header">LiveFeed</span></h>
          <p>The 2021 DBCampus Project</p>
        </div>

        <div className="main">

          <p className="logo-header">Sign Up</p>
          <form className="form-container">
            <div className="form">
              <TextField
                font-size='16px'
                id='outlined-textarea'
                label='Username'
                placeholder='Write your name here'
                variant='outlined'
                onChange={handleNameTextfield}
                error={nameError}
                className="input"
                helperText={nameError ? 'Must be at least 4 Characters' : ' '}
              />
            </div>
            <div className="form">
              <TextField
                font-size='16px'
                id='outlined-textarea'
                label='Password'
                type="password"
                placeholder='Enter password here'
                variant='outlined'
                onChange={handlePasswordTextfield}
                error={pError}
                className="input"
                helperText={pError ? 'Must be at least 4 Characters' : ' '}
              />
            </div>
            <div className="form">
              <TextField
                font-size='16px'
                id='outlined-textarea'
                label='Confirm Password'
                type="password"
                placeholder='Enter password here'
                variant='outlined'
                onChange={handlePassword2Textfield}
                error={p2Error}
                className="input"
                helperText={p2Error ? 'Passwords must match' : ' '}
              />
            </div>
            <div className="form">
              <Button
                variant='contained'
                color='primary'
                size='medium'
                endIcon={<SendIcon />}
                onClick={sendValue}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    );

  } else { //Otherwise render the main screen
    return (<MainComponent name={nameTextfieldValue} />);
  }
}

const MainComponent = ({ name }) => {

  //Displays the username
  return (
    <p> Hello {name}! </p>
  );

}