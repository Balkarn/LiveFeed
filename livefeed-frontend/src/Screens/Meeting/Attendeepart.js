import React ,{ Component } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

class Attendeepart extends Component {

    constructor(props){
        super(props)
        this.state = {
            modalisOpen : false,
            username : '',
        }
    }

    handleUsernameChange = (event) => {
        this.setState({
            username : event.target.value
        })
    }


    render(){


        return (
            <div>
                {this.props.template.map(question => (
                    <div>
                    <p key = {question.id}>{question.name}</p>
                    </div>
                ))}



                <button onClick={()=>this.setState({modalisOpen : true})}
                    >Open modal</button>

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
                    }
                    >
                    <form>
                        <label>question</label>
                        <input type='text' 
                                value = {this.state.username}
                                onChange = {this.handleUsernameChange}/>
                        <p>{this.state.username}</p>
                    </form>
                    <button onClick = {()=>this.setState({modalisOpen : false})}>close modal</button>
                </Modal>
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