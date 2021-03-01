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

const Attendeepart = ({template}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    // const [meetingtemplate, setMeetingtemplate] = React.useState(template);
    const [publishedQuestion,setPublishedQuestion] = React.useState([]);
    const [answer,setAnswer] = React.useState('');
    const meetingtemplate = template;

    return (
        <div>
            <div className="list">
                
                <List>
                    {meetingtemplate.map(question => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                            <Divider /> 
                                <ListItem>
                                    <ListItemText
                                    primary={question.name}
                                    />
                                    <ListItemSecondaryAction>
                                    <IconButton>
                                        <BuildIcon color="primary" onClick = {()=>setModalisOpen(true)}/>
                                    </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            <Divider/>
                            <Dialog open={modalisOpen} 
                                    onClose={()=>setModalisOpen(false)} 
                                    aria-labelledby="form-dialog-title"
                                    fullWidth = 'xs'>
                                <DialogTitle id="form-dialog-title">Answer</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {question.content}
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
                                    <Button onClick={()=>setModalisOpen(false)} color="primary">
                                        Send
                                    </Button>
                                    <Button onClick={()=>{
                                        setModalisOpen(false)
                                        setAnswer('')}} color="primary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>  
                        
                        </div>
                    
                    ))}
                </List> 
            </div>
        </div>

    )

}

export default Attendeepart;