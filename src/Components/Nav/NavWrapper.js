import * as React from 'react';
import {useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PrimaryAppBar, {NotificationBadge, UserProfile} from "./PrimaryAppBar";
import {AccountBalanceWallet, AccountCircle, Home, Login, Logout, Settings} from "@mui/icons-material";
import {useStoreState} from "easy-peasy";
import Toolbar from "@mui/material/Toolbar";
import {Button, Tooltip, useMediaQuery} from "@mui/material";
import {getAuth, signOut} from "firebase/auth";
import {toast} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import SettingsDialog from "../Settings/SettingsDialog";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth, transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen,
    }), overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
    }), overflowX: 'hidden', width: `calc(${theme.spacing(7)} + 1px)`, [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: theme.spacing(0, 1), // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1, transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
    }), ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    width: drawerWidth, flexShrink: 0, whiteSpace: 'nowrap', boxSizing: 'border-box', ...(open && {
        ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme),
    }), ...(!open && {
        ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme),
    }),
}),);

const NormalNav = ({children}) => {
    const theme = useTheme();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const userDetails = useStoreState(state => state.user.userDetails)
    const [openSettings, setOpenSettings] = useState(false)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawer = () => {
        setOpen((val) => !val);
    };
    const handleAuth = () => {
        if (userDetails && userDetails.id) {
            const auth = getAuth()
            signOut(auth).then(() => {
                navigate("/")
                window.location.reload();
                toast.success(`See you soon!`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })

            }).catch((error) => {
                console.log(error)
                toast.error(`Error logging out`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            });

        } else {
            navigate("/auth/login")
        }
    }
    return (<Box sx={{display: 'flex'}}>
        <AppBar position="fixed" open={open}>
            <PrimaryAppBar onClick={handleDrawer} open={open}/>
        </AppBar>
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawer} aria-label={'close'}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <List>
                <ListItemButton
                    sx={{
                        minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                    }}
                    onClick={() => navigate("/")}
                >
                    <Tooltip title={"Home"}  placement={"right"}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                            }}
                        >
                            <Home/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={"Home"} sx={{opacity: open ? 1 : 0}}/>
                </ListItemButton>

                {userDetails && userDetails.id && <>

                    <ListItemButton
                        sx={{
                            minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                        }}
                        onClick={() => navigate("/wallet")}
                    >
                        <Tooltip title={"Wallet"}  placement={"right"}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                                }}
                            >
                                <AccountBalanceWallet/>
                            </ListItemIcon>
                        </Tooltip>
                        <ListItemText primary={"Wallet"} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>

                    <ListItemButton
                        sx={{
                            minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                        }}
                        onClick={() => navigate("/profile")}
                    >
                        <Tooltip title={"Profile"} placement={"right"}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                                }}
                            >
                                {isMobile ? <UserProfile/> : <AccountCircle/>}

                            </ListItemIcon>
                        </Tooltip>
                        <ListItemText primary={"Profile"} sx={{opacity: open ? 1 : 0}}/>
                    </ListItemButton>

                    <NotificationBadge sideMenu={true} open={open}/>
                </>}

                <ListItemButton
                    sx={{
                        minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                    }}
                    onClick={() => setOpenSettings(true)}
                >
                    <Tooltip title={"Settings"}  placement={"right"}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                            }}
                        >
                            <Settings/>
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={"Settings"} sx={{opacity: open ? 1 : 0}}/>
                </ListItemButton>
                <SettingsDialog open={openSettings} setOpen={setOpenSettings}/>
            </List>
            <Divider/>
            <List sx={{marginTop: "auto",}}>
                <ListItemButton
                    sx={{
                        minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                    }}
                    onClick={handleAuth}
                >
                    <Tooltip title={userDetails && userDetails.id ? "Logout" : "Login / signup"} placement={"right"}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center',
                            }}
                        >
                            {userDetails && userDetails.id ? <Logout color={"error"}/> : <Login/>}

                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={userDetails && userDetails.id ? "Logout" : "Login / signup"}
                                  sx={{opacity: open ? 1 : 0}}/>
                </ListItemButton>
            </List>
        </Drawer>
        <Box component="main" sx={{flexGrow: 1, minHeight: "100vh"}}>
            <DrawerHeader/>
            {children}
        </Box>
    </Box>);
}
const AuthNav = ({children}) => {
    const navigate = useNavigate()
    const matches = useMediaQuery('(max-width:600px)');

    return (<>
        <AppBar position="fixed">
            <Box sx={{flexGrow: 1}}>
                <Toolbar>
                    <Button variant="text" color={"primary"} disableRipple component={"div"}
                            onClick={() => {
                                navigate("/")
                            }}
                    >
                        {matches ? <img src={"/stonks-rocket.png"} height={60} alt={"stonks"}/> :
                            <img src={"/stonks_logo_alt_white.png"} height={60}
                                 alt={"stonks"}/>}
                    </Button>

                </Toolbar>

            </Box>
        </AppBar>
        <Box component="main" sx={{flexGrow: 1, minHeight: "100vh"}}>
            <DrawerHeader/>
            {children}
        </Box>
    </>)
}
const NavWrapper = ({children}) => {
    const history = useLocation()
    if (history.pathname.match("/auth")) {
        return <AuthNav>{children}</AuthNav>
    }
    return <NormalNav>{children}</NormalNav>
}
export default NavWrapper
