import {IconButton, Stack, Tooltip} from "@mui/material";
import {EditNotificationsOutlined, NotificationAddOutlined, NotificationsOffOutlined} from '@mui/icons-material';
import {useState} from "react";

const NotificationActions = ({coinId}) => {
    const [userNotification, setUserNotification] = useState({})

    return (<>
        {userNotification && userNotification.id ? <Stack direction={"row"}>
            <Tooltip title={"Edit notification"}>
                <IconButton color="primary" aria-label="edit notification">
                    <EditNotificationsOutlined/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"Delete notification"}>

                <IconButton color="error" aria-label="delete notification">
                    <NotificationsOffOutlined/>
                </IconButton>
            </Tooltip>
        </Stack> : <Tooltip title={"Add notification"}>

            <IconButton color="primary" aria-label="add notification">
                <NotificationAddOutlined/>
            </IconButton>
        </Tooltip>}

    </>)
}
export default NotificationActions
