import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Avatar, Button, ListItemButton, ListItemIcon, useMediaQuery} from "@mui/material";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ALL_COINS} from "../../graphql/queries";
import SearchBar from "./SearchBar";
import ListItemText from "@mui/material/ListItemText";
import {useTheme} from "@mui/material/styles";

function stringAvatar(name) {
    if (name.split(' ')[0][0] && name.split(' ')[1][0]){
        return {
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    else if(name.split(' ')[0][0]){
        return {
            children: `${name.split(' ')[0][0]}`,
        };
    }
    else {
        return {
            children: `S`,
        };
    }

}

export const NotificationBadge = ({sideMenu, open}) => {
    const theme = useTheme()
    const setOpenNotifications = useStoreActions(actions => actions.notifications.setOpenNotifications)
    const notifications = useStoreState(state => state.notifications.notifications)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (sideMenu) {
        if (isMobile) {
            return (<ListItemButton
                sx={{
                    minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                }}
                onClick={() => setOpenNotifications(true)}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                    }}
                >
                    {notifications.length > 0 ? <Badge badgeContent={notifications.length} color="secondary">
                        <NotificationsIcon/>
                    </Badge> : <NotificationsIcon/>}
                </ListItemIcon>
                <ListItemText primary={"Notifications"} sx={{opacity: open ? 1 : 0}}/>
            </ListItemButton>)
        }
        return null

    }
    return (<IconButton
        size="large"
        aria-label="show notifications"
        onClick={() => setOpenNotifications(true)}
    >
        {notifications.length > 0 ? <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon/>
        </Badge> : <NotificationsIcon/>}

    </IconButton>)
}

export const UserProfile = ({sx}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const userImage = useStoreState(state => state.user.userImage)
    if (userImage) {
        return <Avatar alt={`${userDetails.firstName} ${userDetails.lastName ?? "."}`} src={userImage} sx={{...sx}}/>


    }
    return <Avatar {...stringAvatar(`${userDetails.firstName} ${userDetails.lastName ?? "."}`)}
                   sx={{...sx, backgroundColor: "#6f5ed4 ", color: "white"}}/>

}

const PrimaryAppBar = ({onClick, open}) => {
    const navigate = useNavigate()
    const matches = useMediaQuery('(max-width:600px)');
    const [coins, setCoins] = useState([])
    const userDetails = useStoreState(state => state.user.userDetails)
    const {data, loading} = useQuery(GET_ALL_COINS)

    const handleProfileMenuOpen = () => {
        navigate('/profile')
    };

    useEffect(() => {
        if (data && data.coins) {
            setCoins(data.coins)
        }
    }, [data, loading])


    return (<Box sx={{flexGrow: 1}}>
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{mr: 2, ...(open && {display: 'none'}),}}
                onClick={onClick}
            >
                <MenuIcon/>
            </IconButton>
            <Button variant="text" color={"primary"} disableRipple component={"div"}
                    onClick={() => {
                        navigate("/")
                    }}
            >{matches ? <img src={"/stonks-rocket.png"} height={60} alt={"stonks"}/> :
                <img src={"/stonks_logo_alt_white.png"} height={60}
                     alt={"stonks"}/>}

            </Button>

            <SearchBar coins={coins}/>
            <Box sx={{flexGrow: 1}}/>
            {userDetails && userDetails.id && <>
                <Box sx={{display: {xs: 'none', md: 'flex', alignItems: "center"}}}>
                    <div>
                        <NotificationBadge/>

                    </div>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <UserProfile/>
                    </IconButton>
                </Box>

            </>}
        </Toolbar>
    </Box>);
}

export default PrimaryAppBar
