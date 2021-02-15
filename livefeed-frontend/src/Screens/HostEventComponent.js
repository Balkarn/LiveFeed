import React, { useEffect/*, useState*/    } from "react";
import { TextField, Button } from '@material-ui/core';
import 'fontsource-roboto';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import AlarmIcon from '@material-ui/icons/Alarm';
import DeleteIcon from '@material-ui/icons/Delete';

const HostEventComponent = () => {

    return (
      <>
        <h1>Host Event</h1>
        <h3>Scheduled Meetings</h3>
        <div className="list">
            <List>
                <Divider />
                    <ListItem>
                        <ListItemText>General Meeting </ListItemText>

                        <ListItemSecondaryAction>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                <Divider />
            </List>
        </div>
      </>
    );
  
  }

  export default HostEventComponent;