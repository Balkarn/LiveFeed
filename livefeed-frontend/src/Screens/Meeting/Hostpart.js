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
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
    ComposedChart,
    Line,
    Area,
} from 'recharts';

const DisplayAnalysis = ({question}) => {

    const colours = ['#0088FE', '#00C49F', '#ff4040', '#ff9d00', '#d616f7'];

    const customLabel = () => {
        return (
            "Label"
        );
    };


    switch (question.questiontype) {

        case 'Written Question':

            return (
                <div>
                    <Typography>A bar chart to show the mood distribution</Typography>

                    <BarChart
                        width={600}
                        height={350}
                        data={question.questiondata[0]}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Quantity" fill="#0088FE" />
                    </BarChart>

                    <h4>Top 3 Most frequently repeated feedback: </h4>

                    <Typography>
                        {"1: " + question.questiondata[1][0].feedback} <br/>
                        {"2: " + question.questiondata[1][1].feedback} <br />
                        {"3: " + question.questiondata[1][2].feedback} <br />
                    </Typography>
                    

                    <ComposedChart
                        layout="vertical"
                        width={600}
                        height={350}
                        data={question.questiondata[1]}
                        margin={{
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5"  />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip />
                        <Bar dataKey="Quantity" barSize={20} fill="#0088FE" />
                    </ComposedChart>

                </div>
            );

        case 'Numerical Rating':

            return (

                <div>

                    <p>A Pie chart to show the distribution of numerical scores</p>

                    <PieChart width={600} height={350}>
                        <Legend layout="vertical" verticalAlign="top" align="right" />
                        <Tooltip />
                        <Pie
                            data={question.questiondata}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="Quantity"
                            label
                        >
                            {question.questiondata.map((entry, index) => (
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

            return (
                <div>

                    <p>A Pie chart to show the distribution of multiple choice answers</p>

                    <PieChart width={600} height={350}>
                        <Legend layout="vertical" verticalAlign="top" align="right" />
                        <Tooltip />
                        <Pie
                            data={question.questiondata}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="Quantity"
                            label
                        >
                            {question.questiondata.map((entry, index) => (
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
    const [data,setData] = React.useState([]);

    //The following 3 consts are temporary data for testing only
    const multipleChoiceData = [
        { name: 'Group A', Quantity: 400 },
        { name: 'Group B', Quantity: 300 },
        { name: 'Group C', Quantity: 200 },
        { name: 'Group D', Quantity: 100 },
    ];

    const numericalScoreData = [
        { name: '1', Quantity: 400 },
        { name: '2', Quantity: 300 },
        { name: '3', Quantity: 200 },
        { name: '4', Quantity: 100 },
        { name: '5', Quantity: 300 },
    ];

    const writtenQuestionData = [
        [
            {
                name: 'Positive',
                Quantity: 4,
            },
            {
                name: 'Ambivalent',
                Quantity: 3,
            },
            {
                name: 'Negative',
                Quantity: 5,
            },
        ], 
        [
            {
                name: 'Feedback 1',
                feedback: 'Turn up the volume',
                Quantity: 12,
            },
            {
                name: 'Feedback 2',
                feedback: 'Boring',
                Quantity: 4,
            },
            {
                name: 'Feedback 3',
                feedback: 'Its really cold in here',
                Quantity: 3,
            },
        ]
    ];

    //End of temporary testing data

    // In here goes the code to fetch the data from the server,
    useEffect(() => {
        //The following line is temporary testing data
        setQuestions([
            { questionid: 1, questionname: 'What do you think of this event so far?', questiontype: 'Written Question', questiondata: writtenQuestionData},
            { questionid: 2, questionname: 'Please rate how entertaining this event was from 1-5.', questiontype: 'Numerical Rating', questiondata: numericalScoreData},
            { questionid: 3, questionname: 'Which of the following parts of the event was the best?', questiontype: 'Multiple Choice', questiondata: multipleChoiceData},
        ]);
    }, []); // Only run once whenever component is mounted



    return (
        <div>
            <div className="list2">
                
                <List>
                    <Divider />
                    {questions.map(question => (
                        <div>
                            <ListItem key={question.questionid}>
                                <div>
                                    <h2> {question.questiontype + " - " + question.questionname} </h2>
                                    <DisplayAnalysis question={question}/>
                                </div>

                            </ListItem>
                            <Divider/>
                        </div>
                    
                    ))}

                </List> 

            </div>

        </div>

    )

}

export default Hostpart;