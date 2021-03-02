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
import BuildIcon from '@material-ui/icons/Build';

const Hostpart = ({templateset}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    const [send,setSend] = React.useState(false);
    const meetingtemplatset = templateset;

    function handleRemove (id) {

    }


    return (
        <div>
            <div className="list">
                
                <List>
                    {meetingtemplatset.map(question => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                            <Divider /> 
                                <ListItem>
                                    <ListItemText
                                    primary={question.templatename}
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
                                <DialogTitle id="form-dialog-title">Send?</DialogTitle>
                                <DialogContent>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={()=>{setModalisOpen(false); setSend(true)}} color="primary">
                                        Send
                                    </Button>
                                    <Button onClick={()=>setModalisOpen(false)} color="primary">
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

export default Hostpart;