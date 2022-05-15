import {Dialog, DialogContent, DialogTitle, List} from "@mui/material";
import React, {useEffect} from "react";
import ViewNotifications from "./ViewNotifications";
import {blackColor} from "../../Common/Colors";
import {useQuery} from "@apollo/client";
import {USER_COIN_NOTIFICATION} from "../../graphql/queries";
import {useStoreState} from "easy-peasy";

const CoinNotification = ({open, setOpen, coinId, userNotification, setUserNotification}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const {data, loading, refetch} = useQuery(USER_COIN_NOTIFICATION, {
        variables: {
            coinId, userId: userDetails.id

        }, fetchPolicy: "network-only"
    })
    useEffect(() => {
        if (!loading && data) {
            console.log(data)
            if (data && data.notifications) {
                setUserNotification([...data.notifications])
            }else {
                setUserNotification([])
            }
        }
    }, [data, loading,setUserNotification])
    useEffect(() => {
        if (!userNotification || userNotification.length <= 0) {
            setOpen(false)
        }
    }, [userNotification,setOpen])
    return (<Dialog open={open} onClose={() => setOpen(false)} maxWidth={"sm"} fullWidth>
            <DialogTitle component={"p"}
                         sx={{backgroundColor: blackColor}}>{coinId.charAt(0).toUpperCase() + coinId.slice(1)}'s
                Notification</DialogTitle>
            <DialogContent sx={{backgroundColor: blackColor}}>

                <List>
                    {/*<ListItem*/}
                    {/*    secondaryAction={*/}
                    {/*        <Stack direction={"row"} justifyContent={"space-between"}>*/}
                    {/*            <Typography component={"div"} variant={"body1"} sx={{marginRight:"1em"}}>*/}
                    {/*                Triggered*/}
                    {/*            </Typography>*/}
                    {/*            <Typography component={"div"} variant={"body1"}>*/}
                    {/*                Delete*/}
                    {/*            </Typography>*/}
                    {/*        </Stack>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <ListItemAvatar>*/}
                    {/*        <Avatar sx={{color: "white", bgcolor: pinkColor}}>*/}
                    {/*            #*/}
                    {/*        </Avatar>*/}
                    {/*    </ListItemAvatar>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={"Topic"}*/}
                    {/*        secondary={"Condition"}*/}
                    {/*    />*/}
                    {/*</ListItem>*/}
                    {userNotification && userNotification.map(({id, topic, condition, isActive, updatedAt}, index) =>
                        <ViewNotifications index={index} isActive={isActive} updatedAt={updatedAt}
                                           key={id}
                                           topic={topic}
                                           id={id}
                                           condition={condition}
                                           userNotification={userNotification}
                                           allNotification={setUserNotification} refetch={refetch}/>)}
                </List>
            </DialogContent>
        </Dialog>

    )
}
export default CoinNotification
