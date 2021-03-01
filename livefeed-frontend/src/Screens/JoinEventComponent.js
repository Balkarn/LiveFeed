import React, { useEffect/*, useState*/    } from "react";
import { Link } from 'react-router-dom';
import { TextField, Button, Checkbox } from '@material-ui/core';
import 'fontsource-roboto';

const JoinEventComponent = () => {

    // Event Access Code
    const [currentEventCode, setCurrentEventCode] = React.useState('');
    const [join,setJoin] = React.useState(false);

    const [error, setError] = React.useState(false);

    const handleCurrentEventCodeTextField = event => {
        setCurrentEventCode(event.target.value);
        setError(event.target.value.length != 8);
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
                        error={error}
                        className="input"
                        helperText={error ? 'Must be 8 Characters' : ' '}
                    />
                    <Link to="/meeting"><Button variant="contained" color="primary" fullWidth> Search </Button></Link>

                </div>
                
            </form>
        </div>
    );
}

export default JoinEventComponent;