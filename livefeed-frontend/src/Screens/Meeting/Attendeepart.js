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
import BuildIcon from '@material-ui/icons/Build';
import EditIcon from '@material-ui/icons/Edit';

const Attendeepart = ({templateset}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    // const [meetingtemplate, setMeetingtemplate] = React.useState(template);
    const [publishedQuestion,setPublishedQuestion] = React.useState([]);
    const [answer,setAnswer] = React.useState('');
    const [current,setCurrent] = React.useState([]);
    const [meetingtemplateset,setMeetingtemplate] = React.useState(templateset);



    const handleSend = () => {
        let filtered_events = meetingtemplateset.filter( event => event !== current);
        setMeetingtemplate(filtered_events); 
        handleCancel();
    }

    const handleCancel = () => {
        setModalisOpen(false);
        setAnswer('');
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