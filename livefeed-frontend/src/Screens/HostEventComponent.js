import React, { useEffect/*, useState*/    } from "react";
import { TextField, Button } from '@material-ui/core';
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
import AlarmIcon from '@material-ui/icons/Alarm';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CreateIcon from '@material-ui/icons/Create';

import meetings from '../test-data/meetings';

const HostEventComponent = () => {

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const [currentEventName, setCurrentEventName] = React.useState('');
    const handleCurrentEventNameTextField = event => {
        var eventName = event.target.value;
        setCurrentEventName(eventName);
    }

    return (
      <>
        <h1>Host Event</h1>
        <h3>Scheduled Meetings</h3>

        <div className="list">
            <List>
                {meetings.map( meeting => (
                    <>
                    <Divider />
                    <ListItem>

                        <ListItemText
                            primary={meeting.meeting_name}
                            secondary={`${meeting.meeting_time} | ${meeting.meeting_date}`}
                        />

                        <ListItemSecondaryAction>
                            <IconButton>
                                <PlayCircleOutlineIcon color="primary"/>
                            </IconButton>
                            <IconButton>
                                <DeleteIcon color="error"/>
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
                        font-size='16px'
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
                        font-size='16px'
                        id='outlined-textarea'
                        label='Event Description'
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
                        id="date"
                        label="Meeting Date"
                        type="date"
                        size="medium"
                        required
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
                        defaultValue="07:30"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 300, // 5 min
                        }}

                    />

                    <div>
                        <Button variant="contained" color='primary'>Select Templates</Button>
                    </div>

                </form>

                    

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">Done</Button>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
            </DialogActions>

        </Dialog>

      </>
    );
  
  }

  export default HostEventComponent;