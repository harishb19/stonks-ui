import {useStoreActions, useStoreState} from "easy-peasy";
import {
    Avatar,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import React, {useEffect} from "react";
import {useLazyQuery} from "@apollo/client";
import {GET_NOTIFICATION_LOGS} from "../../graphql/queries";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import {blackColor} from "../../Common/Colors";

const NotificationCenter = () => {
    const notifications = useStoreState(state => state.notifications.notifications)
    const setNotifications = useStoreActions(actions => actions.notifications.setNotificationsArray)
    const openNotifications = useStoreState(state => state.notifications.openNotifications)
    const setOpenNotifications = useStoreActions(actions => actions.notifications.setOpenNotifications)
    const userDetails = useStoreState(state => state.user.userDetails)

    const [fetchNotif, {data, loading, error}] = useLazyQuery(GET_NOTIFICATION_LOGS, {
        nextFetchPolicy: "network-only"
    })
    useEffect(() => {
        if (!loading && data) {
            console.log(data)
            setNotifications([...data.notificationLogs])
        }
    }, [data, loading])
    useEffect(() => {
        if (userDetails && userDetails.id) {
            fetchNotif({
                variables: {
                    userId: userDetails.id
                }
            })
        }
    }, [userDetails])
    if (loading) return <Loading/>
    if (error) return <Error message={error.message} onClick={() => {
    }}/>
    return (<>
        <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)}>
            <DialogTitle sx={{backgroundColor: blackColor}}>Notification center</DialogTitle>
            <DialogContent sx={{backgroundColor: blackColor}}>

                {notifications.length <= 0 ? <Typography variant={"h5"}>No notifications</Typography> :

                    <List sx={{width: '100%', maxWidth: 400, bgcolor: 'background.paper'}}>
                        {notifications.map(({data, notification}) => <ListItem>
                            <ListItemAvatar>
                                <Avatar alt={data.coinId} src={data.coinIcon}/>

                            </ListItemAvatar>
                            <ListItemText primary={notification.title} secondary={notification.body}/>
                        </ListItem>)}
                    </List>}
            </DialogContent>
        </Dialog>
    </>)

}
export default NotificationCenter
