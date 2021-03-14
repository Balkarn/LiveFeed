import React ,{ Component, useEffect } from 'react';
import { Link ,useParams} from 'react-router-dom';
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
import FormLabel from '@material-ui/core/FormLabel';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Select from 'react-select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';


const Attendeepart = ({templateset}) => {

    let {id} = useParams();
    let url_details = id.split('&');

    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 190,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      }));

      const classes = useStyles();

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


    const handleSend = (questionID, question) => {
        
        var data = {
            function: 'addtemplatefeedback',
            arguments: [
                questionID, 
                url_details[3],
                url_details[1],
                answer
            ]
        }

        setModalisOpen(false);

        axios.post(php_url, qs.stringify(data))
        .then(res => {
           console.log(res.data);
        }).catch(err => console.log(err));

        deleteFromList(question);

    }

    const deleteFromList = (question) => {
        var temp = [...templateQuestions];
        var index = temp.indexOf(question);
        if (index !== -1) {
            temp.splice(index, 1);
            setTemplateQuestions(temp);
        }
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
                        questionID: question[0],
                        questiontype: question[1][1],
                        question: question[1][0]
                    }

                    console.log(question_obj);

                    setTemplateQuestions(templateQuestions => templateQuestions.concat(question_obj));

                } else if (question[1][1] === "multiple") {
                
                    let question_obj = {
                        questionID: question[0],
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
                        questionID: question[0],
                        questiontype: question[1][1],
                        question: question[1][0],
                        minRating: question[1][2].MinRating,
                        maxRating: question[1][2].MaxRating,
                    }

                    console.log(question_obj);

                    setTemplateQuestions(templateQuestions => templateQuestions.concat(question_obj));

                }
                
            })


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


    const radioHandleChange = (event) => {
        setAnswer(event.target.value);
    }

    const handleChange = (event, newValue) => {
        setAnswer(newValue);
      };

    const renderSwitch = (param) => {
        
        switch(param.questiontype){

            case 'open':
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
            case 'rating':

                const scores = [
                    {value: param.minRating.toString(),label: param.minRating.toString()},
                    {value: ((param.maxRating-param.minRating)/4+param.minRating).toString(),label: ((param.maxRating-param.minRating)/4+param.minRating).toString()},
                    {value: ((param.maxRating-param.minRating)*2/4+param.minRating).toString(),label: ((param.maxRating-param.minRating)*2/4+param.minRating).toString()},
                    {value: ((param.maxRating-param.minRating)*3/4+param.minRating).toString(),label: ((param.maxRating-param.minRating)*3/4+param.minRating).toString()},
                    {value: param.maxRating.toString(),label: param.maxRating.toString()},
                  ];
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
                        defaultValue={param.minRating}
                        aria-labelledby="discrete-slider-custom"
                        step={1}
                        max = {param.maxRating}
                        min = {param.minRating}
                        valueLabelDisplay="auto"
                        onChange = {handleChange}
                        marks={scores}
                    />
                )
            case 'multiple':
                const options_ = [
                    { value: param.optionA, label: 'option1' },
                    { value: param.optionB, label: 'option2' },
                    { value: param.optionC, label: 'option3' },
                    { value: param.optionD, label: 'option4' },
                  ];

                return (
                    <FormControl component="fieldset">
                    <FormLabel component="legend">Select an option</FormLabel>
                    <RadioGroup>
                        <FormControlLabel value={param.optionA} control={<Radio />} onChange={radioHandleChange} label={param.optionA} />
                        <FormControlLabel value={param.optionB} control={<Radio />} onChange={radioHandleChange} label={param.optionB} />
                        <FormControlLabel value={param.optionC} control={<Radio />} onChange={radioHandleChange} label={param.optionC} />
                        <FormControlLabel value={param.optionD} control={<Radio />} onChange={radioHandleChange} label={param.optionD} />
                    </RadioGroup>
                    </FormControl>
                )
        }
    }

    const dosetAnswer = (param) => {
        switch (param.questiontype) {
            case 'open':
                setAnswer("")
                break
            case 'rating':
                setAnswer(param.minRating)
                break
            case 'multiple':
                setAnswer(param.optionA)
                break

        }
    }

    return (

        templateQuestions.length === 0 ? <p>No Questions...</p>
        :
        <div>
            <div className="list3">
                
                <List>
                    {templateQuestions.map( (question,index) => (
                        <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                            <Divider /> 
                                <ListItem key={index}>
                                    <ListItemText
                                    primary={question.question}
                                    secondary = {question.questiontype}
                                    />
                                    <ListItemSecondaryAction>
                                    <IconButton>
                                        <EditIcon color="primary" onClick = {()=>{setModalisOpen(true);setCurrent(question);dosetAnswer(question)}}/>
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
                        {current.question}  
                    </DialogContentText>
                    {renderSwitch(current)} 
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
                    <Button onClick={() => handleSend(current.questionID, current)} 
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