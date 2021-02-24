import React from 'react'

import Header from './Meeting/Header'

const MeetingComponent = () => {
    
    const [username,setUsername] = React.useState("Da");
    const [sessionname,setSessionname] = React.useState("test");
    const [sessiondate,setSessiondate] = React.useState("24-Feb-21");
    const [hostname,setHostname] = React.useState("James");
    const [template,setTemplate] = React.useState("template1");



    return (
        <>
        <Header username = {username}/>

        </>
    )
}

export default MeetingComponent;