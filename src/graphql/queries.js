import {gql} from "@apollo/client";

export const LOGIN_USER = gql`
    mutation Login($token: String!) {
        login(token: $token) {
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
