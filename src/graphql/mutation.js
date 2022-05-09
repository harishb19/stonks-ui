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
