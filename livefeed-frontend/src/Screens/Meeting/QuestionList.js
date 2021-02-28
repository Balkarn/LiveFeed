import React from 'react'
 import Attendeepart from './Attendeepart'
 import Hostpart from './Hostpart'


const QuestionList = ({role,template1}) => {
    
    const [postQuestion,setPostQuestion] = React.useState([]);
    const [allQuestion,setAllQuestion] = React.useState([]);

    const template = [
        { id : 1 , name : 'Q1'},
        { id : 2 , name : 'Q2'},
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
            <Attendeepart template = {template}/>
            <p>
                The host will send in a template soon. Thank you for your patience.
            </p>
            <button style={{color : 'red'}}>leave</button>
        </div>
    )

}

export default QuestionList;