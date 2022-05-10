import React, {memo} from "react";
import {Card, CardActionArea, CardContent, Grid, Stack, Typography} from "@mui/material";
import NumberFormat from "react-number-format";
import Color from "color";
import Sparkline from "./Sparkline";
import PriceUpDown from "./PriceUpDown";
import Box from "@mui/material/Box";
import coinStyle from './css/coin_card.module.css'

const CoinCard = ({
                      id,
                      name,
                      symbol,
                      image,
                      currentPrice,
                      priceChangePercentage24h,
                      sparkLine,
                      decreaseDetail = true
                  }) => {
    const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");

    return (<CardActionArea className={coinStyle.actionArea}>
        <Card sx={{
            borderRadius: '2rem !important', boxShadow: 'none', '&:hover': {
                boxShadow: `0 6px 12px 0 ${Color('#252631')
                    .rotate(-12)
                    .darken(0.2)
                    .fade(0.5)}`,
            },
        }}>
            <CardContent className={coinStyle.content}>
                <Grid>
                    <Stack direction="row">
                        <img src={image} alt={name} className={coinStyle.coinImage} onError={onMediaFallback}/>
                        <Stack direction="column" justifyContent="center"
                               alignItems="flex-start" spacing={1}>
                            <Typography variant="h5" component="p">
                                {name}
                            </Typography>
                            <Typography variant="h7" component="p" className={coinStyle.symbol}>
                                {symbol.toUpperCase()}
                            </Typography>
                        </Stack>
                    </Stack>
                    <div style={{borderTop: "1.5px solid #383A43 "}}/>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <NumberFormat displayType={'text'} value={currentPrice} thousandSeparator={true}
                                      suffix=" USD" decimalSeparator="." className={coinStyle.price}/>
                        <Box sx={{
                            borderRadius: "5px",
                            padding: '4px',
                            backgroundColor: priceChangePercentage24h > 0 ? "rgba(78, 191, 103,0.15)" : "rgba(254, 122, 104,0.15)",
                        }}>
                            <PriceUpDown value={priceChangePercentage24h}/>
                        </Box>
                    </Stack>
                    <Sparkline id={id} data={sparkLine} decreaseDetail={decreaseDetail} height={100}/>
                </Grid>
            </CardContent>
        </Card>
    </CardActionArea>);

};

export default memo(CoinCard);
