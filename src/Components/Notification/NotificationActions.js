import {EditNotifications, NotificationAdd, NotificationsOff} from "@mui/icons-material";
import {IconButton, Stack} from "@mui/material";
import {useState} from "react";

const NotificationActions = ({coinId}) => {
    const [userNotification, setUserNotification] = useState({})

    return (<>
        {userNotification && userNotification.id ? <>
            <Stack>
                <IconButton color="primary" aria-label="edit notification">
                    <EditNotifications/>
                </IconButton>
                <IconButton color="primary" aria-label="delete notification">
                    <NotificationsOff/>
                </IconButton>
            </Stack>
        </> : <>
            <IconButton color="primary" aria-label="add notification">
                <NotificationAdd/>
            </IconButton>
        </>}

    </>)
}
export default NotificationActions
