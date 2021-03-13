import React ,{ Component, useEffect } from 'react';
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
<<<<<<< Updated upstream
import Slider from '@material-ui/core/Slider';

=======
import axios from 'axios';
>>>>>>> Stashed changes




const Attendeepart = ({templateset}) => {

    var qs = require('qs');
    const php_url = "http://localhost:80/server/php/index.php";

    const [modalisOpen, setModalisOpen] = React.useState(false);
    // const [meetingtemplate, setMeetingtemplate] = React.useState(template);
    const [publishedQuestion,setPublishedQuestion] = React.useState([]);
    const [answer,setAnswer] = React.useState('');
    const [current,setCurrent] = React.useState([]);
    const [meetingtemplateset,setMeetingtemplate] = React.useState([]);
    const [isanonymous,setIsanonymous] = React.useState(false);
    const [sendanonymous,setSendanonymous] = React.useState(false);
    var [multianswer,setMultianswer] = React.useState();
    const [maxvalue,setMaxvalue] = React.useState(9);
    const [minvalue,setMinvalue] = React.useState(1);

    const [templateQuestions, setTemplateQuestions] = React.useState([]);


    const handleSend = () => {
        let filtered_events = meetingtemplateset.filter( event => event !== current);
        setMeetingtemplate(filtered_events); 
        setSendanonymous(isanonymous);
        handleCancel();
    }

    const getTemplateQuestions = () => {

        // Send data of new event to backend 
        var data = {
            function: 'gettemplatequestions',
            arguments: [
                templateset[0][0].TemplateID,
            ]
        };
        
        axios.post(php_url, qs.stringify(data))
        .then(res => {
            
            var templateQuestionsArray = Object.keys(res.data.result).map((key) => [Number(key), res.data.result[key]]);

            templateQuestionsArray.map( question => {

                if (question[1][1] === "open") {

                    let question_obj = {
                        questiontype: question[1][1],
                        question: question[1][0]
                    }

                    console.log(question_obj);

                    setTemplateQuestions(templateQuestions => templateQuestions.concat(question_obj));

                } else if (question[1][1] === "multiple") {
                
                    let question_obj = {
                        questiontype: question[1][1],
                        question: question[1][0],
                        optionA: question[1][2].OptionA,
                        optionB: question[1][2].OptionB, 
                        optionC: question[1][2].OptionC,
                        optionD: question[1][2].OptionD,
                    }

                    console.log(question_obj);

                    setTemplateQuestions(templateQuestions => templateQuestions.concat(question_obj));

                } else if (question[1][1] === "rating" ) {
                
                    let question_obj = {
                        questiontype: question[1][1],
                        question: question[1][0],
                        minRating: question[1][2].MinRating,
                        maxRating: question[1][2].MaxRating,
                    }

                    console.log(question_obj);

                    setTemplateQuestions(templateQuestions => templateQuestions.concat(question_obj));

                }
                
            })

            console.log(templateQuestions);

            if (res.data.error) {
                console.log(res.data.error);
            }
        }).catch(err => console.log(err));

    }


    useEffect(() => {
        
        getTemplateQuestions();
        
    }, [])


    const handleCancel = () => {
        setModalisOpen(false);
        setAnswer('');
        setIsanonymous(false);
    }

    const options = [
        { value: 'multichoice-option1', label: 'option1' },
        { value: 'multichoice-option2', label: 'option2' },
        { value: 'multichoice-option3', label: 'option3' },
        { value: 'multichoice-option4', label: 'option4' },
      ]

      const scores = [
        {value: minvalue.toString(),label: minvalue.toString()},
        {value: ((maxvalue-minvalue)/4+minvalue).toString(),label: ((maxvalue-minvalue)/4+minvalue).toString()},
        {value: ((maxvalue-minvalue)*2/4+minvalue).toString(),label: ((maxvalue-minvalue)*2/4+minvalue).toString()},
        {value: ((maxvalue-minvalue)*3/4+minvalue).toString(),label: ((maxvalue-minvalue)*3/4+minvalue).toString()},
        {value: maxvalue.toString(),label: maxvalue.toString()},
      ];

    const Ddlhandle = (e) => {
        setMultianswer(Array.isArray(e)?e.map(x=>x.label):[]);
    }

    const handleChange = (event, newValue) => {
        setAnswer(newValue);
      };

    const renderSwitch = (param) => {
        switch(param){
            case 'Written Question':
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
            case 'Numerical Rating':
                return (
                    // <FormControl component="fieldset">
                    //     <RadioGroup name="Score"  defaultValue={'1'} onChange={(event)=>{setAnswer(event.target.value)}}>
                    //         {scores.map(option => (
                    //             <div>
                    //             <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
                    //             </div>
                    //         ))}
                    //     </RadioGroup>
                    // </FormControl> 
                    <Slider
                        defaultValue={minvalue}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        max = {maxvalue}
                        min = {minvalue}
                        valueLabelDisplay="auto"
                        onChange = {handleChange}
                        marks={scores}
                    />
                )
            case 'Multiple Choice':
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
                                <ListItem key={question.questionid}>
                                    <ListItemText
                                    primary={question.templatename}
                                    secondary = {question.questiontype}
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
                    fullWidth = 'sm'
                    // style = {{height: 600}}
                    >
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
                            name="Anonymous?"
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