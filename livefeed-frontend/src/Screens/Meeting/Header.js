import React from 'react'


const Header = ({sessionname,sessiondate,hostname}) => {
    

    return (
        <div className="meeting-header">
            {/* <h1>{sessionname}</h1>
            <h3 >{sessiondate}</h3>
            <h3>Host:{hostname}</h3>
        <h3>{template}</h3> */}
        <h1 textAlign='right'>
            Session Name: <span className="light">{sessionname}</span>
        </h1>     
        <h3>
            Host: <span className="light">{hostname}</span>
        </h3>
        </div>
    )
}

export default Header;