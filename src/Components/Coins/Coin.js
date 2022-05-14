import {useQuery, useSubscription} from "@apollo/client";
import {useEffect, useState} from "react";
import CurrencyConverter from "../Common/CurrencyConverter";
import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {greyColor} from "../../Common/Colors";
import Color from "color";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import coinStyle from "./css/coin.module.css";
import {GET_CHART, GET_COIN} from "../../graphql/queries";
import {COIN_SUBSCRIPTION} from "../../graphql/subscription";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import {useParams} from "react-router-dom";
import ChartSelector from "../Chart/ChartSelector";
import Sparkline from "../Common/Sparkline";
import PriceUpDown from "../Common/PriceUpDown";
import ChartClass from "../Chart/ChartFunctional";
import AnimatedNumberWrapper from "../Common/AnimatedNumberWrapper";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import useScrollBlock from "../../Common/useScrollBlock";
import CoinsAction from "./CoinsAction";
import BlankCoin from "./BlankCoin";


const Coin = () => {
    const {id} = useParams()
    const [blockScroll, allowScroll] = useScrollBlock();

    const [chartData, setChartData] = useState(null)
    const [chartDuration, setChartDuration] = useState({days: "30", interval: "daily"})
    const [chartType, setChartType] = useState(0)
    const [coinDetails, setCoinDetails] = useState({});
    const {data: coinData, loading: coinLoading, error: coinError, refetch} = useQuery(GET_COIN, {
        variables: {coinId: id},
    });
    const {data: updateCoinData} = useSubscription(COIN_SUBSCRIPTION, {
        variables: {coinId: id},
    });
    const {data: chartRawData} = useQuery(GET_CHART, {
        variables: {coinChartId: id, days: chartDuration.days, interval: chartDuration.interval},
    });


    const changeChartType = (type) => {
        setChartType(type)
    }

    const changeChartDuration = (day, inter) => {
        console.log(day)
        setChartDuration({days: day, interval: inter})
    }

    const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");

    const stopScroll = () => {
        blockScroll()
    }
    const startScroll = () => {
        allowScroll()
    }

    useEffect(() => {
        if (coinData) {
            setCoinDetails(coinData.coin);
        }
    }, [coinData])


    useEffect(() => {
        if (updateCoinData && updateCoinData.marketData.length > 0) {
            setCoinDetails((coin) => ({
                ...coin, coins_market_data: {
                    ...coin.coins_market_data,
                    currentPrice: updateCoinData.marketData[0].currentPrice,
                    priceChange24h: updateCoinData.marketData[0].priceChange24h,
                    priceChangePercentage24h: updateCoinData.marketData[0].priceChangePercentage24h,
                    high24: updateCoinData.marketData[0].high24,
                    low24: updateCoinData.marketData[0].low24,
                    totalVolume: updateCoinData.marketData[0].totalVolume,
                    sparkline: updateCoinData.marketData[0].sparkline,
                }
            }));
        }
    }, [updateCoinData])

    useEffect(() => {
        if (chartRawData) {
            const cData = []
            for (let d of chartRawData.coinChart) {
                cData.push({
                    date: new Date(+d.date),
                    price: d.price,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close,
                    volume: d.volume,
                })
            }
            setChartData(cData);
        }
    }, [chartRawData])

    if (coinLoading) return <Loading/>
    if (coinError) return <Error message={coinError.message} onClick={refetch}/>
    if (coinDetails && coinDetails.id && coinDetails.coins_market_data) {
        return <div
            className={coinDetails.coins_market_data.priceChangePercentage24h > 0 ? coinStyle.radialBGUp : coinStyle.radialBGDown}>
            <Box className={coinStyle.frostedHeader}
                 sx={{
                     padding: '15px 0px 15px 30px',
                     // backgroundImage: coinDetails.coins_market_data.priceChangePercentage24h > 0 ? `linear-gradient(to right, #0F0F0F, #0F0F0F, ${Color(downColor).darken(0.6).alpha(0.1)})` : `linear-gradient(to right, #0F0F0F, #0F0F0F, ${Color(downColor).darken(0.6).alpha(0.2)})`,
                 }}>
                <Stack direction={"column"}>
                    <Grid flexGrow={1} container justifyContent={"space-between"}>
                        <Grid item xs={12} md={4}>
                            <Stack direction={"column"}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Link underline="hover" color="inherit" href="/" sx={{fontSize: "0.8em"}}>
                                        Home
                                    </Link>
                                    <Typography color="text.primary" fontSize={"0.8em"}>{coinDetails.name}</Typography>
                                </Breadcrumbs>
                                <Stack direction={"row"} sx={{marginTop: "20px"}} spacing={1}>
                                    <Stack direction={"column"} justifyContent={"space-around"}>
                                        <img src={coinDetails.image} alt={coinDetails.name}
                                             className={coinStyle.coinImage}
                                             onError={onMediaFallback} style={{marginBottom: '10px'}}/>
                                        <Stack direction={"column"}>
                                            <Typography variant={"body2"} color={greyColor} fontWeight={"500"}
                                                        textAlign={"center"}>
                                                {coinDetails.symbol.toUpperCase()}
                                            </Typography>
                                            <Typography variant={"body2"} color={greyColor} fontWeight={"500"}
                                                        textAlign={"center"}>
                                                Price
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction={"column"} justifyContent={"space-around"}>
                                        <Stack direction={"row"} alignItems={"baseline"} spacing={1}>
                                            <Typography component={"p"} fontWeight={"500"} fontSize={"3em"}
                                                        lineHeight={1}>
                                                {coinDetails.name}
                                            </Typography>
                                            <Typography component={"p"} color={greyColor}>
                                                {`(${coinDetails.symbol.toUpperCase()})`}
                                            </Typography>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1} alignItems={"baseline"}
                                               sx={{marginTop: "5px"}}>
                                            <AnimatedNumberWrapper
                                                value={coinDetails.coins_market_data.currentPrice}
                                                prefix="$"
                                                decimalScale={2}
                                                className={coinStyle.price}/>
                                            <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage24h}
                                                         fontSize={"1.5em"}
                                                         fontWeight={"500"}/>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <div className={coinStyle.sparkline}>
                                {coinDetails.coins_market_data.priceChangePercentage24h >= 0 &&
                                    <Sparkline id={coinDetails.id} data={coinDetails.coins_market_data.sparkline}
                                               decreaseDetail={false}
                                               height={200} lineTension={0.3}
                                               neutralUpDown={1}
                                               fill={true}/>}
                                {coinDetails.coins_market_data.priceChangePercentage24h < 0 &&
                                    <Sparkline id={coinDetails.id} data={coinDetails.coins_market_data.sparkline}
                                               decreaseDetail={false}
                                               height={200} lineTension={0.3}
                                               neutralUpDown={2}
                                               fill={true}/>}
                            </div>
                        </Grid>
                    </Grid>
                    <CoinsAction coinDetails={coinDetails}/>
                </Stack>
            </Box>
            <div style={{padding: '30px'}}>
                <Box className={coinStyle.frostedDiv}>
                    <Stack direction={"row"} spacing={1} justifyContent={"space-evenly"} flexWrap={"wrap"}>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                RANK
                            </Typography>
                            <Typography variant={"h6"} component={"p"}>
                                #{coinDetails.coins_market_data.rank}
                            </Typography>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                PRICE CHANGE (24H)
                            </Typography>
                            <PriceUpDown fontWeight={500} fontSize={"1.2em"}
                                         value={coinDetails.coins_market_data.priceChange24h} prefix={"$"}
                                         suffix={""}
                                         decimals={5} arrow={false}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                MARKET CAP
                            </Typography>
                            <AnimatedNumberWrapper displayType={'text'}
                                                   value={getDollarNumber(coinDetails.coins_market_data.marketCap)}
                                                   thousandSeparator={true}
                                                   decimalScale={5}
                                                   prefix="$" decimalSeparator="."
                                                   suffix={getDollarText(coinDetails.coins_market_data.marketCap)}
                                                   className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                VOLUME
                            </Typography>
                            <AnimatedNumberWrapper displayType={'text'}
                                                   value={getDollarNumber(coinDetails.coins_market_data.totalVolume)}
                                                   thousandSeparator={true}
                                                   decimalScale={5}
                                                   prefix="$" decimalSeparator="."
                                                   suffix={getDollarText(coinDetails.coins_market_data.totalVolume)}
                                                   className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                TOTAL COINS
                            </Typography>
                            <AnimatedNumberWrapper displayType={'text'}
                                                   value={getDollarNumber(coinDetails.coins_market_data.totalCoins)}
                                                   suffix={getDollarText(coinDetails.coins_market_data.totalCoins)}
                                                   thousandSeparator={true}
                                                   decimalScale={5}
                                                   decimalSeparator="." className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                ACTIVE COINS
                            </Typography>
                            <AnimatedNumberWrapper displayType={'text'}
                                                   value={getDollarNumber(coinDetails.coins_market_data.totalActiveCoins)}
                                                   suffix={getDollarText(coinDetails.coins_market_data.totalActiveCoins)}
                                                   thousandSeparator={true}
                                                   decimalScale={5}
                                                   decimalSeparator="." className={coinStyle.marketCap}/>
                        </Stack>
                        <div>
                            <Stack direction={"row"}>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1H
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage1h}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1D
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage24h}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1W
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage7d}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1M
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage30d}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1Y
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage1y}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                            </Stack>
                        </div>
                    </Stack>
                </Box>
                <Grid container alignItems={"start"} columnSpacing={8} sx={{marginTop: '30px'}}>
                    <Grid item md={4} xs={12}>
                        <CurrencyConverter
                            image={coinDetails.image}
                            symbol={coinDetails.symbol}
                            value={coinDetails.coins_market_data.currentPrice}/>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Stack direction={"column"} spacing={1} sx={{width: "100%"}}
                        >
                            <Box sx={{width: 'fit-content', margin: '1em auto 0 auto'}}>
                                <ChartSelector durationChange={changeChartDuration} chartTypeChange={changeChartType}/>
                            </Box>
                            <Box id={"chartBox"}
                                 onMouseEnter={stopScroll}
                                 onMouseLeave={startScroll}
                                 className={`${coinStyle.chart} ${coinStyle.frostedDivNoPad}`}
                                 sx={{
                                     width: "100%",
                                     height: '550px',
                                     marginTop: "20px !important",
                                 }}>
                                {!chartData ? <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center", width: "100%",
                                        height: '550px',
                                    }}>
                                        <CircularProgress/>
                                    </div> :
                                    <ChartClass type={"svg"}
                                                ratio={2}
                                                data={chartData}
                                                chartType={chartType}/>}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </div>

        </div>
    }
    return (
        <BlankCoin coinId={id}/>
    )
}

export default Coin
