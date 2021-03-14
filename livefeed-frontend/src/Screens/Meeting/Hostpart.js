import React, { useEffect/*, useState*/, Component } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
    ComposedChart,
    Line,
    Area,
} from 'recharts';
import { Link, useParams } from 'react-router-dom';

var qs = require('qs');
const phpurl = "http://localhost:80/server/php/index.php"
const pythonurl = "http://localhost:81/"

const DisplayAnalysis = ({question,setPopup,setPopupvals}) => {

    const colours = ['#0088FE', '#00C49F', '#ff4040', '#ff9d00', '#d616f7'];

    const customLabel = () => {
        return (
            "Label"
        );
    };

    console.log("DEBUGG")
    console.log(question);
    console.log("DEBUGG")


    var data = question.questiondata
    switch (question.questiontype) {
        case 'Written Question':
            const writtenQuestionData = {
                mood:
                    [
                        {
                            name: 'Positive',
                            Quantity: 0,
                        },
                        {
                            name: 'Ambivalent',
                            Quantity: 0,
                        },
                        {
                            name: 'Negative',
                            Quantity: 0,
                        },
                    ], popular:
                    [
                        {
                            name: 'Feedback 1',
                            feedback: '',
                            Quantity: 0,
                        },
                        {
                            name: 'Feedback 2',
                            feedback: '',
                            Quantity: 0,
                        },
                        {
                            name: 'Feedback 3',
                            feedback: '',
                            Quantity: 0,
                        },
                    ]
            }
            if (question.questiondata.length === 0) {
                data = writtenQuestionData
            } else {
                if (question.questiondata.mood.length === 0 || question.questiondata.popular.length === 0 ) {
                    data = writtenQuestionData
                }
            }
            console.log("DEBUG")
            console.log(data.popular[0])
            return (
                <div>
                <Typography>A bar chart to show the mood distribution</Typography>

                <BarChart
                    width={600}
                    height={350}
                    data={data.mood}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="5 5"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="Quantity" fill="#0088FE"/>
                </BarChart>

                <h4>Most frequently repeated feedback: </h4>

                { data.popular.length > 0 && data.popular[0].feedback != "" ?
                    <div> 
                        {/* <Typography>
                            {data.popular.length > 0 && data.popular[0].feedback != "" ? "1: " + data.popular[0].feedback : ""} <br/>
                            {data.popular.length > 1 && data.popular[0].feedback != "" ? "2: " + data.popular[1].feedback : ""} <br/>
                            {data.popular.length > 2 && data.popular[0].feedback != "" ? "3: " + data.popular[2].feedback : ""} <br/>
                        </Typography> */}
                        <List>
                        <Divider />
                        {data.popular.map((i) => (
                            <div>
                                <ListItem>
                                    <ListItemText
                                    primary={i.feedback != "" ? i.feedback : "(No additional repeated feedback)"}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            size='medium'
                                            fullWidth="true"
                                            endIcon={null}
                                            onClick={() => {setPopup(true); setPopupvals(i.feedbacklist)}}
                                        >
                                            View Feedback List
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider/>
                            </div>
                        ))}
                        </List>

                        <BarChart
                            layout="vertical"
                            width={600}
                            height={350}
                            data={data.popular}
                            margin={{
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 20,
                        }}
                        >
                            <CartesianGrid strokeDasharray="5 5"/>
                            <XAxis type="number"/>
                            <YAxis dataKey="name" type="category" scale="band"/>
                            <Tooltip/>
                            <Bar dataKey="Quantity" barSize={20} fill="#0088FE"/>
                        </BarChart>

                    </div>
                :
                    "No repeat feedback has been identified so far, please wait for more responses"
                }

                </div>
            );

        case 'Numerical Rating':

            const numericalScoreData = [
                { name: '1', Quantity: 1 }
            ];
            if (question.questiondata.length === 0) {
                data = numericalScoreData
            }
            return (

                <div>

                    <p>A Pie chart to show the distribution of numerical scores</p>

                    <PieChart width={600} height={350}>
                        <Legend layout="vertical" verticalAlign="top" align="right" />
                        <Tooltip />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="Quantity"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colours[Math.max(0, index)]} />
                            ))}
                            
                        </Pie>

                    </PieChart>

                    {/* <ComposedChart
                        width={600}
                        height={350}
                        data={numericalScoreData}
                        margin={{
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" scale="band" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Quantity" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="Quantity" stroke="#ff7300" /> */}
                    {/* </ComposedChart> */}

                </div>

            );

        case 'Multiple Choice':

            const multipleChoiceData = [
                { name: 'Group A', Quantity: 1 }
            ];
            if (question.questiondata.length === 0) {
                data = multipleChoiceData
            }
            return (
                <div>

                    <p>A Pie chart to show the distribution of multiple choice answers</p>

                    <PieChart width={600} height={350}>
                        <Legend layout="vertical" verticalAlign="top" align="right" />
                        <Tooltip />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="Quantity"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colours[Math.max(0,index)]} />
                            ))}
                        </Pie>

                    </PieChart>

                </div>
            );
    }

}


