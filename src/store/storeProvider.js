import {action, createStore} from "easy-peasy";

const store = createStore({
    user: {
        userDetails: {}, setUserDetails: action((state, payload) => {
            state.userDetails = payload;
        }), isPasswordProvider: false, setIsPasswordProvider: action((state, payload) => {
            state.isPasswordProvider = payload;
        }), userImage: "", setUserImage: action((state, payload) => {
            state.userImage = payload;
        }),
    }, notifications: {
        notifications: [], deleteNotificationsArray: action((state, payload) => {
            if (state.notifications && state.notifications.length > 0) {
                let localNotif = [...state.notifications]
                let index = localNotif.findIndex(not => not.id === payload)
                if (index !== -1) {
                    localNotif.splice(index, 1)
                }
                if (localNotif.length > 0) {
                    state.notifications = [...localNotif];
                }else {
                    state.notifications=[]
                }
            }
        }), setNotificationsArray: action((state, payload) => {
            let old = state.notifications;
            state.notifications = [...old, ...payload];
        }), setNotifications: action((state, payload) => {
            state.notifications.push(payload);
        }), setNewNotifications: action((state, payload) => {
            state.notifications = payload
        }), openNotifications: false, setOpenNotifications: action((state, payload) => {
            state.openNotifications = payload;
        }),
    },
});
export default store;
