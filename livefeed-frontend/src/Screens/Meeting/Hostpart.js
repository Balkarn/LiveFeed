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


const DisplayAnalysis = ({question}) => {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 200 },
        { name: 'Group D', value: 100 },
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
                <Typography>Mood distribution and repeat analysis</Typography>
            );
        case 'Numerical Rating':
            return (
                <div>
                <p>A Pie chart to show the distribution of numerical scores</p>
                <PieChart width={400} height={350}>
                    <Legend layout="vertical" verticalAlign="top" align="right" />
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
                <PieChart width={400} height={350}>
                    <Legend layout="vertical" verticalAlign="top" align="right" />
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
            { templateid: 1, templatename: 'Question 1', questioncontent: 'content of Q1', questiontype: 'Written Question' },
            { templateid: 2, templatename: 'Question 2', questioncontent: 'content of Q2', questiontype: 'Numerical Rating' },
            { templateid: 3, templatename: 'Question 3', questioncontent: 'content of Q3', questiontype: 'Multiple Choice' },
        ]);
    }, []); // Only run once



    return (
        <div>
            <div className="list2">
                
                <List>
                    <Divider />
                    {questions.map(question => (
                        <div>
                            <ListItem key={question.templateid}>
                                <div>
                                    <h3> {question.templatename} </h3>
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