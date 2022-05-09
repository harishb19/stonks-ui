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
import Wallet from "./Components/Wallet/Wallet";
import Profile from "./Components/Profile/Profile";
import Coin from "./Components/Coins/Coin";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import PageNotFound from "./Components/Error/PageNotFound";

const theme = createTheme({
    palette: {
        mode: 'dark', primary: {
            main: '#1976d2',
        },
    },
});

function App() {

    const graphQlUri = "stonk-backend.herokuapp.com"

    const httpLink = new HttpLink({
        uri: `https://${graphQlUri}/graphql`,
    });
    const wsLink = new GraphQLWsLink(createClient({
        url: `wss://${graphQlUri}/graphql`,
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
                            <CssBaseline/>
                            <AuthProvider>
                                <NavWrapper>
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/wallet" element={<Wallet/>}/>
                                        <Route path="/profile" element={<Profile/>}/>
                                        <Route path="/coins/:id" element={<Coin/>}/>
                                        <Route path="/auth/login" element={<Login/>}/>
                                        <Route path="/auth/signup" element={<Signup/>}/>
                                        <Route path="*" element={<PageNotFound/>}/>
                                    </Routes>
                                </NavWrapper>
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
                        </ThemeProvider>
                    </Fragment>
                </ApolloProvider>
            </ErrorBoundary>
        </StoreProvider>

    </div>);
}

export default App;
