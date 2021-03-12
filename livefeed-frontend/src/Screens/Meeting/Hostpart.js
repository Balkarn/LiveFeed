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


const DisplayAnalysis = ({question}) => {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 200 },
        { name: 'Group D', value: 100 },
    ];

    const data2 = [
        {
            name: 'Very Positive',
            number: 4,
        },
        {
            name: 'Somewhat Positive',
            number: 3,
        },
        {
            name: 'Negative',
            number: 5,
        },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#ff4040', '#ff9d00'];

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
                    data={data2}
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
                    <Bar dataKey="number" fill="#0088FE" />
                    </BarChart>
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
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[Math.max(0, index)]} />
                        ))}
                        
                    </Pie>
                    {/* <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={0} outerRadius={110} fill="#82ca9d" label={customLabel} >
                    
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[Math.max(0, index)]} />
                        ))}
                    </Pie> */}
                </PieChart>
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
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[Math.max(0,index)]} />
                        ))}
                    </Pie>
                    {/* <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={0} outerRadius={110} fill="#82ca9d" label={customLabel} >
                    
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[Math.max(0, index)]} />
                        ))}
                    </Pie> */}
                </PieChart>
                </div>
            );
    }

}

const Hostpart = () => {
    const [questions,setQuestions] = React.useState([]);

    useEffect(() => {
        setQuestions([
            { questionid: 1, questionname: 'What do you think of this event so far?', questiontype: 'Written Question' },
            { questionid: 2, questionname: 'Please rate how entertaining this event was from 1-5.', questiontype: 'Numerical Rating' },
            { questionid: 3, questionname: 'Which of the following parts of the event was the best?', questiontype: 'Multiple Choice' },
        ]);
    }, []); // Only run once



    return (
        <div>
            <div className="list2">
                
                <List>
                    <Divider />
                    {questions.map(question => (
                        <div>
                            <ListItem key={question.questionid}>
                                <div>
                                    <h3> {question.questiontype + " - " + question.questionname} </h3>
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