import {gql} from "@apollo/client";

export const COIN_SUBSCRIPTION = gql`
    subscription Subscription($coinId: String, $coinIds: [String]) {
        marketData(coinId: $coinId, coinIds: $coinIds) {
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

`

