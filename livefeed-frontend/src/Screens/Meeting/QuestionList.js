import React from 'react'
 import Attendeepart from './Attendeepart'
 import Hostpart from './Hostpart'


const QuestionList = ({role,templateset}) => {
    
    const [postQuestion,setPostQuestion] = React.useState([]);
    const [allQuestion,setAllQuestion] = React.useState([]);

    

    const PublishNewQuestion = () => {

    }

    if (role === 'attendee'){
        return (
            <div>
                <Attendeepart templateset = {templateset}/>
            </div>
        )
    }else{
        return (
            <div>
                <Hostpart /*templateset = {templateset}*//>
            </div>
        )
    }
    
}

export default QuestionList;