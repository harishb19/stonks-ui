import React, {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Radio,
    Stack,
    Typography
} from "@mui/material";
import OdometerAnimation from "../Common/OdometerAnimation";
import {blackColor, downColor, upColor} from "../../Common/Colors";
import coinStyle from "../Coins/css/coin.module.css";
import AnimatedNumber from "../Common/AnimatedNumber";
import sparklineFakeData from "./SparklineFakeData";
import SparkLineIndependent from "../Common/SparklineIndependent";
import {useStoreActions, useStoreState} from "easy-peasy";

export default function SettingsDialog({open, setOpen}) {
    const sparklineSetting = useStoreState(state => state.settings.sparklineSetting)
    const setSparklineSetting = useStoreActions(actions => actions.settings.setSparklineSetting)
    const numberSetting = useStoreState(state => state.settings.numberSetting)
    const setNumberSetting = useStoreActions(actions => actions.settings.setNumberSetting)

    const [counter, setCounter] = useState(1234)

    const handleChange = (event) => {
        setNumberSetting(`${event.target.value}`);
        localStorage.setItem("numberStyle", event.target.value);

    };

    const handleChartChange = (event) => {
        setSparklineSetting(`${event.target.value}`);
        localStorage.setItem("chartStyle", event.target.value);
    };


    useEffect(() => {
        if (open) {
            const interval = setInterval(() => {
                setCounter(x => x + 5)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [open]);

    function handleClose() {

        setOpen(false)
    }


    return (<Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth={"md"}>
        <DialogTitle sx={{backgroundColor: blackColor}} component={"p"}>Settings</DialogTitle>
        <DialogContent sx={{backgroundColor: blackColor}} dividers>
            <DialogContentText>
                Select Animation Style
            </DialogContentText>
            <Stack direction={"column"}>
                <Grid container spacing={3} justifyContent={"space-evenly"} sx={{margin: "20px 0px"}}>
                    <Grid item xs={12} md={4}>
                        <Stack direction={"column"} spacing={1} alignItems={"center"}>
                            <Box style={{
                                backgroundColor: blackColor,
                                border: `1px solid rgba(53, 53, 53)`,
                                borderRadius: '10px',
                                padding: '20px',
                                height: "120px",
                            }} justifyContent={"center"} display="flex" alignItems={"center"}>
                                <AnimatedNumber
                                    displayType={'text'}
                                    value={counter}
                                    thousandSeparator={true} decimalScale={5} fixedDecimal={true}
                                    prefix="$" decimalSeparator="." className={coinStyle.price}
                                    style={{
                                        color: counter > 0 ? upColor : downColor,
                                    }}/>
                            </Box>
                            <Radio
                                checked={numberSetting === "0"}
                                onChange={handleChange}
                                value={"0"}
                                name="radio-buttons"
                                inputProps={{'aria-label': '0'}}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack direction={"column"} spacing={1} alignItems={"center"}>
                            <Box style={{
                                backgroundColor: blackColor,
                                border: `1px solid rgba(53, 53, 53)`,
                                borderRadius: '10px',
                                padding: '20px',
                                height: "120px"
                            }}>
                                <OdometerAnimation
                                    value={counter}
                                    prefix="$"
                                    decimalScale={2}
                                    style={{
                                        color: counter > 0 ? upColor : downColor,
                                    }}
                                    className={coinStyle.price}
                                    animate={false}/>
                            </Box>
                            <Radio
                                checked={numberSetting === '1'}
                                onChange={handleChange}
                                value={'1'}
                                name="radio-buttons"
                                inputProps={{'aria-label': '1'}}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack direction={"column"} spacing={1} alignItems={"center"}>
                            <Box style={{
                                backgroundColor: blackColor,
                                border: `1px solid rgba(53, 53, 53)`,
                                borderRadius: '10px',
                                padding: '20px',
                                height: "120px"
                            }}>
                                <OdometerAnimation
                                    value={counter}
                                    prefix="$"
                                    decimalScale={2}
                                    style={{
                                        color: counter > 0 ? upColor : downColor,
                                    }}
                                    className={coinStyle.price}
                                    animate={true}/>
                            </Box>
                            <Radio
                                checked={numberSetting === '2'}
                                onChange={handleChange}
                                value={'2'}
                                name="radio-buttons"
                                inputProps={{'aria-label': '2'}}
                            />
                        </Stack>
                    </Grid>
                </Grid>
                {numberSetting === '1' || numberSetting === '2' ?
                    <Typography variant={'body1'} component={'p'} color={"error"}>
                        * This animation does not apply to table
                    </Typography> : null}
                <DialogContentText sx={{marginTop: "10px"}}>
                    Select Chart Type
                </DialogContentText>
                <Grid container spacing={3} justifyContent={"space-evenly"} sx={{margin: "20px 0px"}}>
                    <Grid item xs={12} md={4}>
                        <Stack direction={"column"} spacing={1} alignItems={"center"}>
                            <Box style={{
                                backgroundColor: blackColor,
                                border: `1px solid rgba(53, 53, 53)`,
                                borderRadius: '10px',
                                padding: '20px',
                                height: "120px",
                            }} justifyContent={"center"} display="flex" alignItems={"center"}>
                                <SparkLineIndependent id={'bitcoin'} data={sparklineFakeData} decreaseDetail={false}
                                                      height={80}/>
                            </Box>
                            <Stack direction={"row"} alignItems={"center"}>
                                <Radio
                                    checked={sparklineSetting === "0"}
                                    onChange={handleChartChange}
                                    value={"0"}
                                    name="radio-buttons"
                                    inputProps={{'aria-label': '0'}}
                                />
                                <Typography variant={"body1"} component={"p"}>
                                    Detailed
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack direction={"column"} spacing={1} alignItems={"center"}>
                            <Box style={{
                                backgroundColor: blackColor,
                                border: `1px solid rgba(53, 53, 53)`,
                                borderRadius: '10px',
                                padding: '20px',
                                height: "120px",
                            }} justifyContent={"center"} display="flex" alignItems={"center"}>
                                <SparkLineIndependent id={'bitcoin'} data={sparklineFakeData} decreaseDetail={true}
                                                      height={80}/>
                            </Box>
                            <Stack direction={"row"} alignItems={"center"}>
                                <Radio
                                    checked={sparklineSetting === "1"}
                                    onChange={handleChartChange}
                                    value={"1"}
                                    name="radio-buttons"
                                    inputProps={{'aria-label': '1'}}
                                />
                                <Typography variant={"body1"} component={"p"}>
                                    Simplified
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>

        </DialogContent>
        <DialogActions sx={{backgroundColor: blackColor}}>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>)
}
