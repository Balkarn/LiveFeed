import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SendIcon from '@material-ui/icons/Send';

const Hostpart = ({templateset}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    const [graphisOpen,setGraphisOpen] = React.useState(false);
    const [send,setSend] = React.useState(false);
    const [templatesend,setTemplatesend] = React.useState([]);
    const meetingtemplatset = templateset;

    const [senttemplates,setSenttemplates] = React.useState([]);
    const [current,setCurrent] = React.useState([]);

    return (
        <div>
            <div className="list">
                
                <List>
                    {meetingtemplatset.map(question => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                            <Divider /> 
                                <ListItem key={question.templateid}>
                                    <ListItemText
                                    primary={question.templatename}
                                    />
                                    <ListItemSecondaryAction>
                                    {senttemplates.includes(question) ? <IconButton>
                                        <AssessmentOutlinedIcon color="primary" onClick = {()=>{setGraphisOpen(true);
                                                                                  }}/>
                                    </IconButton> : <IconButton>
                                        <SendIcon color="primary" onClick = {()=>{setModalisOpen(true);
                                                                                    setCurrent(question)
                                                                                  }}/>
                                    </IconButton>}
                                    
                                    </ListItemSecondaryAction>
                                </ListItem>
                            <Divider/>
                        </div>
                    
                    ))}
                </List> 
                <Dialog open={modalisOpen} 
                        onClose={()=>setModalisOpen(false)} 
                        aria-labelledby="form-dialog-title"
                        fullWidth = 'xs'>
                    <DialogTitle id="form-dialog-title">Send?</DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{setModalisOpen(false);
                                                setSend(true);
                                                setTemplatesend(current);
                                                senttemplates.push(current);
                                        }} 
                                color="primary">
                            Send
                        </Button>
                        <Button onClick={()=>setModalisOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>

                </Dialog>  
                <Dialog open={graphisOpen} 
                        onClose={()=>setGraphisOpen(false)} 
                        aria-labelledby="form-dialog-title"
                        fullWidth = 'xs'>
                    <DialogTitle id="form-dialog-title">Graph</DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setGraphisOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>  
            </div>
        </div>

    )

}

export default Hostpart;