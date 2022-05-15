import {useEffect} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {toast} from "react-toastify";
import {useMutation} from "@apollo/client";
import {GET_TOPICS} from "../../graphql/mutation";
import {getToken, onMessage} from 'firebase/messaging'
import {useToasts} from "react-toast-notifications";

const NotificationProvider = ({messaging}) => {
    const {addToast} = useToasts()

    const [getNotification] = useMutation(GET_TOPICS)

    const userDetails = useStoreState(state => state.user.userDetails)
    const setNotifications = useStoreActions(actions => actions.notifications.setNotifications)

    useEffect(() => {

        if (userDetails && userDetails.id && messaging) {


            getToken(messaging, {vapidKey: "BEhMPpZEG_5JxY2LnftmH5mDSPFZD5QyMw0FOKw-NRdV32xNi4lPbUJhehoqvO8gYF44-j2shC6Ha593G7B7Fto"}).then((currentToken) => {
                if (currentToken) {
                    console.log(currentToken)
                    let topics = [`price-${userDetails.id}-eq`, `high-${userDetails.id}-eq`, `low-${userDetails.id}-eq`, `price-${userDetails.id}-gt`, `high-${userDetails.id}-gt`, `low-${userDetails.id}-gt`, `price-${userDetails.id}-lt`, `high-${userDetails.id}-lt`, `low-${userDetails.id}-lt`,]
                    getNotification({
                        variables: {
                            token: currentToken, topics, userId: userDetails.id
                        }
                    }).then((e) => {
                        console.log("sub", e.data)
                        console.log("ok", messaging)
                        onMessage(messaging, (payload) => {
                            console.log('Message received. ', payload);
                            addToast({
                                title: payload.notification.title,
                                body: payload.notification.body, ...payload.data
                            }, {
                                autoDismiss: true,
                            })
                            setNotifications(payload)
                            // toast(`${payload.notification.body}`, {
                            //     position: "bottom-left",
                            //     autoClose: false,
                            //     hideProgressBar: false,
                            //     closeOnClick: true,
                            //     pauseOnHover: true,
                            //     draggable: true,
                            //     progress: undefined,
                            // });


                        })
                    }).catch((e) => {
                        console.log(JSON.stringify(e))
                    })

                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            }).catch((err) => {
                toast.error(`Notification permission required `, {
                    position: "bottom-right",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                console.log('An error occurred while retrieving token. ', err);
            });

        }
    }, [messaging, userDetails, setNotifications])

    return null
}

export default NotificationProvider
