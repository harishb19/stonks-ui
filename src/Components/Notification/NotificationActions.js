import {IconButton, Stack} from "@mui/material";
import {EditNotificationsOutlined,NotificationsOffOutlined,NotificationAddOutlined} from '@mui/icons-material';
import {useState} from "react";

const NotificationActions = ({coinId}) => {
    const [userNotification, setUserNotification] = useState({})

    return (<>
        {userNotification && userNotification.id ? <>
            <Stack direction={"row"}>
                <IconButton color="primary" aria-label="edit notification">
                    <EditNotificationsOutlined/>
                </IconButton>
                <IconButton color="error" aria-label="delete notification">
                    <NotificationsOffOutlined/>
                </IconButton>
            </Stack>
        </> : <>
            <IconButton color="primary" aria-label="add notification">
                <NotificationAddOutlined/>
            </IconButton>
        </>}

    </>)
}
export default NotificationActions
