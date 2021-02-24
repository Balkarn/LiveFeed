import React, { useEffect/*, useState*/    } from "react";
import { TextField, Button, Checkbox } from '@material-ui/core';
import 'fontsource-roboto';

const JoinEventComponent = () => {

    // Event Access Code
    const [currentEventCode, setCurrentEventCode] = React.useState('');
    const [join,setJoin] = React.useState(false);

    const handleCurrentEventCodeTextField = event => {
        setCurrentEventCode(event.target.value);
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
                        variant='filled'
                        required
                        size="small"
                        fullWidth="true"
                        onChange={handleCurrentEventCodeTextField}
                        error={false}
                        className="input"
                        helperText={false ? 'Must be 8 Characters' : ' '}
                    />
                    <Button variant="contained" color="primary" fullWidth> Search </Button>
                </div>
                
            </form>
        </div>
    );
}

export default JoinEventComponent;