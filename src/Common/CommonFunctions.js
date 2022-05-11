const getDollarNumber = function (num) {
    if (num.toString().length <= 6) return num;
    let unit = Math.floor((num / 1.0e+1).toFixed(0).toString().length)
    let r = unit % 3
    let x = Math.abs(Number(num)) / Number('1.0e+' + (unit - r)).toFixed(2)
    return x.toFixed(2)
}
const getDollarText = function (num) {
    if (num.toString().length <= 6) return "";
    let units = ["M", "B", "T", "Q"]
    let unit = Math.floor((num / 1.0e+1).toFixed(0).toString().length)
    return units[Math.floor(unit / 3) - 2]
}
const updateCoin = function (existingCoin, updatedCoinData) {
    const newCoin = {...existingCoin}
    newCoin.coins_market_data.currentPrice = updatedCoinData.currentPrice
    newCoin.coins_market_data.priceChange24h = updatedCoinData.priceChange24h
    newCoin.coins_market_data.priceChangePercentage24h = updatedCoinData.priceChangePercentage24h
    newCoin.coins_market_data.high24 = updatedCoinData.high24
    newCoin.coins_market_data.low24 = updatedCoinData.low24
    newCoin.coins_market_data.marketCap = updatedCoinData.marketCap
    newCoin.coins_market_data.rank = updatedCoinData.rank
    newCoin.coins_market_data.totalActiveCoins = updatedCoinData.totalActiveCoins
    newCoin.coins_market_data.totalCoins = updatedCoinData.totalCoins
    newCoin.coins_market_data.totalVolume = updatedCoinData.totalVolume
    newCoin.coins_market_data.sparkline = updatedCoinData.sparkline
    return newCoin
}

export {getDollarText, getDollarNumber, updateCoin};