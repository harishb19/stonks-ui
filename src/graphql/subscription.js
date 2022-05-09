import {gql} from "@apollo/client";

export const TEST = gql`

    subscription Subscription {
        marketData {
            id
        }
    }
`
