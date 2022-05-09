import {gql} from "@apollo/client"
export let ADD_USER_COIN = gql`mutation Mutation($userId: String!, $coinId: String!, $quantity: Int!, $price: Float!) {
    addUserCoin(userId: $userId, coinId: $coinId, quantity: $quantity, price: $price) {
        id
        quantity
        totalPrice
        userId
        coinId
    }
}`

export let UPDATE_USER_COIN = gql`mutation UpdateUserCoin($updateUserCoinId: String!, $userId: String!, $quantity: Int!, $price: Float!) {
    updateUserCoin(id: $updateUserCoinId, userId: $userId, quantity: $quantity, price: $price) {
        id
        quantity
        totalPrice
        userId
        coinId
    }
}`

export let DELETE_USER_COIN = gql`mutation DeleteUserCoin($deleteUserCoinId: String!, $userId: String!) {
    deleteUserCoin(id: $deleteUserCoinId, userId: $userId) {
        id
        quantity
        totalPrice
        userId
        coinId
    }
}`

export let GET_USER = gql`query Query($userId: String!) {
    user(id: $userId) {
        email
        firstName
        lastName
        phoneNumber
    }
}`

// export let UPDATE_USER = gql``