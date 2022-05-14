import * as React from 'react';
import {useEffect, useState} from 'react';
import {alpha, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {Avatar, Button, useMediaQuery} from "@mui/material";
import {useStoreState} from "easy-peasy";
import {useNavigate} from "react-router-dom";
import Color from "color";
import {useQuery} from "@apollo/client";
import {GET_ALL_COINS} from "../../graphql/queries";
import SearchBar from "./SearchBar";
import {getAuth, signOut} from "firebase/auth";
import {toast} from "react-toastify";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3), width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit', '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0), // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            backgroundColor: stringToColor(name),
            color: Color(stringToColor(name)).isLight() ? "black" : "white"
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const PrimaryAppBar = ({onClick, open}) => {
    const navigate = useNavigate()
    const matches = useMediaQuery('(max-width:600px)');
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [coins, setCoins] = useState([])
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const userDetails = useStoreState(state => state.user.userDetails)
    const {data, loading, error} = useQuery(GET_ALL_COINS)

    const handleAuth = () => {
        if (userDetails && userDetails.id) {
            const auth = getAuth()
            signOut(auth).then(() => {
                navigate("/")
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

    useEffect(() => {
        if (data && data.coins) {
            setCoins(data.coins)
        }
    }, [data, loading])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (<Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top', horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top', horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleAuth}>Logout</MenuItem>
    </Menu>);

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (<Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
            vertical: 'top', horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
            vertical: 'top', horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
    >
        <MenuItem>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                    <MailIcon/>
                </Badge>
            </IconButton>
            <p>Messages</p>
        </MenuItem>
        <MenuItem>
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
            >
                <Badge badgeContent={17} color="primary">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
            >
                <Avatar {...stringAvatar(`${userDetails.firstName} ${userDetails.lastName}`)} />
            </IconButton>
            <p>Profile</p>
        </MenuItem>
    </Menu>);

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
            >{
                matches ?
                    <img src={"/stonks-rocket.png"} height={60} alt={"stonks"}/> :
                    <img src={"/stonks_logo_alt_white.png"} height={60}
                         alt={"stonks"}/>
            }
                {/*<Typography*/}
                {/*    variant="h6"*/}
                {/*    noWrap*/}
                {/*    component="div"*/}
                {/*    sx={{display: {xs: 'none', sm: 'block'}}}*/}
                {/*>*/}
                {/*    Stonks*/}
                {/*</Typography>*/}

            </Button>
            {/*<Search>*/}
            {/*    <SearchIconWrapper>*/}
            {/*        <SearchIcon/>*/}
            {/*    </SearchIconWrapper>*/}
            {/*    <StyledInputBase*/}
            {/*        placeholder="Search…"*/}
            {/*        inputProps={{'aria-label': 'search'}}*/}
            {/*    />*/}
            {/*</Search>*/}
            <SearchBar coins={coins}/>
            <Box sx={{flexGrow: 1}}/>
            {userDetails && userDetails.id && <>
                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={17} color="primary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar {...stringAvatar(`${userDetails.firstName} ${userDetails.lastName ?? "."}`)} />

                    </IconButton>
                </Box>
                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon/>
                    </IconButton>
                </Box>
            </>
            }
        </Toolbar>
        {renderMobileMenu}
        {renderMenu}
    </Box>);
}
export default PrimaryAppBar
