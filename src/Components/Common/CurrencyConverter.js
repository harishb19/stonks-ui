import {Box, IconButton, Stack} from "@mui/material";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import InputBase from '@mui/material/InputBase';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import currencyStyle from '../Coins/css/currency.module.css';
import coinStyle from '../Coins/css/coin.module.css'

const CurrencyConverter = ({image, symbol, value}) => {

    const [usdText, setUsdText] = useState(value)
    const [coinText, setCoinText] = useState(1)

    const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");
    const coinToUsd = (e) => {
        if (isNaN(e.target.value)) return;
        setCoinText(e.target.value);
        if (e.target.value.trim().length === 0) {
            setUsdText(0);
        } else {
            setUsdText(e.target.value * value)

        }
    }
    const usdToCoin = (e) => {
        if (isNaN(e.target.value)) return;
        setUsdText(e.target.value);
        if (e.target.value.trim().length === 0) {
            setCoinText(0);
        } else {
            setCoinText(parseFloat((e.target.value / value).toFixed(7)))
        }
    }

    if (!image || !symbol || !value) {
        return <Box
            sx={{backgroundColor: "#0F0F0F", padding: '20px', border: "2px solid #222324", borderRadius: '15px'}}>
            <Typography variant={"h2"} component={"p"}>
                Loading...
            </Typography>
        </Box>
    }
    return <Box className={coinStyle.frostedDiv}>
        <Stack direction={"row"} sx={{border: "1px solid #222324", borderRadius: '10px', overflow: 'hidden'}}>
            <Stack direction={"row"} spacing={1} sx={{backgroundColor: "#181818", padding: '10px 20px'}}>
                <img src={image} alt={symbol}
                     className={currencyStyle.coinImage} onError={onMediaFallback}/>
                <Typography htmlFor={"currInput1"} variant={'body1'} component={'label'}>
                    {symbol.toUpperCase()}
                </Typography>
            </Stack>
            <div style={{borderLeft: "1px solid #222324"}}/>
            <InputBase
                id="currInput1"
                sx={{
                    minWidth: "150px",
                    flex: 1,
                    paddingRight: '5px',
                    backgroundColor: "#0A0A0A",
                    input: {textAlign: "right"}

                }}
                value={coinText}
                onChange={coinToUsd}
            />
        </Stack>
        <IconButton aria-label="switch"
                    component="span"
                    sx={{
                        position: 'relative',
                        top: '-10px',
                        left: "50%",
                        zIndex: '3',
                        backgroundColor: "#0F0F0F",
                        border: "1px solid #222324",
                        padding: '4px',
                    }}>
            <ImportExportIcon/>
        </IconButton>
        <Stack direction={"row"}
               sx={{border: "1px solid #222324", borderRadius: '10px', overflow: 'hidden', marginTop: "-20px"}}>
            <Stack direction={"row"} spacing={1} sx={{backgroundColor: "#181818", padding: '10px 20px'}}>
                <img src={'/dollar-symbol.png'} alt={"USD"}
                     className={currencyStyle.coinImage} onError={onMediaFallback}/>
                <Typography htmlFor={"currInput2"} variant={'body1'} component={'label'}>
                    USD
                </Typography>
            </Stack>
            <div style={{borderLeft: "1px solid #222324"}}/>
            <InputBase
                id={"currInput2"}
                sx={{
                    minWidth: "150px",
                    flex: 1,
                    paddingRight: '5px',
                    backgroundColor: "#0A0A0A",
                    input: {textAlign: "right"}
                }}
                value={usdText}
                onChange={usdToCoin}
            />
        </Stack>
    </Box>
}

export default CurrencyConverter