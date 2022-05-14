import {action, createStore} from "easy-peasy";

const store = createStore({
    user: {
        userDetails: {}, setUserDetails: action(((state, payload) => {
            state.userDetails = payload
        })),
    },
    settings: {
        numberStyle: 2,
        setNumberStyle: action((state, payload) => {
            state.numberStyle = payload;
        }),
    }
})
export default store
