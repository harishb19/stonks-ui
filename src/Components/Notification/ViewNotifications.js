import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Tooltip
} from "@mui/material";
import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {DELETE_NOTIFICATIONS} from "../../graphql/mutation";
import {useStoreState} from "easy-peasy";
import {toast} from "react-toastify";
import {blackColor, pinkColor} from "../../Common/Colors";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import {CheckCircle, Delete, EditNotifications, RadioButtonUnchecked} from "@mui/icons-material"
import {format} from 'date-fns'
import {UpdateNotification} from "./AddUpdateNotification";

export const conditionToString = (condition) => {
    if (condition) {
        let val = ""
        if (condition["gt"]) {
            val = `${getDollarNumber(condition["gt"])}${getDollarText(condition["gt"])}`
            return `> ${val}`
        }
        if (condition["lt"]) {
            val = `${getDollarNumber(condition["lt"])}${getDollarText(condition["lt"])}`
            return `< ${val}`
        }
        if (condition["eq"]) {
            val = `${getDollarNumber(condition["eq"])}${getDollarText(condition["eq"])}`
            return `= ${val}`
        }
    }

    return ""
}
export const conditionToNumber = (condition) => {
    if (condition) {
        if (condition["gt"]) {
            return condition["gt"]
        }
        if (condition["lt"]) {
            return condition["lt"]
        }
        if (condition["eq"]) {
            return condition["eq"]

        }
    }

    return ""
}
export const conditionToType = (condition) => {
    if (condition) {
        if (condition["gt"]) {
            return `gt`
        }
        if (condition["lt"]) {
            return `lt`
        }
        if (condition["eq"]) {
            return `eq`
        }
    }

    return ""
}
const topicSelector = (topic) => {
    switch (topic) {
        case "price":
            return "Current price"
        case "high":
            return "Market cap"
        default:
            return "Market cap"
    }

}
const ViewNotifications = ({id, topic, condition, allNotification, index, isActive, updatedAt, refetch}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [deleteFunc] = useMutation(DELETE_NOTIFICATIONS);

    const handleDelete = () => {
        deleteFunc({
            variables: {
                id,
                userId: userDetails.id
            }
        }).then(({data}) => {
            refetch()
            setOpen(false)
            toast.success(`Notification deleted.`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
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
            secondaryAction={
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Tooltip
                        title={isActive ? `Notification not triggered` : `Notification triggered at ${updatedAt &&
                        format(new Date(updatedAt), "dd-MM-yyyy HH:mm")}`}>
                        <Box sx={{marginRight: "1em"}}>
                            <IconButton edge="end" aria-label="triggered" disabled>
                                {isActive ? <RadioButtonUnchecked/> : <CheckCircle/>}
                            </IconButton>
                        </Box>
                    </Tooltip>
                    <Tooltip title={isActive ? "Edit notification" : "notification was triggered and cannot be edited"}>
                        <Box sx={{marginRight: "1em"}}>
                            <IconButton edge="end" aria-label="triggered" disabled={!isActive}
                                        onClick={() => setOpenEdit(true)}>
                                <EditNotifications/>
                            </IconButton>
                        </Box>
                    </Tooltip>
                    <div>
                        <Tooltip title={"Delete notification"}>
                            <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Stack>

            }
        >
            <ListItemAvatar>
                <Avatar sx={{color: "white", bgcolor: pinkColor}}>
                    #{index + 1}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={topicSelector(topic)}
                secondary={`${conditionToString(condition)}`}
            />
        </ListItem>
            <Dialog open={open} disableEscapeKeyDown>
                <DialogTitle component={"p"} sx={{backgroundColor: blackColor}}>Delete</DialogTitle>
                <DialogContent sx={{backgroundColor: blackColor}}>
                    <DialogContentText>
                        Do you want to delete the notification?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{backgroundColor: blackColor}}>
                    <Button onClick={() => handleDelete()}>Yes</Button>
                    <Button onClick={() => setOpen(false)}>No</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEdit} disableEscapeKeyDown>
                <DialogTitle component={"p"} sx={{backgroundColor: blackColor}}>Edit</DialogTitle>
                <DialogContent sx={{backgroundColor: blackColor}}>
                    <DialogContentText>
                        You can only edit the value.
                    </DialogContentText>
                    <UpdateNotification id={id} setUserNotification={allNotification} setOpen={setOpenEdit}
                                        topic={topic}
                                        condition={topic === "price" ? conditionToNumber(condition) : getDollarNumber(conditionToNumber(condition))}
                                        conditionType={conditionToType(condition)}
                                        amountType={topic === "price" ? "na" : getDollarText(conditionToNumber(condition))}
                                        refetch={refetch}/>
                </DialogContent>

            </Dialog>
        </>

    )
}
export default ViewNotifications
