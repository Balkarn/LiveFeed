import React from 'react'



const Hostpart = ({template}) => {
    

    
    return (
        <div>
            {template.map(question => (
                <div>
                    <p key = {question.id}>{question.name}</p>
                    <button>start</button>
                </div>
            ))}
        </div>




    )
}

export default Hostpart;