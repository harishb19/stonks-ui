import {Dialog, DialogContent, DialogTitle, List} from "@mui/material";
import React from "react";
import ViewNotifications from "./ViewNotifications";
import {blackColor} from "../../Common/Colors";

const CoinNotification = ({open, setOpen, coinId, userNotification, setUserNotification}) => {
    return (<Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle component={"p"}
                         sx={{backgroundColor: blackColor}}>{coinId.charAt(0).toUpperCase() + coinId.slice(1)}'s
                Notification</DialogTitle>
            <DialogContent sx={{backgroundColor: blackColor}}>

                <List>
                    {userNotification.map(({id, topic, condition}, index) => <ViewNotifications index={index} key={id}
                                                                                                topic={topic}
                                                                                                id={id}
                                                                                                condition={condition}
                                                                                                allNotification={setUserNotification}/>)}
                </List>
            </DialogContent>
        </Dialog>

    )
}
export default CoinNotification
