import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";
import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {DELETE_NOTIFICATIONS, UPDATE_NOTIFICATIONS} from "../../graphql/mutation";
import {useStoreState} from "easy-peasy";
import {toast} from "react-toastify";

const conditionToString = (condition) => {
    if (condition) {
        if (condition["gt"]) {
            return `> ${condition["gt"]}`
        }
        if (condition["lt"]) {
            return `&lt; ${condition["lt"]}`
        }
        if (condition["eq"]) {
            return `= ${condition["eq"]}`
        }
    }

    return ""
}
const ViewNotifications = ({id, topic, condition, allNotification, index}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [open, setOpen] = useState(false)
    const [updateFunc] = useMutation(UPDATE_NOTIFICATIONS);
    const [deleteFunc] = useMutation(DELETE_NOTIFICATIONS);
    const handleDelete = () => {
        deleteFunc({
            variables: {
                id,
                userId: userDetails.id
            }
        }).then(({data}) => {
            allNotification((notif) => [...notif, {...data.deleteNotification}])
            setOpen(false)
        }).catch((e) => {
            console.log(JSON.stringify(e))
            setOpen(false)

            toast.error(`Error in re-enabling`, {
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
    const handleYes = () => {
        updateFunc({
            variables: {
                id,
                userId: userDetails.id
            }
        }).then(({data}) => {
            allNotification((notif) => ({...notif, ...data.updateNotification}))
            setOpen(false)
        }).catch((e) => {
            console.log(JSON.stringify(e))
            setOpen(false)

            toast.error(`Error in re-enabling`, {
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
    return (
        <><ListItem
            // secondaryAction={
            //     <Stack direction={"row"}>
            //         {/*<Tooltip title={"Edit notification"}>*/}
            //         {/*    <IconButton color="primary" aria-label="edit notification"*/}
            //         {/*    onClick={()=>setOpen(true)}*/}
            //         {/*    >*/}
            //         {/*        <NotificationsOffOutlined/>*/}
            //         {/*    </IconButton>*/}
            //         {/*</Tooltip>*/}
            //         <Tooltip title={"Delete notification"}
            //                  onClick={() => setOpen(true)}
            //         >
            //             <IconButton color="error" aria-label="delete notification">
            //                 <NotificationsOffOutlined/>
            //             </IconButton>
            //         </Tooltip>
            //     </Stack>
            // }
        >
            <ListItemAvatar>
                <Avatar>
                    #{index + 1}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={topic}
                secondary={`${conditionToString(condition)}`}
            />
        </ListItem>
            <Dialog open={open} disableEscapeKeyDown>
                <DialogTitle>Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete the notification?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete()}>Yes</Button>
                    <Button onClick={() => setOpen(false)}>No</Button>
                </DialogActions>
            </Dialog>
        </>


    )
}
export default ViewNotifications
