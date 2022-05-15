import {useStoreActions, useStoreState} from "easy-peasy";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_NOTIFICATION_LOGS} from "../../graphql/queries";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import {blackColor} from "../../Common/Colors";
import {Delete} from "@mui/icons-material";
import {DELETE_NOTIFICATION_LOGS} from "../../graphql/mutation";
import {toast} from "react-toastify";
import {format} from "date-fns";

const ListView = ({id, coinId, coinIcon, title, body, createdAt}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const deleteNotificationsArray = useStoreActions(actions => actions.notifications.deleteNotificationsArray)

    const [open, setOpen] = useState(false)
    const [deleteLog] = useMutation(DELETE_NOTIFICATION_LOGS)
    const handleDelete = (delId) => {
        deleteLog({
            variables: {
                id: delId,
                userId: userDetails.id
            }
        }).then(() => {
            toast.success(`Log deleted`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            deleteNotificationsArray(id)
            setOpen(false)
        }).catch((e) => {
            console.log(JSON.stringify(e))
            toast.error(`Error deleting logs`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    }
    let formattedTime=createdAt?format(new Date(createdAt), "dd-MM-yyyy HH:mm"):"now"
    return (
        <>
            <ListItem
                secondaryAction={
                    <Tooltip
                        title={"Delete notification"}>
                        <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>
                }

            >
                <ListItemAvatar>
                    <Avatar alt={coinId} src={coinIcon}/>

                </ListItemAvatar>
                <ListItemText primary={title} secondary={`${body} `}/>
                <ListItemText secondary={formattedTime?formattedTime:"now"}/>

            </ListItem>

            <Dialog open={open} disableEscapeKeyDown>
                <DialogTitle sx={{backgroundColor: blackColor}}>Warning</DialogTitle>
                <DialogContent sx={{backgroundColor: blackColor}}>
                    <DialogContentText>
                        Do you really wish to delete this notification log forever?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{backgroundColor: blackColor}}>
                    <Button onClick={() => {
                        handleDelete(id)
                    }} variant={"contained"}>Yes</Button>
                    <Button onClick={() => {
                        setOpen(false)
                    }
                    } variant={"outlined"}>No</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}
const NotificationCenter = () => {
    const notifications = useStoreState(state => state.notifications.notifications)
    const setNotifications = useStoreActions(actions => actions.notifications.setNewNotifications)
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
    }, [data, loading,setNotifications])
    useEffect(() => {
        if (userDetails && userDetails.id) {
            fetchNotif({
                variables: {
                    userId: userDetails.id
                }
            })
        }
    }, [userDetails, openNotifications,fetchNotif])
    if (loading) return <Loading/>
    if (error) return <Error message={error.message} onClick={() => {
    }}/>
    return (<>
        <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)} maxWidth={"md"} fullWidth>
            <DialogTitle sx={{
                textAlign: "center", color: "white", minWidth: "400px", alignItems: "center",
                letterSpacing: "3px", fontWeight: "bold"
            }} component={"p"}>Notification center</DialogTitle>

            <DialogContent sx={{backgroundColor: blackColor}}>

                {notifications.length <= 0 ? <Typography variant={"h5"}>No Notifications</Typography> :

                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {notifications.map(({id, data, notification, createdAt}, index) => <ListView
                            createdAt={createdAt}
                            title={notification.title}
                            body={notification.body}
                            coinId={data.coinId}
                            coinIcon={data.coinIcon}
                            id={id} index={index}/>)}
                    </List>}
            </DialogContent>
        </Dialog>
    </>)

}
export default NotificationCenter
