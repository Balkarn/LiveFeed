import React from 'react'



const Header = ({username,sessionname,sessiondate,hostname,template}) => {
    
    
    return (
        <div>
            <h1>{sessionname}</h1>
            <h3 >{sessiondate}</h3>
            <h3>Host:{hostname}</h3>
            <h3>{template}</h3>
        </div>
    )
}

export default Header;