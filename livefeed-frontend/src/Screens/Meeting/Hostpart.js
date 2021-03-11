import React from 'react'
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
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


const DisplayAnalysis = ({question}) => {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#ff4040', '#f7911b'];

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
                <PieChart width={300} height={300}>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
                </PieChart>
            );
        case 'Multiple Choice':
            return (
                <PieChart width={300} height={300}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={customLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[Math.max(0,index)]} />
                        ))}
                    </Pie>
                </PieChart>
            );
    }

}

const Hostpart = ({templateset}) => {
    const meetingtemplatset = templateset;

    return (
        <div>
            <div className="list">
                
                <List>
                    <Divider />
                    {meetingtemplatset.map(question => (
                        <div>
                            <ListItem key={question.templateid}>
                                <div>
                                    <Typography/> {question.templatename} <br/>
                                    <Typography/>
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