const Hostpart = () => {
    const [questions,setQuestions] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [noTemplates, setNoTemplates] = React.useState(false);
    const [popup,setPopup] = React.useState(false);
    const [popupvals,setPopupvals] = React.useState([]);

    let {id} = useParams();
    let url_details = id.split('&');
    var meetingid_ = url_details[1];

    //The following 3 consts are temporary data for testing only
    // const multipleChoiceData = [
    //     { name: 'Group A', Quantity: 400 },
    //     { name: 'Group B', Quantity: 300 },
    //     { name: 'Group C', Quantity: 200 },
    //     { name: 'Group D', Quantity: 100 },
    // ];

    // const numericalScoreData = [
    //     { name: '1', Quantity: 400 },
    //     { name: '2', Quantity: 300 },
    //     { name: '3', Quantity: 200 },
    //     { name: '4', Quantity: 100 },
    //     { name: '5', Quantity: 300 },
    // ];

    // const writtenQuestionData = [
    //     [
    //         {
    //             name: 'Positive',
    //             Quantity: 4,
    //         },
    //         {
    //             name: 'Ambivalent',
    //             Quantity: 3,
    //         },
    //         {
    //             name: 'Negative',
    //             Quantity: 5,
    //         },
    //     ],
    //     [
    //         {
    //             name: 'Feedback 1',
    //             feedback: 'Turn up the volume',
    //             Quantity: 12,
    //         },
    //         {
    //             name: 'Feedback 2',
    //             feedback: 'Boring',
    //             Quantity: 4,
    //         },
    //         {
    //             name: 'Feedback 3',
    //             feedback: 'Its really cold in here',
    //             Quantity: 3,
    //         },
    //     ]
    // ]

    //End of temporary testing data

    function gettemplateid(meetingid) {
       return axios.post(phpurl, qs.stringify({function:'getmeetingtemplates', arguments:[meetingid]}))
            .then(res => {
                if (res.data.error) {
                    console.log(res.data.error);
                    return Promise.reject(res.data.error);
                }
                if (res.data.result) {
                    console.log(res.data.result);
                    if (res.data.result.length == 0) {
                        return false
                    } else {
                        return res.data.result[0].TemplateID
                    }
                }
            })
            .catch(err => {console.log(err); return Promise.reject(err)});
    }


    // In here goes the code to fetch the data from the server,
    useEffect(() => {

        setInterval(function () { setRefresh(!refresh); }, 3000);

        var questionList = [];
        Promise.all([gettemplateid(meetingid_)])
            .then(function (results) {
                if (results[0] === false) {
                    setNoTemplates(true)
                    return
                }
                axios.post(phpurl, qs.stringify({function:'gettemplatequestions', arguments:[results[0]]}))
                    .then(res1 => {
                              if (res1.data.error) {
                                  console.log(res1.data.error)
                              }
                              if (res1.data.result) {
                                  console.log(res1.data.result)
                                  //var questionList = []
                                  var qdata = {}
                                  for (const [key, value] of Object.entries(res1.data.result)) {
                                      console.log("Question "+key)
                                      qdata[key] = []
                                      switch (value[1]) {
                                          case "multiple":
                                              console.log("Multiple")
                                              axios.post(pythonurl+"questiontally", qs.stringify({meetingid: meetingid_, questionid:key}))
                                                  .then(res2 => {
                                                      console.log(res2.data);
                                                      if (res2.data != null) {
                                                          console.log("Multiple: Q"+key+" Return:"+res2.data)
                                                          for (const [key2, value2] of Object.entries(res2.data)) {
                                                              qdata[key].push({name: key2, Quantity: value2})
                                                          }
                                                      }
                                                  })
                                                  .catch(err => console.log(err));
                                              console.log("QUestion name:" + value[0]);
                                              console.log(qdata[key]);
                                              questionList.push({questionid: key, questionname: value[0], questiontype: "Multiple Choice", questiondata: qdata[key]})
                                              setQuestions(questionList)
                                              break;
                                          case "open":
                                              console.log("Open")
                                              qdata[key] = {mood: [], popular: []}
                                              axios.post(pythonurl+"questionmood", qs.stringify({meetingid: meetingid_, questionid:key}))
                                                  .then(res2 => {
                                                      console.log(res2.data);
                                                      if (res2.data != null) {
                                                          console.log("Open1: Q" + key + " Return:" + res2.data)
                                                          var qdata1 = []
                                                          for (const [key2, value2] of Object.entries(res2.data)) {
                                                              var mood = "";
                                                              switch (key2) {
                                                                  case 'happy':
                                                                  mood = "Positive"
                                                                  break;
                                                                  case 'neutral':
                                                                  mood = "Ambivalent"
                                                                  break;
                                                                  case 'sad':
                                                                  mood = "Negative"
                                                                  break;
                                                              }
                                                              qdata1.push({name: mood, Quantity: value2})
                                                          }
                                                          qdata[key].mood = qdata1
                                                      } else {
                                                          qdata[key].mood = []
                                                      }
                                                  })
                                                  .catch(err => console.log(err));
                                              axios.post(pythonurl+"questionpopular", qs.stringify({meetingid:meetingid_,questionid:key}))
                                                  .then(res2 => {
                                                      console.log(res2.data);
                                                      if (res2.data != null && res2.data.length > 0) {
                                                          console.log("Open2: Q"+key+" Return:"+res2.data)
                                                          var limit = 4
                                                          if (res2.data.length < 3) {
                                                              limit = res2.data.length+1
                                                          }
                                                          var qdata2 = []
                                                          for (var i=1; i<limit; i++) {
                                                              qdata2.push({
                                                                  name: "Feedback " + i,
                                                                  feedback: res2.data[i - 1][0],
                                                                  feedbacklist: res2.data[i - 1].slice(1),
                                                                  Quantity: res2.data[i - 1].length
                                                              })
                                                          }
                                                          if (limit < 4) {
                                                              for (var j=limit; j<4; j++) {
                                                                  qdata2.push({
                                                                      name: "Feedback " + j,
                                                                      feedback: "",
                                                                      feedbacklist: "",
                                                                      Quantity: 0
                                                                  })
                                                              }
                                                          }
                                                          qdata[key].popular = qdata2
                                                      } else {
                                                          qdata2 = []
                                                          for (var k=1; k<4; k++) {
                                                              qdata2.push({
                                                                  name: "Feedback " + k,
                                                                  feedback: "",
                                                                  feedbacklist: "",
                                                                  Quantity: 0
                                                              })
                                                          }
                                                          qdata[key].popular = qdata2
                                                      }
                                                  })
                                                  .catch(err => console.log(err));
                                              console.log("QUestion name:" + value[0]);
                                              console.log(qdata[key]);
                                              questionList.push({questionid: key, questionname: value[0], questiontype: "Written Question", questiondata: qdata[key]})
                                              setQuestions(questionList)
                                              break;
                                          case "rating":
                                              console.log("Rating")
                                              axios.post(pythonurl+"questiontally", qs.stringify({meetingid: meetingid_, questionid:key}))
                                                  .then(res2 => {
                                                      console.log(res2.data);
                                                      if (res2.data != null) {
                                                          console.log("Rating: Q"+key+" Return:"+res2.data)
                                                          for (const [key2, value2] of Object.entries(res2.data)) {
                                                              qdata[key].push({name: key2, Quantity: value2})
                                                          }
                                                      }
                                                  })
                                                  .catch(err => console.log(err));
                                              console.log("QUestion name:" + value[0]);
                                              console.log(qdata[key]);
                                              questionList.push({questionid: key, questionname: value[0], questiontype: "Numerical Rating", questiondata: qdata[key]})
                                              setQuestions(questionList)
                                              break;
                                          default:
                                              console.log("other")
                                              break;
                                      }
                                  }
                                  console.log("Question List: ");
                                  console.log(questionList);
                                  console.log(qdata);
                              }
                    })
                    .catch(err => console.log(err));

                var mqdata = {mood: [], popular: []}
                axios.post(pythonurl+"meetingmood", qs.stringify({meetingid: meetingid_}))
                    .then(res1 => {
                        console.log(res1.data)
                        if (res1.data != null) {
                            var qdata1 = []
                            for (const [key2, value2] of Object.entries(res1.data)) {
                                var mood = "";
                                switch (key2) {
                                    case 'happy':
                                        mood = "Positive"
                                        break;
                                    case 'neutral':
                                        mood = "Ambivalent"
                                        break;
                                    case 'sad':
                                        mood = "Negative"
                                        break;
                                }
                                qdata1.push({name: mood, Quantity: value2})
                            }
                            mqdata.mood = qdata1
                        }
                    })
                    .catch(err => console.log(err))

                axios.post(pythonurl+"meetingpopular", qs.stringify({meetingid:meetingid_}))
                    .then(res1 => {
                              console.log(res1.data);
                              if (res1.data != null && res1.data.length > 0) {
                              var limit = 4
                              if (res1.data.length < 3) {
                              limit = res1.data.length+1
                              }
                              var qdata2 = []
                              for (var i=1; i<limit; i++) {
                              qdata2.push({
                              name: "Feedback " + i,
                              feedback: res1.data[i - 1][0],
                              feedbacklist: res1.data[i - 1].slice(1),
                              Quantity: res1.data[i - 1].length
                              })
                              }
                              if (limit < 4) {
                              for (var j=limit; j<4; j++) {
                              qdata2.push({
                              name: "Feedback " + j,
                              feedback: "",
                              feedbacklist: "",
                              Quantity: 0
                              })
                              }
                              }
                              mqdata.popular = qdata2
                              } else {
                              qdata2 = []
                              for (var k=1; k<4; k++) {
                              qdata2.push({
                              name: "Feedback " + k,
                              feedback: "",
                              feedbacklist: "",
                              Quantity: 0
                              })
                              }
                              mqdata.popular = qdata2
                              }
                              })
                    .catch(err => console.log(err));
                console.log("meetingsummarydebug")
                console.log(mqdata)

                questionList.push({questionid: '-1', questionname: "Meeting Summary", questiontype: "Written Question", questiondata: mqdata})
                setQuestions(questionList);
            });
        setQuestions(questionList);
        console.log("debug3");
        console.log(questionList);
        console.log("end debug3");

    }, []); // Only run once whenever component is mounted

    // console.log("debug4")
    // console.log(questions)
    // console.log(returnVal)
    // console.log("end debug4")
    return (
        noTemplates ? <p>No templates found ...</p> :
        <div>
            <Dialog
                open={popup}
                fullWidth={true}
                maxWidth={'lg'}
            >

                <DialogTitle id="alert-dialog-title">View Repeated Feedback</DialogTitle>

                <DialogContent>
                    {popupvals.length > 0 ? 
                    popupvals.map(val => (
                        <div>
                            {val}
                            <br/>
                        </div>
                    )) :
                    "No repeat feedback"}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPopup(false)} color="secondary">Close</Button>
                </DialogActions>

            </Dialog>
            <div className="list2">

                <List>
                    <Divider />
                    {questions.map(question => (
                        <div>
                            <ListItem key={question.questionid}>
                                <div>
                                    <h2> {question.questionname} </h2>
                                    <DisplayAnalysis question={question} setPopup={setPopup} setPopupvals={setPopupvals}/>
                                </div>

                            </ListItem>
                            <Divider />
                        </div>

                    ))}

                </List>

            </div>

        </div>
    );

}

export default Hostpart;