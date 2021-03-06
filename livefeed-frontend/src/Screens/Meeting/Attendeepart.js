import React ,{ Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Attendeepart = ({templateset}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    // const [meetingtemplate, setMeetingtemplate] = React.useState(template);
    const [publishedQuestion,setPublishedQuestion] = React.useState([]);
    const [answer,setAnswer] = React.useState('');
    const [current,setCurrent] = React.useState([]);
    const [meetingtemplateset,setMeetingtemplate] = React.useState(templateset);
    const [isanonymous,setIsanonymous] = React.useState(false);
    const [sendanonymous,setSendanonymous] = React.useState(false);


    const handleSend = () => {
        let filtered_events = meetingtemplateset.filter( event => event !== current);
        setMeetingtemplate(filtered_events); 
        setSendanonymous(isanonymous);
        handleCancel();
    }

    const handleCancel = () => {
        setModalisOpen(false);
        setAnswer('');
        setIsanonymous(false);
    }

    return (
        <div>
            <div className="list">
                
                <List>
                    {meetingtemplateset.map(question => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                            <Divider /> 
                                <ListItem>
                                    <ListItemText
                                    primary={question.templatename}
                                    />
                                    <ListItemSecondaryAction>
                                    <IconButton>
                                        <EditIcon color="primary" onClick = {()=>{setModalisOpen(true);setCurrent(question)}}/>
                                    </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                        </div>
                    ))}
                </List> 
            </div>
            <Dialog open={modalisOpen} 
                    onClose={()=>setModalisOpen(false)} 
                    aria-labelledby="form-dialog-title"
                    fullWidth = 'xs'>
                <DialogTitle id="form-dialog-title">Answer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {current.questioncontent}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Post your answer here"
                        type="email"
                        fullWidth
                        onChange = {(event)=>setAnswer(event.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={isanonymous}
                            onChange={()=>setIsanonymous(true)}
                            name="anonymous"
                            color="primary"
                        />
                        }
                        label="anonymous"
                    />
                    <Button onClick={handleSend} 
                            color="primary">
                        Send
                    </Button>
                    <Button onClick={handleCancel} 
                            color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>  
            <p>{answer}</p>
        </div>

    )

}




export default Attendeepart;