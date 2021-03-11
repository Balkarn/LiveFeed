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
import Typography from '@material-ui/core/Typography';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SendIcon from '@material-ui/icons/Send';

const Hostpart = ({templateset}) => {
    const meetingtemplatset = templateset;

    return (
        <div>
            <div className="list">
                
                <List>
                    <Divider />
                    {meetingtemplatset.map(question => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                                <ListItem key={question.templateid}>
                                    <Typography/> {question.templatename} <br/>
                                    {question.questiontype} 
                                    <Typography/>

                                </ListItem>
                            <Divider/>
                        </div>
                    
                    ))}

                </List> 

            </div>

        </div>

    )

}

export default Hostpart;