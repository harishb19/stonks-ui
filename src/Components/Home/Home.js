import {useQuery, useSubscription} from "@apollo/client";
import {GET_ALL_COINS} from "../../graphql/queries";
import {useEffect, useState} from "react";
import {Box, Stack, Typography} from "@mui/material";
import coinStyle from "../Coins/css/coin.module.css"
import homeStyle from "./css/home.module.css"
import NumberFormat from "react-number-format";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import PriceUpDown from "../Common/PriceUpDown";
import CoinGrid from "../Common/CoinGrid";
import {Link} from "react-router-dom";
import {COIN_SUBSCRIPTION} from "../../graphql/subscription";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";


const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");
const coinBox = (id, title, name, value, image) => <Link to={`/coins/${id}`}>
    <Box className={homeStyle.frostedBox} sx={{margin:"10px"}}>
        <Typography variant={"subtitle1"} component={"p"}>
            {title}
        </Typography>
        <Stack direction={"row"} spacing={2} sx={{marginTop: '5px'}}>
            <img src={image} alt={name} className={homeStyle.boxImage} onError={onMediaFallback}/>
            <Typography variant={"body1"} component={"p"}>
                {name}
            </Typography>
            <PriceUpDown fontSize={"1em"} arrow={false}
                         value={value}/>
        </Stack>
    </Box>
</Link>

const coinTotalBox = (id, title, name, value, image) => <Link to={`/coins/${id}`}>
    <Box className={homeStyle.frostedBox} sx={{margin:"10px"}}>
        <Typography variant={"subtitle1"} component={"p"}>
            {title}
        </Typography>
        <Stack direction={"row"} spacing={2} alignItems={"center"}
               sx={{marginTop: '5px'}}>
            <img src={image} alt={name} className={homeStyle.boxImage} onError={onMediaFallback}/>
            <Typography variant={"body1"} component={"p"}>
                {name}
            </Typography>
            <NumberFormat displayType={'text'}

                          value={getDollarNumber(value)}
                          thousandSeparator={true}
                          decimalScale={2}
                          prefix="$" decimalSeparator="."
                          suffix={getDollarText(value)}/>
        </Stack>
    </Box>
</Link>

const totalBox = (title, value) =>
    <Box className={homeStyle.frostedBoxNoClick} sx={{margin:"10px"}}>
        <Typography variant={"subtitle1"} component={"p"} sx={{marginBottom: '5px'}}>
            {title}
        </Typography>
        <NumberFormat displayType={'text'}
                      value={getDollarNumber(value)}
                      thousandSeparator={true}
                      decimalScale={2}
                      prefix="$" decimalSeparator="."
                      suffix={getDollarText(value)}
                      className={coinStyle.marketCap}/>
    </Box>

const Home = () => {
    const [coins, setCoins] = useState(null)
    const [topGainer, setTopGainer] = useState(null)
    const [topLoser, setTopLoser] = useState(null)
    const [topMarketCap, setTopMarketCap] = useState(null)
    const [topVolume, setTopVolume] = useState(null)
    const [totalMarketCap, setTotalMarketCap] = useState(null)
    const [totalVolume, setTotalVolume] = useState(null)
    const {data: coinData, loading: coinLoading, error: coinError, refetch} = useQuery(GET_ALL_COINS);
    const {data: updateCoinData} = useSubscription(COIN_SUBSCRIPTION);

    useEffect(() => {
        if (coinData) {
            setCoins(coinData.coins);
            let topG = coinData.coins[0], totalMarketCap = 0, totalVol = 0, topL = coinData.coins[0],
                topM = coinData.coins[0], topV = coinData.coins[0];
            for (let coin of coinData.coins) {
                totalMarketCap += coin.coins_market_data.marketCap
                totalVol += coin.coins_market_data.totalVolume
                if (coin.coins_market_data.priceChangePercentage24h > topG.coins_market_data.priceChangePercentage24h) {
                    topG = coin
                }
                if (coin.coins_market_data.priceChangePercentage24h < topL.coins_market_data.priceChangePercentage24h) {
                    topL = coin
                }
                if (coin.coins_market_data.marketCap > topM.coins_market_data.marketCap) {
                    topM = coin
                }
                if (coin.coins_market_data.totalVolume > topV.coins_market_data.totalVolume) {
                    topV = coin
                }
            }
            setTopGainer(topG)
            setTopLoser(topL)
            setTopMarketCap(topM)
            setTopVolume(topV)
            setTotalMarketCap(totalMarketCap)
            setTotalVolume(totalVol)
        }
    }, [coinData])

    useEffect(() => {
        if (updateCoinData && updateCoinData.marketData && coins !== null && coins.length > 0) {
            setCoins((cns) => {
                return cns.map(item =>
                {
                    const updateCoin = updateCoinData.marketData.find(x => x.id === item.id)
                    if (updateCoin){
                        return {...item,
                            coins_market_data : {
                            ...item.coins_market_data,
                            currentPrice: updateCoin.currentPrice,
                            priceChange24h: updateCoin.priceChange24h,
                            priceChangePercentage24h: updateCoin.priceChangePercentage24h,
                            high24: updateCoin.high24,
                            low24: updateCoin.low24,
                            totalVolume: updateCoin.totalVolume,
                            sparkline: updateCoin.sparkline
                        }
                        };
                    }
                    return item;
                });
            });
        }
    }, [updateCoinData])

    if (coinLoading) return <Loading/>
    if (coinError) return <Error message={coinError.message} onClick={refetch}/>

    if(coins) {
        return <div className={homeStyle.radialBG}>
            <Stack direction={"column"} spacing={3} sx={{padding: "30px"}}>
                <Typography variant={"h4"} component={"p"} textAlign={"center"} marginTop={"20px"}>All
                    Cryptocurrencies</Typography>
                <Stack direction={{xs:"column", sm:"row"}} sx={{margin: "10px"}} flexWrap={"wrap"}>
                    {coinBox(topGainer.id, "Top Gainer", topGainer.name, topGainer.coins_market_data.priceChangePercentage24h, topGainer.image)}
                    {coinBox(topLoser.id, "Top Loser", topLoser.name, topLoser.coins_market_data.priceChangePercentage24h, topLoser.image)}
                    {coinTotalBox(topLoser.id, "Top Market Cap", topMarketCap.name, topMarketCap.coins_market_data.marketCap, topMarketCap.image)}
                    {coinTotalBox(topLoser.id, "Top Volume", topVolume.name, topVolume.coins_market_data.totalVolume, topVolume.image)}
                    {totalBox("Total Market Cap", totalMarketCap)}
                    {totalBox("Total Volume", totalVolume)}
                </Stack>
                <CoinGrid coins={coins}/>
            </Stack>
        </div>
    }
    return <div>Home</div>
}

export default Home;