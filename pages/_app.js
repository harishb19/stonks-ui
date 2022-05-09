import '../styles/globals.css'
import {Fragment, useEffect, useState} from "react";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split} from "@apollo/client";
import {WebSocketLink} from "@apollo/link-ws";
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {initializeApp} from 'firebase/app';
import {deleteUser, getAuth} from "firebase/auth";
import {StoreProvider} from "easy-peasy";
import {createTheme, ThemeProvider} from "@mui/material";
import {orange} from "@mui/material/colors";
import ErrorBoundary from "../component/common/error/ErrorBoundary";
import Loading from "../component/common/loading/Loading";
import store from "../store/storeProvider";
import {firebaseConfig} from "../config/firebase";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    status: {
        danger: orange[500],
    },
});

function MyApp({Component, pageProps}) {
    const [loading, setLoading] = useState(true)
    const graphQlUri = process.env.GRAPHQL_URL
    //todo: change all graphql related new links
    const httpLink = new HttpLink({
        uri: `https://${graphQlUri}/v1/graphql`,
    });


    const wsLink = process.browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
        uri: `wss://${graphQlUri}/v1/graphql`, options: {
            reconnect: false,
        }
    }) : null;

    const splitLink = process.browser ? split( //only create the split in the browser
        // split based on operation type
        ({query}) => {
            const {kind, operation} = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        }, wsLink, httpLink,) : httpLink;

    const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('stonks69');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers, authorization: token ? `Bearer ${token}` : "",
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

        let firebaseInit = initializeApp(firebaseConfig)

        if (firebaseInit) {
            const auth = getAuth(firebaseInit)
            let unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log(user)
                    user.getIdTokenResult(true) // 1
                        .then((idTokenResult) => {
                            if ("https://hasura.io/jwt/claims" in idTokenResult.claims && idTokenResult.claims['https://hasura.io/jwt/claims'] !== null) {
                                localStorage.setItem("stonks69", idTokenResult.token)
                                client.query({
                                    query: CHECK_USER, variables: {
                                        token: idTokenResult.token,
                                    }
                                }).then(({data, loading, error}) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                    if (!loading && data && data.adminLogin) {
                                        let user = {...data.users}
                                        if (user) {
                                            store.getActions().user.setUserDetails({...user})
                                            toast.success(`Welcome back ${user.name}`, {
                                                position: "bottom-right",
                                                autoClose: 2000,
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,

                                            })

                                        }
                                    }
                                    setLoading(false)
                                }).catch((error) => {
                                    setLoading(false)
                                    console.log(error.message)
                                })
                            } else {
                                deleteUser(user).then(() => {
                                    toast.error(`User not found`, {
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
                                })
                                auth.signOut().then(() => {
                                    setLoading(false)
                                    localStorage.setItem("stonks69", "")
                                    sessionStorage.clear()
                                })

                            }
                        })

                } else {
                    setLoading(false)
                    store.getActions().user.setUserDetails({})
                    localStorage.setItem("stonks69", "")
                }
            })
            return (() => {
                unsubscribe()
            })
        }

    }, [])

    if (loading) return <Loading/>
    return <StoreProvider store={store}>
        <ErrorBoundary>
            <ApolloProvider client={client}>
                <Fragment>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Fragment>
            </ApolloProvider>
        </ErrorBoundary>
    </StoreProvider>
}

export default MyApp
