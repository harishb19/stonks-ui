import {action, createStore} from "easy-peasy";

const store = createStore({
    user: {
        userDetails: {}, setUserDetails: action(((state, payload) => {
            state.userDetails = payload
        })),
    },
})
export default store
