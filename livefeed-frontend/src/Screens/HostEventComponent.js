import React, { useEffect/*, useState*/ } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Checkbox } from '@material-ui/core';
import 'fontsource-roboto';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CreateIcon from '@material-ui/icons/Create';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import events from '../test-data/meetings';
import templates from '../test-data/templates';

import makeid from '../Functions/generateString';


const HostEventComponent = (props) => {

    const php_url = "http://localhost:80/server/php/index.php";
    var qs = require('qs');

    const [current_events, setEvent] = React.useState([]);
    const [userid,setUserid] = React.useState(12);//current user id
    const [linkto,setLinkto] = React.useState('meeting/' + props.userID);//move to meeting screen as host
    const [available_templates, setAvailableTemplates] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);

    // Delete Event 
    const handleDeleteEvent = (_event) => {
        let filtered_events = current_events.filter( event => event !== _event);
        setEvent(filtered_events); 
    }

    // // Get events for user accessing 
    const getUserEvents = () => {

        var data = {
            function: 'getmeetings',
            arguments: [
                props.userID,
            ]
        }

        axios.post(php_url, qs.stringify(data))
        .then(res => {
            
            let events = res.data.result;
            setEvent(events);
            setLoading(false);
        
        })

    }

    // Get templates for user accessing
    const getUserTemplates = () => {
        var data = {
            function: 'getusertemplates',
            arguments: [
                props.userID,
            ]
        }

        axios.post(php_url, qs.stringify(data))
        .then(res => {
            // Converting Template Response into Template
            var templateData = Object.keys(res.data.result).map((key) => [Number(key), res.data.result[key]]);
            setAvailableTemplates(templateData);
        })
    }

    useEffect(() => {

        getUserEvents();
        getUserTemplates();

    }, []);

    // Add new event -- SAVE BUTTON 
     async function handleNewMeeting() {

        const _event = {
            event_name: currentEventName,
            event_starttime: currentEventStartTime,
            event_endtime: currentEventEndTime,
            event_date: currentEventDate,
            templates: selectedTemplates, 
            event_host: userid,
            event_access_code: makeid(8)
        };

        // Send data of new event to backend 
        var data = {
            function: 'addmeeting',
            arguments: [currentEventName,
            currentEventDate,
            props.userID,
            selectedTemplates,
            ]
        }

        const getData = await axios.post(php_url, qs.stringify(data))
        .then(res => {
            console.log("Working");
            if (res.data.error) {
                console.log(res.data.error);
            }
        }).catch(err => console.log(err));

        let res = getData;

        setCurrentEventName('');
        setCurrentEventDesc('');
        setCurrentEventDate('');
        setCurrentEventStartTime('');
        setCurrentEventEndTime('');
        setSelectedTemplates([]);
        setOpen(false);
        getUserEvents();
        setOpenTemplateSelector(false);

    }

    // Event Name
    const [currentEventName, setCurrentEventName] = React.useState('');
    const handleCurrentEventNameTextField = event => {
        var eventName = event.target.value;
        setCurrentEventName(eventName);
    }

    // Event Description
    const [currentEventDesc, setCurrentEventDesc] = React.useState('');
    const handleCurrentEventDescTextField = event => {
        var eventDesc = event.target.value;
        setCurrentEventDesc(eventDesc);
    }

    // Event Date
    const [currentEventDate, setCurrentEventDate] = React.useState('');
    const handleCurrentEventDateTextField = event => {
        console.log(event.target.value);
        setCurrentEventDate(event.target.value);
    }

    // Event Start Time
    const [currentEventStartTime, setCurrentEventStartTime] = React.useState('');
    const handleCurrentEventStartTimeTextField = event => {
        setCurrentEventStartTime(event.target.value);
    }

    // Event End Time
    const [currentEventEndTime, setCurrentEventEndTime] = React.useState('');
    const handleCurrentEventEndTimeTextField = event => {
        setCurrentEventEndTime(event.target.value);
    }

    // Templates to use 
    const [openTemplateSelector, setOpenTemplateSelector] = React.useState(false);
    const handleSelectTemplates = () => {
        setOpenTemplateSelector(true);
    }

    // Select Templates 
    const [selectedTemplates, setSelectedTemplates] = React.useState([]);
    const handleSelectedTemplate = (event) => {

        if (selectedTemplates.indexOf(event.target.value)==-1) {
            setSelectedTemplates([...selectedTemplates, event.target.value]); 
        } else {
            let filteredTemplates = selectedTemplates.filter( template => template !== event.target.value);
            setSelectedTemplates(filteredTemplates);
        }

    }

    // Handle Button to Create New Meeting && To close the Dialogue 
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {

        setCurrentEventName('');
        setCurrentEventDesc('');
        setCurrentEventDate('');
        setCurrentEventStartTime('');
        setCurrentEventEndTime('');
        setSelectedTemplates([]);
        setOpenTemplateSelector(false);
        setOpen(false);

    }


    return (  

      <>

        <h1>Host Event</h1>
        <h3>Scheduled Events</h3>


        <div className="list">
            <List>
                {
                current_events.length === 0 ? <p className="centering light">No events scheduled, use the Create New Event button to create some.</p> :  
                current_events.map( (event, index) => (
                    
                    <>
                    
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary={event.MeetingName}
                            secondary={`${event.StartTime} | Event Access Code: ${event.MeetingCode}`}
                        />

                        <ListItemSecondaryAction>
                            <IconButton>

                            <Link to={linkto+'&'+event.MeetingID+'&'+'host'} ><PlayCircleOutlineIcon color="primary"/></Link>
                            </IconButton>
                            <IconButton>
                                <DeleteIcon color="error" onClick={() => handleDeleteEvent(event)} />
                            </IconButton>
                        </ListItemSecondaryAction>

                    </ListItem>
                    <Divider />
                    </>
                ))}
            </List>
            
            <div className="centering">
                <Button variant="contained" color="primary" endIcon={<CreateIcon />} onClick={handleClickOpen} >
                    Create a new event
                </Button>
            </div>

        </div>
        
        <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'lg'}
        >

            <DialogTitle id="alert-dialog-title">Create an Event</DialogTitle>

            <DialogContent>

                <form className="form-margin-top">

                    <TextField 
                        font-size='12px'
                        id='outlined-textarea'
                        label='Event Name'
                        value={currentEventName}
                        placeholder='Enter the name of your event'
                        variant='outlined'
                        required
                        fullWidth="true"
                        onChange={handleCurrentEventNameTextField}
                        error={false}
                        className="input"
                        helperText={false ? 'Must be at least 4 Characters' : ' '}
                    />

                    <TextField 
                        font-size='12px'
                        id='outlined-textarea'
                        label='Event Description'
                        value={currentEventDesc}
                        placeholder='Enter a description of your event'
                        variant='outlined'
                        required
                        fullWidth="true"
                        onChange={handleCurrentEventDescTextField}
                        error={false}
                        className="input"
                        helperText={false ? 'Must be at least 4 Characters' : ' '}
                    />

                    <TextField
                        id="date"
                        label="Meeting Date"
                        type="date"
                        size="medium"
                        required
                        onChange={handleCurrentEventDateTextField}
                        defaultValue="2017-05-24"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />

                    <TextField
                        id="time"
                        label="Start"
                        type="time"
                        size="medium"
                        required
                        onChange={handleCurrentEventStartTimeTextField}
                        defaultValue="07:30"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 300, // 5 min
                        }}
                    />

                    <TextField
                        id="time"
                        label="End"
                        type="time"
                        size="medium"
                        required
                        onChange={handleCurrentEventEndTimeTextField}
                        defaultValue="07:30"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 300, // 5 min
                        }}
                    />

                    <div>
                        { openTemplateSelector ? 

                            available_templates.map( template => (
                                
                                <div className="vertical-align">
                                    <FormControlLabel
                                    control={<Checkbox 
                                        name="template_id"
                                        value={template[0]} 
                                        onChange={handleSelectedTemplate}
                                        />}
                                    label={template[1][0]}
                                    />
                                </div>

                            ))

                        : 
                        
                        <Button variant="contained" color='primary' onClick={handleSelectTemplates}>Select Templates</Button> 
                        
                        }
                    </div>

                </form>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleNewMeeting} color="primary">Save Meeting</Button>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
            </DialogActions>

        </Dialog>

      </>
    );
  
  }

  export default HostEventComponent;