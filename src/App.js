import './App.css';
import {Route, Routes} from "react-router-dom";
import React, {Fragment, useEffect} from 'react'
import {StoreProvider} from "easy-peasy";
import store from "./store/storeProvider";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";
import ErrorBoundary from "./Components/Error/ErrorBoundary";
import AuthProvider from "./Components/Auth/AuthProvider";
import NavWrapper from "./Components/Nav/NavWrapper";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Coin from "./Components/Coins/Coin";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import PageNotFound from "./Components/Error/PageNotFound";
import {blackColor, disabledPinkColor, downColor, pinkColor, upColor} from "./Common/Colors";
import ProtectedRoutes from "./Components/Auth/ProtectedRoutes";
import LoginCheck from "./Components/LoginCheck";
import WalletFetchUser from "./Components/Wallet/WalletFetchUser";
import NotificationToast from "./Components/Notification/NotificationToast";
import {ToastProvider} from "react-toast-notifications";
import NotificationCenter from "./Components/Notification/NotificationCenter";

const theme = createTheme({
    palette: {
        mode: 'dark', primary: {
            main: pinkColor,
        }, secondary: {
            main: pinkColor,
        }, success: {
            main: upColor
        }, error: {
            main: downColor
        }, background: {
            paper: blackColor,
        }, action: {
            disabledBackground: disabledPinkColor, disabled: "#a8a8a8"
        }
    },
});

function App() {
    // PROD URLS
    const GRAPH_URL = "https://stonk-backend.herokuapp.com/graphql"
    const WSS_URL = "wss://stonk-backend.herokuapp.com/graphql"
    // DEV URLS
    const GRAPH_DEV_URL = "http://localhost:3002/graphql"
    const WSS_DEV_URL = "ws://localhost:3002/graphql"
    const httpLink = new HttpLink({
        uri: GRAPH_URL,
    });
    const wsLink = new GraphQLWsLink(createClient({
        url: WSS_URL,
    }))

    const splitLink = split(({query}) => {
        const definition = getMainDefinition(query);
        return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription');
    }, wsLink, httpLink,)


    const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('stonks69');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers, authorization: token ? `${token}` : "",
            }
        }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const client = new ApolloClient({
        cache: new InMemoryCache(), link: authLink.concat(splitLink)
    });


    useEffect(() => {

        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }


    }, []);

    return (<div className="App">
        <StoreProvider store={store}>
            <ErrorBoundary>
                <ApolloProvider client={client}>
                    <Fragment>
                        <ThemeProvider theme={theme}>
                            <ToastProvider
                                autoDismiss
                                autoDismissTimeout={10000}
                                placement={"top-center"}
                                components={{Toast: NotificationToast}}>
                                <CssBaseline/>
                                <AuthProvider>
                                    <NavWrapper>
                                        <Routes>
                                            <Route path="/" element={<Home/>}/>
                                            <Route path="/wallet" element={<ProtectedRoutes>
                                                <WalletFetchUser/>
                                            </ProtectedRoutes>}/>
                                            <Route path="/profile" element={<ProtectedRoutes>
                                                <Profile/>
                                            </ProtectedRoutes>}/>
                                            <Route path="/coins/:id" element={<Coin/>}/>
                                            <Route path="/auth/login" element={<LoginCheck><Login/></LoginCheck>}/>
                                            <Route path="/auth/signup" element={<LoginCheck><Signup/></LoginCheck>}/>
                                            <Route path="*" element={<PageNotFound/>}/>
                                        </Routes>
                                    </NavWrapper>
                                    <NotificationCenter/>
                                </AuthProvider>
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={5000}
                                    hideProgressBar
                                    newestOnTop
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                />
                            </ToastProvider>
                        </ThemeProvider>
                    </Fragment>
                </ApolloProvider>
            </ErrorBoundary>
        </StoreProvider>

    </div>);
}

export default App;
