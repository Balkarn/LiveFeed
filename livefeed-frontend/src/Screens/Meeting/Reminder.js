import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';



const Reminder = ({role,attendeelist}) => {


    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
          maxWidth: 752,
        },
        demo: {
          backgroundColor: theme.palette.background.paper,
        },
        title: {
          margin: theme.spacing(4, 0, 2),
        },
      }));

    if (role === 'host'){
        return (

            <div>
                <Grid item xs={12} md={12}>
                    <Typography variant="h6">
                        Attendee list
                    </Typography>
                    <List>
                        {attendeelist.map(attendee =>(
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={attendee.name}/>
                            </ListItem>))}
                    </List>
                </Grid>
            </div>
            
        )
    }
}


export default Reminder;