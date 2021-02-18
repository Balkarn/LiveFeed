import React, { useEffect/*, useState*/    } from "react";
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

const HostEventComponent = () => {

    const [current_events, setEvent] = React.useState([...events]);

    // Delete Event 
    const handleDeleteEvent = (_event) => {
        let filtered_events = current_events.filter( event => event !== _event);
        setEvent(filtered_events); 
    }


    // Add new event -- SAVE BUTTON 
    const handleNewMeeting = () => {

        const _event = {
            event_name: currentEventName,
            event_time: currentEventTime,
            event_date: currentEventDate,
            event_access_code: makeid(8),
        };
        
        setEvent( current_events => [...current_events, _event]);

        setCurrentEventName('');
        setCurrentEventDesc('');
        setCurrentEventDate('');
        setCurrentEventTime('');
        setOpen(false);
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

    // Event Time
    const [currentEventTime, setCurrentEventTime] = React.useState('');
    const handleCurrentEventTimeTextField = event => {
        setCurrentEventTime(event.target.value);
    }

    // Templates to use 
    const [openTemplateSelector, setOpenTemplateSelector] = React.useState(false);
    const handleSelectTemplates = () => {
        setOpenTemplateSelector(true);
    }

    // Handle Button to Create New Meeting && To close the Dialogue 
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setOpenTemplateSelector(false);
    }

    return (
      <>
        <h1>Host Event</h1>
        <h3>Scheduled Events</h3>

        <div className="list">
            <List>
                {
                current_events.length === 0 ? <p className="centering light">No events scheduled, use the Create New Event button to create some.</p> :  
                current_events.map( event => (
                    <>
                    <Divider />
                    <ListItem>

                        <ListItemText
                            primary={event.event_name}
                            secondary={`${event.event_time} | ${event.event_date} | Event Access Code: ${event.event_access_code}`}
                        />

                        <ListItemSecondaryAction>
                            <IconButton>
                                <PlayCircleOutlineIcon color="primary"/>
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
                        variant='filled'
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
                        variant='filled'
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
                        label="Time"
                        type="time"
                        size="medium"
                        required
                        onChange={handleCurrentEventTimeTextField}
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

                            templates.map( template => (
                                
                                <div className="vertical-align">
                                    <FormControlLabel
                                    control={<Checkbox name="antoine" />}
                                    label={template.template_name}
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