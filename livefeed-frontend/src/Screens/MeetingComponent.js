import React from 'react'

import Header from './Meeting/Header'
import QuestionList from './Meeting/QuestionList';

const MeetingComponent = () => {
    
    const [username,setUsername] = React.useState("Da");
    const [sessionname,setSessionname] = React.useState("test");
    const [sessiondate,setSessiondate] = React.useState("24-Feb-21");
    const [hostname,setHostname] = React.useState("James");
    const [template,setTemplate] = React.useState("template1");



    return (
        <>
        <Header username = {username} 
                sessionname = {sessionname}
                sessiondate = {sessiondate}
                hostname = {hostname}
                template = {template}
                />
        <QuestionList role = {username === hostname ? 'host' : 'attendee'}
                      template1 = {template}
                      />
        </>
    )
}

export default MeetingComponent;