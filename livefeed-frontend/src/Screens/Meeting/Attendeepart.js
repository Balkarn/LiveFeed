import React ,{ Component } from 'react';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';


const Attendeepart = ({templateset}) => {
    const [modalisOpen, setModalisOpen] = React.useState(false);
    // const [meetingtemplate, setMeetingtemplate] = React.useState(template);
    const [publishedQuestion,setPublishedQuestion] = React.useState([]);
    const [answer,setAnswer] = React.useState('');
    const [current,setCurrent] = React.useState([]);
    const [meetingtemplateset,setMeetingtemplate] = React.useState(templateset);
    const [isanonymous,setIsanonymous] = React.useState(false);
    const [sendanonymous,setSendanonymous] = React.useState(false);
    var [multianswer,setMultianswer] = React.useState();

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

    const options = [
        { value: 'multichoice-option1', label: 'multichoice-option1' },
        { value: 'multichoice-option2', label: 'multichoice-option2' },
        { value: 'multichoice-option3', label: 'multichoice-option3' },
        { value: 'multichoice-option4', label: 'multichoice-option4' },
      ]

    const Ddlhandle = (e) => {
        setMultianswer = (Array.isArray(e)?e.map(x=>x.label):[]);
    }

    const renderSwitch = (param)=> {
        switch(param){
            case 'written':
                return (
                    <TextField
                        multiline
                        margin="dense"
                        id="name"
                        label="Post your answer here"
                        type="text"
                        fullWidth
                        onChange = {(event)=>setAnswer(event.target.value)}/>
                )
            case 'score':
                return (
                    <FormControl component="fieldset">
                        <RadioGroup name="Score" defaultValue="1" onChange={(event)=>{setAnswer(event.target.value)}}>
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                            <FormControlLabel value="2" control={<Radio />} label="2" />
                            <FormControlLabel value="3" control={<Radio />} label="3" />
                            <FormControlLabel value="4" control={<Radio />} label="4" />
                            <FormControlLabel value="5" control={<Radio />} label="5" />
                        </RadioGroup>
                    </FormControl> 
                )
            case 'multichoice':
                return (
                    <Select isMulti options={options} onChange={Ddlhandle}/>
                )
        }
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
                                    secondary = {question.questiontype}
                                    />
                                    <ListItemSecondaryAction>
                                        {}
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
                    fullWidth = 'sm'
                    height = '800'>
                <DialogTitle id="form-dialog-title">Answer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {current.questioncontent}
                    </DialogContentText>
                    {renderSwitch(current.questiontype)}  
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
        </div>

    )

}




export default Attendeepart;