import {Dialog, DialogContent, DialogTitle, List} from "@mui/material";
import React from "react";
import ViewNotifications from "./ViewNotifications";

const CoinNotification = ({open, setOpen, coinId, userNotification, setUserNotification}) => {
    return (<Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{coinId}'s Notification</DialogTitle>
            <DialogContent>

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
