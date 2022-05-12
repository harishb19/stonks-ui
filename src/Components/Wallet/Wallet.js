import {useSubscription} from "@apollo/client";
import {useEffect, useState} from "react";
import {Box, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import homeStyle from "./css/wallet.module.css"
import {COIN_SUBSCRIPTION} from "../../graphql/subscription";
import CoinCard from "../Common/CoinCard";
import coinStyle from '../Coins/css/coin.module.css'
import AnimatedNumberFormat from "../Common/AnimatedNumberFormat";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import PriceUpDown from "../Common/PriceUpDown";
import {downColor, upColor} from "../../Common/Colors";
import UserDonutChart from "./UserDonutChart";


const Wallet = ({userCoins}) => {
    const [coins, setCoins] = useState(userCoins)
    const [totalPortfolio, setTotalPortfolio] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalProfitPer, setTotalProfitPer] = useState(0)
    const [selected, setSelected] = useState("name")
    const {data: updateCoinData} = useSubscription(COIN_SUBSCRIPTION, {
        variables: {coinIds: userCoins.map(x => x.coinId)},
    });

    useEffect(() => {
        if (updateCoinData && updateCoinData.marketData && updateCoinData.marketData.length > 0 && coins !== null && coins.length > 0) {
            setCoins((cns) =>
                cns.map(item => {
                    const updateCoin = updateCoinData.marketData.find(x => x.id === item.coinId)
                    if (updateCoin) {
                        return {
                            ...item,
                            coins_static: {
                                ...item.coins_static,
                                coins_market_data: {
                                    ...item.coins_static.coins_market_data,
                                    ...updateCoin
                                }
                            }
                        };
                    }
                    return item;
                })
            )
        }
    }, [updateCoinData])

    useEffect(() => {
        if (coins && coins.length > 0) {
            let portfolio = 0, profit = 0
            for (let coin of coins) {
                if (coin.coins_static && coin.coins_static.coins_market_data) {
                    portfolio += coin.coins_static.coins_market_data.currentPrice * coin.quantity
                    profit += (coin.coins_static.coins_market_data.currentPrice - coin.totalPrice) * coin.quantity
                }
            }
            setTotalPortfolio(portfolio)
            setTotalProfit(profit)
            setTotalProfitPer((profit / portfolio) * 100)
        }
    }, [coins])

    const handleSelectedChange = (event) => {
        setSelected(event.target.value)
        switch (event.target.value) {
            case "name":
                setCoins([...coins].sort((a, b) => a.coins_static.name.localeCompare(b.coins_static.name)))
                break
            case "value":
                setCoins([...coins].sort((b, a) => a.quantity * a.coins_static.coins_market_data.currentPrice > b.quantity * b.coins_static.coins_market_data.currentPrice ? 1 : -1))
                break
            case "profit":
                setCoins([...coins].sort((b, a) => (a.coins_static.coins_market_data.currentPrice - a.totalPrice) * a.quantity > (b.coins_static.coins_market_data.currentPrice - b.totalPrice) * b.quantity ? 1 : -1))
                break
            case "quantity":
                setCoins([...coins].sort((b, a) => a.quantity > b.quantity ? 1 : -1))
                break
            default:
                setCoins([...coins].sort((a, b) => a.a.coins_static.name > b.coins_static.name ? 1 : -1))
        }
    }


    if (coins) {
        let coinCards = coins.slice(0, 6).map(x =>
            <Grid key={x.id} item xs={12} md={6}>
                <CoinCard key={x.coins_static.id} id={x.coins_static.id} image={x.coins_static.image}
                          name={x.coins_static.name} symbol={x.coins_static.symbol} decreaseDetail={true}
                          currentPrice={x.coins_static.coins_market_data.currentPrice}
                          priceChangePercentage24h={x.coins_static.coins_market_data.priceChangePercentage24h}
                          sparkLine={x.coins_static.coins_market_data.sparkline}
                          value={x.quantity * x.coins_static.coins_market_data.currentPrice}
                          quantity={x.quantity}
                          price={x.totalPrice}
                          profit={(x.coins_static.coins_market_data.currentPrice - x.totalPrice) * x.quantity}/>
            </Grid>)
        return <div className={homeStyle.radialBG}>
            <Grid container justifyContent={"space-between"} className={coinStyle.frostedHeader}
                  sx={{
                      padding: '15px 0px 15px 30px',
                  }}>
                <Grid item flexGrow={1}>
                    <Stack direction={"row"} sx={{marginTop: "20px"}}
                           justifyContent={"space-between"}>
                        <Stack direction={"row"} alignItems={"center"} spacing={5}>
                            <Stack direction={"column"} alignItems={"start"}>
                                <Typography variant={"h5"} fontWeight={"500"}
                                            textAlign={"center"}>
                                    Total Portfolio
                                </Typography>
                                <AnimatedNumberFormat displayType={'text'}
                                                      value={getDollarNumber(totalPortfolio)}
                                                      thousandSeparator={true}
                                                      fixedDecimalScale={true}
                                                      decimalScale={2}
                                                      prefix="$" decimalSeparator="."
                                                      suffix={getDollarText(totalPortfolio)}
                                                      style={{fontWeight: "500", fontSize: "2.5em"}}/> </Stack>
                            <Stack direction={"column"} alignItems={"start"}>
                                <Typography variant={"h5"} fontWeight={"500"}
                                            textAlign={"center"}>
                                    {totalProfit > 0 ? "Profit" : "Loss"}
                                </Typography>
                                <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                                    <AnimatedNumberFormat displayType={'text'}
                                                          value={getDollarNumber(totalProfit)}
                                                          thousandSeparator={true}
                                                          decimalScale={2}
                                                          fixedDecimalScale={true}
                                                          prefix="$" decimalSeparator="."
                                                          suffix={getDollarText(totalProfit)}
                                                          style={{
                                                              fontWeight: "500",
                                                              fontSize: "2.5em",
                                                              color: totalProfit > 0 ? upColor : downColor
                                                          }}/>
                                    <PriceUpDown value={totalProfitPer}
                                                 prefix={""} arrow={false} fontWeight={500} fontSize={"1.5em"}/>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={"column"} alignItems={"center"} spacing={1}>
                            <Typography variant={"h5"} fontWeight={"500"}
                                        textAlign={"center"}>
                                Distribution
                            </Typography>
                            <Box sx={{height: "150px"}}>
                                <UserDonutChart userCoins={coins}/>
                            </Box>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <Box padding={"5% 5% 0% 5%"}>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selected}
                        label="Sort"
                        onChange={handleSelectedChange}
                    >
                        <MenuItem value={"name"}>Name</MenuItem>
                        <MenuItem value={"profit"}>Profit</MenuItem>
                        <MenuItem value={"value"}>Value</MenuItem>
                        <MenuItem value={"quantity"}>Quantity</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid container spacing={8} padding={"2% 5% 5% 5%"}>

                {coinCards}
            </Grid>
        </div>
    }
    return <div>Home</div>
}

export default Wallet;