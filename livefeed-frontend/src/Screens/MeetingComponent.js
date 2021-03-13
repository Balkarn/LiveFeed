import '../App.css';
import { Button } from '@material-ui/core';
import React, { useEffect/*, useState*/, Component } from "react";
import { Link ,useParams} from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Paper from '@material-ui/core/Paper';
import Header from './Meeting/Header'
import QuestionList from './Meeting/QuestionList';
import Reminder from './Meeting/Reminder';
import axios from 'axios';


const MeetingComponent = (props) => {

    var qs = require('qs');
    const phpurl = "http://localhost:80/server/php/index.php";
    let {id} = useParams();
    const [userid,setUsername] = React.useState('-1');
    const [meetingid,setMeetingid] = React.useState('-1');
    const [sessionname,setSessionname] = React.useState("test");
    const [sessiondate,setSessiondate] = React.useState("24-Feb-21");
    const [hostname,setHostname] = React.useState("James");
    const [templateid,setTemplateid] = React.useState([]);
    const [para,setPara] = React.useState(id.split('&'));// ['user_id','event_id']
    const [templateset,setTemplateset] = React.useState([
        { templateid : 1 , templatename : 'Question 1',questioncontent : 'content of Q1',questiontype : 'Written Question'},
        { templateid : 2 , templatename : 'Question 2',questioncontent : 'content of Q2',questiontype : 'Numerical Rating'},
        { templateid : 3 , templatename : 'Question 3',questioncontent : 'content of Q3',questiontype : 'Multiple Choice'},
    ]);
    const [joinedattendee,setJoinedattendee] = React.useState([
        {id : 1, name : 'attendee 1'},
        {id : 2, name : 'attendee 2'},
        {id : 3, name : 'attendee 3'},
    ]);


    useEffect(() => {
        document.body.style.backgroundColor = "#15bfff"

        var data = {
            function:"getmeetinginfo",
            arguments:[Number(para[0]), Number(para[1])]
        }
        /*
        axios.post(phpurl, qs.stringify(data))
            .then(res => {

                if (res.data.error) {
                    console.log(res.data.error)
                }
                if (res.data.result) {
                    console.log(res.data.result)
                    setSessionname(res.data.result.MeetingName)
                    setSessiondate(res.data.result.StartTime)
                    setHostname(res.data.result.HostID)
                    setMeetingid(res.data.result.MeetingID)
                }
            })
            .catch(err => console.log(err));

        axios.post(phpurl, qs.stringify({function:"getmeetingtemplates",arguments:['1']}))
            .then(res => {

                if (res.data.error) {
                    console.log(res.data.error)
                }
                if (res.data.result) {
                    console.log(res.data.result)
                    setTemplateid([res.data.result[0].TemplateID]);
                }
            })
            .catch(err => console.log(err));

        console.log(para)*/
    }, []); // Only run once
    

    if(para[2] === 'host'){
        return (
    
            <div className="meeting-screen">
                <Paper elevation={10}>
                    <div className="centering2">
                <Header sessionname = {sessionname}
                        sessiondate = {sessiondate}
                        hostname = {hostname}
                />
    
                <div className="meeting-content">
                
                    <QuestionList role = {'host'}
                                templateset = {templateset}
                                />
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
                </Paper>

            </div>
    
        )
    }else{

    return (
        <>

        <div className="meeting-screen">
            <Paper>
                    <div className="centering2">
            <Header sessionname = {sessionname}
                    sessiondate = {sessiondate}
                    hostname = {hostname}
            />
            <div className="meeting-content">
            
                <QuestionList role ='attendee'
                            templateset = {templateset}
                            />
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
            </Paper>
            
        </div>

        </>

    )
    }
}

export default MeetingComponent;