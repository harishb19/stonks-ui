import React from "react";
import {Grid, Stack, Typography} from "@mui/material";
import Sparkline from "./Sparkline";
import PriceUpDown from "./PriceUpDown";
import Box from "@mui/material/Box";
import cardStyle from './css/coin_card.module.css'
import coinStyle from '../Coins/css/coin.module.css'

import AnimatedNumberFormat from "./AnimatedNumberFormat";
import {greyColor} from "../../Common/Colors";
import NumberFormat from "react-number-format";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";

const CoinCard = ({
                      id,
                      name,
                      symbol,
                      image,
                      currentPrice,
                      priceChangePercentage24h,
                      sparkLine,
                      decreaseDetail = true,
                      qty = 10,
                  }) => {
    const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");
    return (
        <Box className={cardStyle.actionArea}>
            <Grid className={coinStyle.frostedDiv}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction="row" alignItems={"center"} spacing={1}>
                        <img src={image} alt={name} className={cardStyle.coinImage} onError={onMediaFallback}/>
                        <Stack direction="column" justifyContent="center">
                            <Typography variant="h5" component="p">
                                {name}
                            </Typography>
                            <Typography variant="subtitle2" component="p" className={cardStyle.symbol}>
                                {symbol.toUpperCase()}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"column"} alignItems={"end"} justifyContent={"center"} spacing={1}>
                        <Box sx={{
                            borderRadius: "5px",
                            padding: '2px 4px',
                            backgroundColor: priceChangePercentage24h > 0 ? "rgba(78, 191, 103,0.15)" : "rgba(254, 122, 104,0.15)",
                        }}>
                            <PriceUpDown fontSize={'0.9em'} arrowSize={"small"} value={priceChangePercentage24h}/>
                        </Box>
                        <AnimatedNumberFormat displayType={'text'} value={currentPrice} thousandSeparator={true}
                                              suffix=" USD" decimalSeparator="." decimalScale={3}
                                              fixedDecimalScale={true}
                                              fixedDecimal={false}
                                              style={{fontSize: "1.1em", fontWeight: 500, margin: "7"}}/>
                    </Stack>
                </Stack>
                <div style={{borderTop: "1.5px solid #383A43 "}}/>
                <div style={{height: '80px'}}>
                    <Sparkline id={id} data={sparkLine} decreaseDetail={decreaseDetail} height={80}/>
                </div>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction={"column"} alignItems={"start"}>
                        <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                            Value
                        </Typography>
                        <Stack direction={"row"}>
                            <Typography variant={"h5"} fontWeight={600} component={"p"}>
                                <NumberFormat displayType={'text'}
                                              value={getDollarNumber(100000)}
                                              thousandSeparator={true}
                                              decimalScale={2}
                                              prefix="$" decimalSeparator="."
                                              suffix={getDollarText(100000)}/>
                            </Typography>
                            <PriceUpDown fontSize={'0.9em'} arrowSize={"small"} value={priceChangePercentage24h}/>
                        </Stack>

                    </Stack>
                    <Stack direction={"column"} alignItems={"start"}>
                        <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                            Balance
                        </Typography>
                        <Typography variant={"h6"} fontWeight={500} component={"p"}>
                            <NumberFormat displayType={'text'}
                                          value={getDollarNumber(100000)}
                                          thousandSeparator={true}
                                          decimalScale={2}
                                          decimalSeparator="."
                                          suffix={getDollarText(100000)}/>
                        </Typography>
                    </Stack>
                    <Stack direction={"column"} alignItems={"start"}>
                        <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                            Qty
                        </Typography>
                        <Typography variant={"h6"} fontWeight={500} component={"p"}>
                            <NumberFormat displayType={'text'}
                                          value={getDollarNumber(100000)}
                                          thousandSeparator={true}
                                          decimalScale={0}/>
                        </Typography>
                    </Stack>
                </Stack>
            </Grid>
        </Box>);

};

export default CoinCard;
