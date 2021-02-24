import React, { useEffect/*, useState*/    } from "react";
import { TextField, Button } from '@material-ui/core';
import 'fontsource-roboto';
import List from '@material-ui/core/List';
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

const TemplateComponent = () => {

    const [open, setOpen] = React.useState(false);
    const [update,setUpdate] = React.useState(false);
    const [remove,setRemove] = React.useState(false);

    const [templateNames, setTemplateNames] = React.useState([]);
    const [templateQuestions, setTemplateQuestions] = React.useState([]);
  
    const [currentTemplateName, setCurrentTemplateName] = React.useState('')
    const [currentTemplateQuestions, setCurrentTemplateQuestions] = React.useState([]);
  
    useEffect(() => {
      setTemplateNames(["Sample Meeting Template", "Sample Lecture Template", "Sample Social Event Template"/*, 3,4,5,6,7,8,9,10,11,12,13,14,15,16*/]);
      setTemplateQuestions([[],[],[]]);
    }, []); // Only run once on mount
  
    //Function called whenever the name textfield is changed
    const handleTemplateNameTextfield = event => {
      var eventVal = event.target.value; //setting a state isn't synchronous so store value in a temp variable
      setCurrentTemplateName(eventVal);
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
      setCurrentTemplateQuestions([...currentTemplateQuestions, ""])
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
                {templateNames.map((item) => (
                  <div>
                  <ListItem>
                    <ListItemText
                      primary={`${item}`}
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
            <DialogTitle id="alert-dialog-title">{"Create A Template"}</DialogTitle>
            <DialogContent>
  
              <TextField
                font-size='16px'
                id='outlined-textarea'
                label='Template Title'
                value={currentTemplateName}
                placeholder='Name your template'
                variant='filled'
                required
                fullWidth="true"
                onChange={handleTemplateNameTextfield}
                error={false}
                className="input"
                helperText={false ? 'Must be at least 4 Characters' : ' '}
              />
  
              {currentTemplateQuestions.map((item) => (
                <TextField
                  font-size='16px'
                  id='outlined-textarea'
                  label='Question'
                  value={null}
                  placeholder='Name your template'
                  variant='outlined'
                  required
                  fullWidth="true"
                  onChange={null}
                  error={false}
                  className="input"
                  helperText={false ? 'Must be at least 4 Characters' : ' '}
                />
              ))}
  
            </DialogContent>
            
            <Button onClick={addQuestion} variant="contained" color="primary">
              Add Question
              </Button>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Done
              </Button>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }

  export default TemplateComponent;