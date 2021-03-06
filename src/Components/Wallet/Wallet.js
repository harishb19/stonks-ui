import {useSubscription} from "@apollo/client";
import {useEffect, useState} from "react";
import {Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import homeStyle from "./css/wallet.module.css"
import walletStyles from "./css/wallet.module.css"
import {COIN_SUBSCRIPTION} from "../../graphql/subscription";
import CoinCard from "../Common/CoinCard";
import coinStyle from '../Coins/css/coin.module.css'
import AnimatedNumberWrapper from "../Common/AnimatedNumberWrapper";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import PriceUpDown from "../Common/PriceUpDown";
import {downColor, upColor} from "../../Common/Colors";
import UserDonutChart from "./UserDonutChart";
import BlankWallet from "./BlankWallet";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";


const Wallet = ({userCoins}) => {

    const [coins, setCoins] = useState(userCoins)
    const [totalPortfolio, setTotalPortfolio] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalProfitPer, setTotalProfitPer] = useState(0)
    const [selected, setSelected] = useState("name")
    const [sortDesc, setSortDesc] = useState(false)
    const {data: updateCoinData} = useSubscription(COIN_SUBSCRIPTION, {
        variables: {coinIds: userCoins.map(x => x.coinId)},
    });

    const coinCards = () => {
        if (coins && coins.length > 0) {
            return coins.slice(0, 6).map(x => coinCheck(x))
        }
        return null
    }
    const coinCheck = (x) => {
        if (x && x.coins_static && x.coins_static.coins_market_data) {
            return <Grid key={x.id} item xs={12} md={6}>
                <CoinCard key={x.coins_static.id} id={x.coins_static.id} image={x.coins_static.image}
                          name={x.coins_static.name} symbol={x.coins_static.symbol} decreaseDetail={true}
                          currentPrice={x.coins_static.coins_market_data.currentPrice}
                          priceChangePercentage24h={x.coins_static.coins_market_data.priceChangePercentage24h}
                          sparkLine={x.coins_static.coins_market_data.sparkline}
                          value={x.quantity * x.coins_static.coins_market_data.currentPrice}
                          quantity={x.quantity}
                          price={x.totalPrice / x.quantity}
                          profit={(x.coins_static.coins_market_data.currentPrice * x.quantity - x.totalPrice)}/>
            </Grid>
        }else {
            return null
        }
    }
    useEffect(() => {
        if (updateCoinData && updateCoinData.marketData && updateCoinData.marketData.length > 0) {
            setCoins((cns) => cns.map(item => {
                const updateCoin = updateCoinData.marketData.find(x => x.id === item.coinId)
                if (updateCoin) {
                    return {
                        ...item, coins_static: {
                            ...item.coins_static, coins_market_data: {
                                ...item.coins_static.coins_market_data, ...updateCoin
                            }
                        }
                    };
                }
                return item;
            }))
        }
    }, [updateCoinData])

    useEffect(() => {
        if (coins && coins.length > 0) {
            let portfolio = 0, profit = 0
            for (let coin of coins) {
                if (coin.coins_static && coin.coins_static.coins_market_data) {
                    portfolio += coin.coins_static.coins_market_data.currentPrice * coin.quantity
                    profit += (coin.coins_static.coins_market_data.currentPrice * coin.quantity - coin.totalPrice)
                }
            }
            setTotalPortfolio(portfolio)
            setTotalProfit(profit)
            setTotalProfitPer((profit / portfolio) * 100)
        }
    }, [coins])

    const handleSelectedChange = (event) => {
        setSelected(event.target.value)
        sortData(event.target.value, sortDesc)
    }

    const handleSortChange = () => {
        setSortDesc(x => {
            sortData(selected, !x)
            return !x
        })
    }

    const sortData = (on, isDesc) => {
        switch (on) {
            case "name":
                if (isDesc) {
                    setCoins([...coins].sort((b, a) => a.coins_static.name.localeCompare(b.coins_static.name)))
                } else setCoins([...coins].sort((a, b) => a.coins_static.name.localeCompare(b.coins_static.name)))
                break
            case "value":
                if (isDesc) {
                    setCoins([...coins].sort((b, a) => a.quantity * a.coins_static.coins_market_data.currentPrice > b.quantity * b.coins_static.coins_market_data.currentPrice ? 1 : -1))
                } else {
                    setCoins([...coins].sort((a, b) => a.quantity * a.coins_static.coins_market_data.currentPrice > b.quantity * b.coins_static.coins_market_data.currentPrice ? 1 : -1))
                }
                break
            case "profit":
                if (isDesc) {
                    setCoins([...coins].sort((b, a) => (a.coins_static.coins_market_data.currentPrice * a.quantity - a.totalPrice) > (b.coins_static.coins_market_data.currentPrice * b.quantity - b.totalPrice) ? 1 : -1))
                }else {
                    setCoins([...coins].sort((a, b) => (a.coins_static.coins_market_data.currentPrice * a.quantity - a.totalPrice) > (b.coins_static.coins_market_data.currentPrice * b.quantity - b.totalPrice) ? 1 : -1))
                }
                break
            case "quantity":
                if (isDesc) {
                    setCoins([...coins].sort((b, a) => a.quantity > b.quantity ? 1 : -1))
                } else setCoins([...coins].sort((a, b) => a.quantity > b.quantity ? 1 : -1))
                break
            default:
                if (isDesc) {
                    setCoins([...coins].sort((b, a) => a.a.coins_static.name > b.coins_static.name ? 1 : -1))
                }else setCoins([...coins].sort((a, b) => a.a.coins_static.name > b.coins_static.name ? 1 : -1))
        }
    }
    return <div className={homeStyle.radialBG} style={{minHeight: "100vh"}}>
        <Grid container justifyContent={"space-between"} className={coinStyle.frostedHeader}
              sx={{
                  padding: '15px 0px 15px 30px',
              }}>
            <Grid item flexGrow={1}>
                <Stack direction={"row"} sx={{marginTop: "20px"}}
                       justifyContent={"space-between"}>
                    <Stack direction={"row"} alignItems={"center"} spacing={5}>
                        <Stack direction={"column"} alignItems={"start"}>
                            <Typography variant={"h5"} component={"p"} fontWeight={"500"}
                                        textAlign={"center"}>
                                Portfolio
                            </Typography>
                            <AnimatedNumberWrapper displayType={'text'}
                                                   value={getDollarNumber(totalPortfolio)}
                                                   thousandSeparator={true}
                                                   fixedDecimalScale={true}
                                                   decimalScale={2}
                                                   prefix="$" decimalSeparator="."
                                                   suffix={getDollarText(totalPortfolio)}
                                                   style={{fontWeight: "500", fontSize: "2.5em"}}/> </Stack>
                        <Stack direction={"column"} alignItems={"start"}>
                            <Typography variant={"h5"} component={"p"} fontWeight={"500"}
                                        textAlign={"center"}>
                                {totalProfit > 0 ? "Profit" : "Loss"}
                            </Typography>
                            <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                                <AnimatedNumberWrapper displayType={'text'}
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
                    {coins && coins.length > 0 ? <Stack direction={"column"} alignItems={"center"} spacing={1}>
                        <Typography variant={"h5"} component={"p"} fontWeight={"500"}
                                    textAlign={"center"}>
                            Distribution
                        </Typography>
                        <Box sx={{height: "150px"}}>
                            <UserDonutChart userCoins={coins}/>
                        </Box>
                    </Stack> : null}
                </Stack>
            </Grid>
        </Grid>
        {coins && coins.length > 0 ? <Stack direction={"row"} alignItems={"center"} spacing={3} padding={"5% 5% 0% 5%"}>
            <FormControl variant={"filled"}>
                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                <Select className={walletStyles.sort}
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
            <div>
                <IconButton aria-label="sort"
                            component="span"
                            color={sortDesc ? "primary" : "inherit"}
                            onClick={handleSortChange}
                            sx={{
                                border: "1px solid #222324", padding: '4px',
                            }}>
                    {sortDesc ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                </IconButton>
            </div>
        </Stack> : null}
        {coins && coins.length > 0 ? <Grid container spacing={8} padding={"2% 5% 5% 5%"}>
            {coinCards()}
        </Grid> : <BlankWallet/>}
    </div>
}

export default Wallet;
