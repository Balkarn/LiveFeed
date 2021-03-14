import React, { useEffect/*, useState*/    } from "react";
import { Link, useHistory } from 'react-router-dom';
import { TextField, Button, Checkbox } from '@material-ui/core';
import 'fontsource-roboto';
import axios from 'axios';

const JoinEventComponent = (props) => {

    // Server URL details
    const php_url = "http://localhost:80/server/php/index.php";
    var qs = require('qs');
    const history = useHistory();

    // Event Access Code
    const [currentEventCode, setCurrentEventCode] = React.useState('');
    const [join,setJoin] = React.useState(false);
    const [userid,setUserid] = React.useState(13);//id of the user
    const [linkto,setLinkto] = React.useState('meeting/'+userid);//make sure user will be attendee in meeting screen
    

    const handleCurrentEventCodeTextField = event => {
        setCurrentEventCode(event.target.value);
    }

    const enterMeeting = () => {
        
        // Send data of new event to backend 
        var data = {
            function: 'getmeeting',
            arguments: [
                currentEventCode
            ]
        };
        
        axios.post(php_url, qs.stringify(data))
        .then(res => {
            console.log(res.data.result);
            history.push('/meeting/'+res.data.result.HostID+'&'+res.data.result.MeetingID+'&attendee&'+props.userID);
            if (res.data.error) {
                console.log(res.data.error);
            }
        }).catch(err => console.log(err));

    }

    return (
        <div className="centering">
            <h1>Join an Event</h1>
            <p className="light">To join an event, simply enter the Event Access Code below.</p>
            <form>
                <div>
                    <TextField 
                        font-size='16px'
                        id='outlined-textarea'
                        label='Event Access Code'
                        value={currentEventCode}
                        placeholder='Enter the Event Access Code'
                        variant='outlined'
                        required
                        size="medium"
                        fullWidth="true"
                        onChange={handleCurrentEventCodeTextField}
                        className="input"
                    />
                    <div className="button">
                        <Link>
                            <Button variant="contained" color="primary" fullWidth onClick={enterMeeting}> Search </Button>
                        </Link>
                    </div>
                </div>
                
            </form>
        </div>
    );
}

export default JoinEventComponent;