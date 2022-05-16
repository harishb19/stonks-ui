import {IconButton, Stack, Tooltip} from "@mui/material";
import {NotificationAddOutlined, NotificationsActive} from '@mui/icons-material';
import React, {useEffect, useState} from "react";
import {useLazyQuery} from "@apollo/client";
import {useStoreState} from "easy-peasy";
import {USER_COIN_NOTIFICATION} from "../../graphql/queries";
import AddUpdateNotification from "./AddUpdateNotification";
import Error from "../Error/CustomError";
import CoinNotification from "./CoinNotification";

const NotificationActions = ({coinId}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [userNotification, setUserNotification] = useState([])
    const [openAddUpdate, setOpenAddUpdate] = useState(false)
    const [openNotificationList, setOpenNotificationList] = useState(false)

    const [fetchUserNotification, {error}] = useLazyQuery(USER_COIN_NOTIFICATION, {
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if (userDetails && userDetails.id && coinId && (openNotificationList || !openNotificationList)) {
            fetchUserNotification({
                variables: {
                    userId: userDetails.id, coinId
                }
            }).then(({data}) => {
                if (data && data.notifications && data.notifications.length > 0) {
                    setUserNotification([...data.notifications])
                }
            })
        }
    }, [coinId, userDetails, fetchUserNotification, openNotificationList])

    if (error) return <Error message={error.message} onClick={() => {
    }}/>
    return (<>
        {userNotification && userNotification.length > 0 ? <Stack direction={"row"}>
            <Tooltip title={"View notification"}>
                <IconButton color="primary" aria-label="view notification"
                            onClick={() => setOpenNotificationList(true)}
                >
                    <NotificationsActive/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"Add notification"}>

                <IconButton color="primary" aria-label="add notification"
                            onClick={() => setOpenAddUpdate(true)}
                >
                    <NotificationAddOutlined/>
                </IconButton>
            </Tooltip>

        </Stack> : <Tooltip title={"Add notification"}>

            <IconButton color="primary" aria-label="add notification"
                        onClick={() => setOpenAddUpdate(true)}
            >
                <NotificationAddOutlined/>
            </IconButton>
        </Tooltip>}
        <AddUpdateNotification coinId={coinId} open={openAddUpdate} setOpen={setOpenAddUpdate}
                               setUserNotification={setUserNotification}
                               userNotification={userNotification}/>
        <CoinNotification open={openNotificationList} setOpen={setOpenNotificationList}
                          setUserNotification={setUserNotification} coinId={coinId}
                          userNotification={userNotification}/>

    </>)
}
export default NotificationActions
