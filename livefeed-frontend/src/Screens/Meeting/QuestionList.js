import React from 'react'
 import Attendeepart from './Attendeepart'
 import Hostpart from './Hostpart'


const QuestionList = ({role,template1}) => {
    
    const [postQuestion,setPostQuestion] = React.useState([]);
    const [allQuestion,setAllQuestion] = React.useState([]);

    const template = [
        { id : 1 , name : 'Q1',content : 'content of Q1',type : 'Written Answer'},
        { id : 2 , name : 'Q2',content : 'content of Q2',type : 'Score 1-5'},
        { id : 4 , name : 'Q3',content : 'content of Q3',type : 'Multiple Choice'},
    ]// question published

    const PublishNewQuestion = () => {

    }

    // if (role === 'attendee'){
    //     return (
    //         <div>
    //             <Attendeepart template = {template}/>
    //             <p>
    //                 The host will send in a template soon. Thank you for your patience.
    //             </p>
    //             <button style={{color : 'red'}}>leave</button>
    //         </div>
    //     )
    // }else{
    //     return (
    //         <div>
    //             <Hostpart template = {template}/>

    //         </div>
    //     )
    // }


    return (
        <div>
            <Hostpart template = {template}/>
        </div>
    )

}

export default QuestionList;