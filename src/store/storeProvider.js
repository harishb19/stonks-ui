import {action, createStore} from "easy-peasy";

const store = createStore({
    user: {
        userDetails: {},
        setUserDetails: action((state, payload) => {
            state.userDetails = payload;
        }),
        isPasswordProvider: false,
        setIsPasswordProvider: action((state, payload) => {
            state.isPasswordProvider = payload;
        }),
        userImage: "",
        setUserImage: action((state, payload) => {
            state.userImage = payload;
        }),
    },
    notifications: {
        notifications: [],
        setNotificationsArray: action((state, payload) => {
            let old = state.notifications;
            state.notifications = [...old, ...payload];
        }),
        setNotifications: action((state, payload) => {
            if (state.notifications) {
                let obj = state.notifications;
                let newObj = [];
                obj.forEach((ent) => {
                    if (payload && payload.id && ent.id === payload.id) {
                        newObj.push({...payload});
                    } else {
                        newObj.push({...ent});
                    }
                });
                state.notifications = newObj;
            } else {
                state.notifications.push(payload);
            }
        }),
        openNotifications: false,
        setOpenNotifications: action((state, payload) => {
            state.openNotifications = payload;
        }),
    },
});
export default store;
