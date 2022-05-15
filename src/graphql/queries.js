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

export const GET_COIN = gql`
    query Coin($coinId: String!) {
        coin(id: $coinId) {
            id
            name
            symbol
            image
            coins_market_data {
                id
                currentPrice
                priceChange24h
                priceChangePercentage24h
                priceChangePercentage1h
                priceChangePercentage7d
                priceChangePercentage30d
                priceChangePercentage1y
                high24
                low24
                marketCap
                rank
                totalActiveCoins
                totalCoins
                totalVolume
                sparkline
            }
        }
    }
`

export const GET_ALL_COINS = gql`
    query Coins {
        coins {
            id
            name
            symbol
            image
            coins_market_data {
                id
                currentPrice
                priceChange24h
                priceChangePercentage24h
                priceChangePercentage1h
                priceChangePercentage7d
                priceChangePercentage30d
                priceChangePercentage1y
                high24
                low24
                marketCap
                rank
                totalActiveCoins
                totalCoins
                totalVolume
                sparkline
            }
        }
    }
`

export const GET_CHART = gql`
    query CoinChart($coinChartId: String!, $days: String!, $interval: String!) {
        coinChart(id: $coinChartId, days: $days, interval: $interval) {
            date
            price
            marketCap
            volume
            open
            high
            low
            close
        }
    }
`

export const USER_COIN_BY_COIN_ID = gql`
    query User($userId: String!, $coinId: String) {
        userCoins(userId: $userId,coinId: $coinId) {
            id
            quantity
            totalPrice
            userId
            coinId,
        }
    }
`

export const ALL_USER_COINS = gql`
    query UserCoins($userId: String!) {
        userCoins(userId: $userId) {
            id
            quantity
            totalPrice
            userId
            coinId
            coins_static {
                id
                name
                symbol
                image
                coins_market_data {
                    id
                    currentPrice
                    priceChange24h
                    priceChangePercentage24h
                    priceChangePercentage1h
                    priceChangePercentage7d
                    priceChangePercentage30d
                    priceChangePercentage1y
                    high24
                    low24
                    marketCap
                    rank
                    totalActiveCoins
                    totalCoins
                    totalVolume
                    sparkline
                }
            }
        }
    }
`

export let GET_USER = gql`query Query($userId: String!) {
    user(id: $userId) {
        email
        firstName
        lastName
        phoneNumber
    }
}`

export const USER_COIN_NOTIFICATION = gql`
    query userCoinNotification($coinId: String, $userId: String!) {
        notifications(coinId: $coinId, userId: $userId) {
            id
            userId
            coinId
            topic
            updatedAt
            condition {
                gt
                lt
                eq
            }
            isActive
            updatedAt
            coin {
                id
                name
            }
        }
    }

`
export const GET_NOTIFICATION_LOGS = gql`
    query NotificationLogs($userId: String!) {
        notificationLogs(userId: $userId) {
            id
            notificationId
            topic
            data {
                coinId
                coinIcon
            }
            notification {
                title
                body
            }
            createdAt
        }
    }`
