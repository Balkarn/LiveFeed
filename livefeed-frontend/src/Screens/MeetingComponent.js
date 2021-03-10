import { Button } from '@material-ui/core';
import React from 'react';
import { Link ,useParams} from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Header from './Meeting/Header'
import QuestionList from './Meeting/QuestionList';
import Reminder from './Meeting/Reminder';


const MeetingComponent = (props) => {
    
    const [userid,setUsername] = React.useState('12');
    const [sessionname,setSessionname] = React.useState("test");
    const [sessiondate,setSessiondate] = React.useState("24-Feb-21");
    const [hostname,setHostname] = React.useState("James");
    let {id} = useParams();

    const [templateset,setTemplateset] = React.useState([
        { templateid : 1 , templatename : 'Name of T1',questioncontent : 'content of Q1',questiontype : 'written'},
        { templateid : 2 , templatename : 'Name of T2',questioncontent : 'content of Q2',questiontype : 'score'},
        { templateid : 3 , templatename : 'Name of T3',questioncontent : 'content of Q3',questiontype : 'multichoice'},
    ]);
    const [joinedattendee,setJoinedattendee] = React.useState([
        {id : 1, name : 'attendee 1'},
        {id : 2, name : 'attendee 2'},
        {id : 3, name : 'attendee 3'},
    ]);//avoid space in name

    if(id === userid){
        return (
            <>
    
            <div className="meeting-screen">
                <Header sessionname = {sessionname}
                        sessiondate = {sessiondate}
                        hostname = {hostname}
                />
    
                <div className="meeting-content">
                
                    <QuestionList role = {'host'}
                                templateset = {templateset}
                                />
                    <Reminder role = {'host'} attendeelist = {joinedattendee}/>
                </div>
                <Link to="/">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ExitToAppIcon />}>
                    End Session
                </Button>
                </Link>
                
            </div>
    
            </>
    
        )
    }else{

    return (
        <>

        <div className="meeting-screen">

            <Header sessionname = {sessionname}
                    sessiondate = {sessiondate}
                    hostname = {hostname}
            />

            <div className="meeting-content">
            
                <QuestionList role ='attendee'
                            templateset = {templateset}
                            />
                <Reminder role = 'attendee'/>
            </div>
            <Link to="/">
            <Button
                variant="contained"
                color="secondary"
                startIcon={<ExitToAppIcon />}>
                End Session
            </Button>
            </Link>
            
        </div>

        </>

    )
    }
}

export default MeetingComponent;