import React, { useEffect/*, useState*/    } from "react";
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import 'fontsource-roboto';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';
import '../App.css';

const TemplateComponent = (props) => {

    const php_url = "http://localhost:80/server/php/index.php";
    var qs = require('qs');

    const [open, setOpen] = React.useState(false);
    const [creatingQ, setCreatingQ] = React.useState(false);
    const [update,setUpdate] = React.useState(false);
    const [remove,setRemove] = React.useState(false);
    const [templateNames, setTemplateNames] = React.useState([]); //This stores the names of all the templates
    const [templateQuestions, setTemplateQuestions] = React.useState([]); //This stores the question details of all the questions of all the templates in an array of arrays of arrays
    const [currentTemplateName, setCurrentTemplateName] = React.useState('')
    const [currentTemplateQuestions, setCurrentTemplateQuestions] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState('');
    const [questionTypeValue, setQuestionTypeValue] = React.useState('written');
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const [templates, setTemplates] = React.useState([]);

    const [sliderValue, setSliderValue] = React.useState([1, 5]);
    const [option1, setOption1Value] = React.useState("");
    const [option2, setOption2Value] = React.useState("");
    const [option3, setOption3Value] = React.useState("");
    const [option4, setOption4Value] = React.useState("");

    // Get Templates to list for user
    const getUserTemplates = () => {

      var data = {
        function: "getusertemplates",
        arguments: [
          props.userID,
        ] 
      }

      axios.post(php_url, qs.stringify(data))
        .then(res => {
            // Converting Template Response into Template
            var templateData = Object.keys(res.data.result).map((key) => [Number(key), res.data.result[key]]);
            setTemplates(templateData);
            console.log(templates);
        }).catch(err => console.log(err));
    }

    const handleOption1 = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setOption1Value(eventVal);
    }

    const handleOption2 = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setOption2Value(eventVal);
    }

    const handleOption3 = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setOption3Value(eventVal);
    }

    const handleOption4 = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setOption4Value(eventVal);
    }

    const handleRadioChange = (event) => {
      setQuestionTypeValue(event.target.value);
    };
  
    useEffect(() => {
      setCreatingQ(false)
      getUserTemplates();
      setTemplateNames(["Sample Meeting Template", "Sample Lecture Template", "Sample Social Event Template"/*, 3,4,5,6,7,8,9,10,11,12,13,14,15,16*/]);
      setTemplateQuestions([[],[],[]]);
    }, []); // Only run once on mount
  
    //Function called whenever the name textfield is changed
    const handleTemplateNameTextfield = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setCurrentTemplateName(eventVal);
    }

    const handleQuestionTextfield = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setCurrentQuestion(eventVal);
    }
  
    const handleClickOpen = () => {
      setCurrentTemplateName("")
      setCurrentTemplateQuestions([]);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleUpdate = () =>{
      //show template information
      return 
      setUpdate(true);
    }

    const handleCloseU = () => {
      setUpdate(false);
    }

    const handleRemove = () =>{
      //remove corresponding template from database
      setRemove(true);
    }

    const handleCloseR = () => {
      setUpdate(false);
    }


    const addQuestion = () => {
      setActiveStep(0);
      setCreatingQ(true);
      setCurrentQuestion('');
      setQuestionTypeValue("written");
      setOption1Value('');
      setOption2Value('');
      setOption3Value('');
      setOption4Value('');
      setSliderValue([1,5]);
    };

    const createQuestion = () => {
      //  [[question, questionType, options1..4, ratingmin..max], [...]]
      var tempArray = [];
      tempArray.push(currentQuestion);
      switch (questionTypeValue) {
        case "written":
          tempArray.push("open");
          break;
        case "score":
          tempArray.push("rating");
          tempArray.push(sliderValue[0]);
          tempArray.push(sliderValue[1]);
          break;
        case "multichoice":
          tempArray.push("multiple");
          tempArray.push(option1);
          tempArray.push(option2);
          tempArray.push(option3);
          tempArray.push(option4);
          break;
      }
      setCurrentTemplateQuestions([...currentTemplateQuestions, tempArray]);
      setCreatingQ(false);
    };

    const dontCreateQuestion = () => {
      setCreatingQ(false);
    }

    const removeQuestion = () => {
      var tempArray = currentTemplateQuestions
      if (tempArray.length > 0) {
        tempArray.splice(tempArray.length-1,1);
      }
      setCurrentTemplateQuestions([...tempArray]);
    };

    async function addTemplate() {
      setOpen(false);
      setTemplateNames([...templateNames, currentTemplateName]);
      setTemplateQuestions([...templateQuestions,currentTemplateQuestions]);

      console.log(currentTemplateName);
      console.log(currentTemplateQuestions);

      //templateNames is [name1, name2, name3 ...]
      //templateQuestions is [[[question1 name, question 1 type, (if applicable options..)],[question2 details],...], template2's questions]
      //here connect to the backend

      var data = {
        function: "addtemplate",
        arguments: [
          currentTemplateName,
          props.userID,
          currentTemplateQuestions
        ] 
      }

      const getData = await axios.post(php_url, qs.stringify(data))
        .then(res => {
            console.log(res);
            if (res.data.error) {
                console.log(res.data.error);
            }
        }).catch(err => console.log(err));

        let res = getData;

        getUserTemplates();

    };

    function getSteps() {
      return ['Select Question Type', 'Question Title', 'Question Details'];
    }

    const handleSliderChange = (event, newValue) => {
      setSliderValue(newValue);
    };

    function getStepContent(step) {
      switch (step) {
        case 0:
          return (
            <FormControl component="fieldset">
              <RadioGroup name="Question Type" value={questionTypeValue} onChange={handleRadioChange}>
                <FormControlLabel value="written" control={<Radio />} label="Written Answer" />
                <FormControlLabel value="score" control={<Radio />} label="Numerical Score Slider" />
                <FormControlLabel value="multichoice" control={<Radio />} label="Multiple Choice" />
              </RadioGroup>
            </FormControl> 
          );
        case 1:
          return (
            <TextField
              font-size='16px'
              id='outlined-textarea'
              label='Question'
              value={currentQuestion}
              placeholder='Enter Question Here'
              variant='outlined'
              required
              fullWidth="true"
              onChange={handleQuestionTextfield}
              error={false}
              className="input"
              helperText={false ? 'Must be at least 4 Characters' : ' '}
            />
          );
        case 2:
          switch (questionTypeValue) {
            case "written":
              return <Typography>Not applicable for written questions.</Typography>;
            case "score":
              return (
                <div>
                  {"Select the minimum and maximum values for this question"}
                  <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    max={10}
                    min={-10}
                    marks={[{value: -10, label:-10},{value:10,label:10},{value:0,label:0}]}
                    valueLabelDisplay="on"
                  />
                </div>
              );
            case "multichoice":
              return (
                <div className="options">
                  {"Enter the option descriptions for the multiple choice question"}
                  <div className="textfield">
                  <TextField
                    font-size='16px'
                    label='Option 1'
                    value={option1}
                    placeholder='Enter Option 1 Here'
                    variant='outlined'
                    required
                    fullWidth="true"
                    onChange={handleOption1}
                  />
                  </div>
                  <div className="textfield">
                  <TextField
                    font-size='16px'
                    label='Option 2'
                    value={option2}
                    placeholder='Enter Option 2 Here'
                    variant='outlined'
                    required
                    fullWidth="true"
                    onChange={handleOption2}
                  />
                  </div>
                  <div className="textfield">
                  <TextField
                    font-size='16px'
                    label='Option 3'
                    value={option3}
                    placeholder='Enter Option 3 Here'
                    variant='outlined'
                    required
                    fullWidth="true"
                    onChange={handleOption3}
                  />
                  </div>
                  <div className="textfield">
                  <TextField
                    font-size='16px'
                    label='Option 4'
                    value={option4}
                    placeholder='Enter Option 4 Here'
                    variant='outlined'
                    required
                    fullWidth="true"
                    onChange={handleOption4}
                  />
                  </div>
                </div>
              );
          }
        default:
          return 'Unknown step';
      }
    }

    const Next = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const Prev = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const Reset = () => {
      setActiveStep(0);
      setCurrentQuestion('');
      setQuestionTypeValue("written");
      setOption1Value('');
      setOption2Value('');
      setOption3Value('');
      setOption4Value('');
      setSliderValue([1, 5]);
    };
    
    if (false) {
    } else {
      return (
        <div>
          <div className="centering">
            <h1>Your Templates:</h1>
          </div>

          <div className="list">
            <List>
              <Divider /> 
                {templates.map((_template) => (
                  <div>
                  <ListItem>
                    <ListItemText
                      primary={`${_template[1][0]}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <BuildIcon color="primary" />
                      </IconButton>
                      <IconButton>
                        <DeleteIcon color="secondary" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider/>
                  </div>
                ))}
            </List> 
          </div>
          <div className="centering">
            <Button variant="contained" color="primary" endIcon={<CreateIcon />} onClick={handleClickOpen}>
              Create New Template
            </Button>
          </div>
          <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
          >
            {!creatingQ ? 
              <div>
              <DialogTitle id="alert-dialog-title">{"Create A Template"}</DialogTitle>
              <DialogContent>
    
                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Template Title'
                  value={currentTemplateName}
                  placeholder='Name your template'
                  variant='outlined'
                  required
                  fullWidth="true"
                  onChange={handleTemplateNameTextfield}
                  error={false}
                  className="input"
                  helperText={false ? 'Must be at least 4 Characters' : ' '}
                />
                <List>
                  <Divider />
                  {currentTemplateQuestions.map((item) => (
                    <div>
                      <ListItem>
                        <ListItemText
                          primary={`${item[0]}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton>
                            <BuildIcon color="primary" />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon color="secondary" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
                
                <Button onClick={addQuestion} variant="text" color="primary">
                  Add Question
                </Button>
                <Button onClick={removeQuestion} variant="text" color="secondary">
                  Remove Question
                </Button>
              </DialogContent>    
              <DialogActions>
                <Button onClick={addTemplate} color="primary">
                  Done
                </Button>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
              </div>
            :
              <div>
                <DialogTitle id="alert-dialog-title">{"Create a Question"}</DialogTitle>
                <DialogContent>

                  <div>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                          <StepContent>
                            <Typography>{getStepContent(index)}</Typography>
                            <div >
                              <div>
                                <Button
                                  disabled={activeStep === 0}
                                  onClick={Prev}
                                >
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={Next}
                                >
                                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                              </div>
                            </div>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </div>
                </DialogContent>
                <DialogActions>
                  {activeStep === steps.length && (
                    <div>
                      <Button onClick={Reset} >
                        Reset
                      </Button>
                      <Button onClick={createQuestion} color="primary">
                        Create Question
                      </Button>
                    </div>
                  )}

                  <Button onClick={dontCreateQuestion} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </div>
            }
            
          </Dialog>
        </div>
      );
    }
}

export default TemplateComponent;