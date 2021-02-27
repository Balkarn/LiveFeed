import React from 'react'



const QuestionList = () => {
    

    const template = [
        { id : 1 , name : 'Q1'},
        { id : 2 , name : 'Q2'},
    ]


    
    return (
        <div>
            {template.map(question => (
                <p key = {question.id}>{question.name}</p>
            ))}
            <input type = "text" id = "text" placeholder = "enter "/>
            <br />
            <button id = "submit">Save</button>
        </div>
    )
}

export default QuestionList;