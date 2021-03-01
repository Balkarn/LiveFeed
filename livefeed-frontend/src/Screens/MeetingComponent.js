import { Button } from '@material-ui/core';
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

        <div className="meeting-screen">

            <Header username = {username} 
                    sessionname = {sessionname}
                    sessiondate = {sessiondate}
                    hostname = {hostname}
                    template = {template}
            />

            <div className="meeting-content">
            
                <QuestionList role = {username === hostname ? 'host' : 'attendee'}
                            template1 = {template}
                            />

                <p>Attendees List</p>   

            </div>

            <Button>End Session</Button>
        </div>

        </>

    )
}

export default MeetingComponent;