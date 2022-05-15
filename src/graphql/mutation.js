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

export const INSERT_NOTIFICATIONS = gql`
    mutation Mutation($input: NotificationInput!) {
        createNotification(input: $input) {
            id
            userId
            coinId
            topic
            condition {
                gt
                lt
                eq
            }
            isActive
            updatedAt
        }
    }
`
export const UPDATE_NOTIFICATIONS = gql`
    mutation UpdateNotification($id: String!, $userId: String!, $condition: NotificationConditionInput!) {
        updateNotification(id: $id, userId: $userId, condition: $condition) {
            id
            userId
            coinId
            topic
            condition {
                gt
                lt
                eq
            }
            isActive
            updatedAt
        }
    }
`

export const GET_TOPICS = gql`
    mutation SubscribeToTopic($userId: String!, $token: String!, $topics: [String]!) {
        subscribeToTopic(userId: $userId, token: $token, topics: $topics)
    }
`

export const DELETE_NOTIFICATIONS = gql`
    mutation Mutation($id: String!, $userId: String!) {
        deleteNotification(id: $id, userId: $userId) {
            id
            isActive
        }
    }
`
export const DELETE_NOTIFICATION_LOGS = gql`
    mutation Mutation($id: String!, $userId: String!) {
        deleteNotificationLogs(id: $id, userId: $userId) {
            id
        }
    }
`


