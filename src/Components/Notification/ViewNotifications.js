import {IconButton, List, ListItem, ListItemText, Stack, Tooltip} from "@mui/material";
import {NotificationsOffOutlined} from "@mui/icons-material";
import React from "react";
import {useMutation} from "@apollo/client";
import {UPDATE_NOTIFICATIONS} from "../../graphql/mutation";

const ViewNotifications = () => {
    const [updateFunc] = useMutation(UPDATE_NOTIFICATIONS);

    return (
        <List dense={true}>
            <ListItem
                secondaryAction={
                    <Stack direction={"row"}>
                        <Tooltip title={"Edit notification"}>
                            <IconButton color="primary" aria-label="edit notification">
                                <NotificationsOffOutlined/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete notification"}>
                            <IconButton color="error" aria-label="delete notification">
                                <NotificationsOffOutlined/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
            >
                <ListItemText
                    primary="Single-line item"
                    secondary={'Secondary text'}
                />
            </ListItem>

        </List>
    )
}
export default ViewNotifications
