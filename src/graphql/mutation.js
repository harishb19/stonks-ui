import {gql} from "@apollo/client";

export const SIGNUP_USER = gql`
    mutation Mutation($firstName: String!, $lastName: String!, $email: String!, $firebaseUid: String!, $phoneNumber: String!) {
        signUp(firstName: $firstName, lastName: $lastName, email: $email, firebaseUid: $firebaseUid, phoneNumber: $phoneNumber) {
            id
            email
            firstName
            lastName
            phoneNumber
            createdAt
            updatedAt
            coins {
                id
                quantity
                totalPrice
                userId
                coinId
            }
        }
    }

`

export let ADD_USER_COIN = gql`mutation Mutation($userId: String!, $coinId: String!, $quantity: Int!, $price: Float!) {
    addUserCoin(userId: $userId, coinId: $coinId, quantity: $quantity, price: $price) {
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

export let UPDATE_USER_COIN = gql`mutation UpdateUserCoin($updateUserCoinId: String!, $userId: String!, $quantity: Int!, $price: Float!) {
    updateUserCoin(id: $updateUserCoinId, userId: $userId, quantity: $quantity, price: $price) {
        id
        quantity
        totalPrice
        userId
        coinId
    }
}`

export let UPDATE_USER = gql`mutation UpdateUser($updateUserId: String!, $firstName: String!, $lastName: String!, $email: String!, $phoneNumber: String!) {
    updateUser(id: $updateUserId, firstName: $firstName, lastName: $lastName, email: $email, phoneNumber: $phoneNumber) {
        id
        email
        firstName
        lastName
        phoneNumber
        createdAt
        updatedAt
        coins {
            id
            quantity
            totalPrice
            userId
            coinId
        }
    }
}`