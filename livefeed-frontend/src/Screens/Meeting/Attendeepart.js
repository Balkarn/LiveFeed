import React ,{ Component } from 'react'
import Modal from 'react-modal'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';


Modal.setAppElement('#root')

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

class Attendeepart extends Component {

    constructor(props){
        super(props)
        this.state = {
            modalisOpen : false,
            username : '',
            comment : '',
            topic : '',
            test : ''
        }
    }

    handleUsernameChange = event => {
        this.setState({
            username : event.target.value
        })
    }

    handleCommentsChange = event => {
        this.setState({
            comment : event.target.value
        })
    }

    handleTopicChange = event => {
        this.setState({
            topic : event.target.value
        })
    }

    handleSubmit = event =>{
        alert(`${this.state.username} ${this.state.topic} ${this.state.comment}`)
        this.setState({
            test : 'OK'
        })
    }


    render(){


        return (
            <div>
                {this.props.template.map(question => (
                    <div>
                    {/* <p key = {question.id}>{question.name}</p> */}
                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem button onClick={()=>this.setState({modalisOpen : true})}>
                        <ListItemText primary={question.name} />
                        </ListItem>
                    </List>
                    </div>
                ))}
                {/* <button onClick={()=>this.setState({modalisOpen : true})}>
                    Open Modal
                </button> */}

                <Modal isOpen = {this.state.modalisOpen}
                    shouldCloseOnOverlayClick = {false} 
                    onRequestClose = {()=>this.setState({modalisOpen : false})}
                    style = {
                        {
                            overlay: {
                                backgroundColor : 'grey'
                            },
                            content: {
                                color: 'orange'
                            }
                        }
                    }>

                    <form onSubmit = {this.handleSubmit}>
                        <div>
                            <label>question</label>
                            <input type='text' 
                                    value = {this.state.username}
                                    onChange = {this.handleUsernameChange}/>
                            <p>{this.state.username}</p>
                        </div>

                        <div>
                            <label>Comments</label>
                            <textarea value = {this.state.comment}
                                      onChange = {this.handleCommentsChange}/>
                             <p>{this.state.comment}</p>
                        </div>

                        <div>
                            <label>Topic</label>
                            <select value = {this.state.topic}
                                    onChange = {this.handleTopicChange}>
                                <option value = '1'>1</option>
                                <option value = '2'>2</option>
                                <option value = '3'>3</option>
                            </select>
                             <p>{this.state.comment}</p>
                        </div>

                        <button type = 'submit'
                            onClick = {()=>this.setState({modalisOpen : false})}>
                        Submit
                    </button>
                    </form>
                    
                    

                    <button onClick = {()=>this.setState({modalisOpen : false})}>
                        close modal
                    </button>
                </Modal>
                <p>{this.state.test}</p>
            </div>

        )
    }
}

export default Attendeepart






// const Hostpart = ({template}) => {
    
//     const [modalisOpen,setModalisOpen] = React.useState(false);

//     var state = {
//         modalisOpen : false,
//         username : ''
//     }

//     const 

//     return (
//         <div>
//             {template.map(question => (
//                 <div>
//                 <p key = {question.id}>{question.name}</p>
//                 </div>
//             ))}
//             <button onClick={()=> setModalisOpen(true)}
//                     >Open modal</button>

//             <Modal isOpen = {modalisOpen}
//                    shouldCloseOnOverlayClick = {false} 
//                    onRequestClose = {()=>setModalisOpen(false)}
//                    style = {
//                        {
//                            overlay: {
//                                backgroundColor : 'grey'
//                            },
//                            content: {
//                                color: 'orange'
//                            }
//                        }
//                    }
//                    >
//                 <form>
//                    <label>question</label>
//                    <input type='text' 
//                           value = {state.username}
//                           onChange = {}/>
//                 </form>
//                 <button onClick = {()=>setModalisOpen(false)}>close modal</button>
//             </Modal>
//         </div>




//     )
// }

// export default Hostpart;