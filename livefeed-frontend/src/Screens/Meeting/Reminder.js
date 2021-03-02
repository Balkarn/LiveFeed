const Reminder = ({role}) => {
    if (role === 'host'){
        return (
            <p>Attendees List</p> 
        )
    }else {
        return (
            <p>Host will send you template soon.Please be patient</p>
        )
    }
}


export default Reminder;