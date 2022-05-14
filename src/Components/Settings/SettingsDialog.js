import React, {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Radio,
    Stack
} from "@mui/material";
import OdometerAnimation from "../Common/OdometerAnimation";
import {blackColor, downColor, upColor} from "../../Common/Colors";
import coinStyle from "../Coins/css/coin.module.css";
import AnimatedNumber from "../Common/AnimatedNumber";

export default function SettingsDialog({open, setOpen}) {
    const numberStyle = localStorage.getItem("numberStyle") ?? '0';
    console.log(numberStyle)
    const [counter, setCounter] = useState(1234)
    const [up, setUp] = useState(0)
    const [selectedValue, setSelectedValue] = React.useState(numberStyle);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {
        if (open) {
            setSelectedValue(numberStyle.toString())
        }
    }, [numberStyle]);

    useEffect(() => {
        if (open) {
            const interval = setInterval(() => {
                if (up <= 5) {
                    setCounter((x) => x + 10)
                    setUp((x) => x + 1)
                } else {
                    setCounter((x) => x - 10)
                    setUp((x) => x - 1)
                }

            }, 1000);
            return () => clearInterval(interval);
        }
    }, [open]);

    function handleClose() {
        localStorage.setItem("numberStyle", selectedValue);
        setOpen(false)
    }


    return (<Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth={"md"}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent dividers>
            <DialogContentText>
                Select Animation Style
            </DialogContentText>
            <Stack direction={"row"} spacing={3} justifyContent={"space-evenly"} sx={{margin: "20px 0px"}}>
                <Stack direction={"column"} spacing={1} alignItems={"center"}>
                    <Box style={{
                        backgroundColor: blackColor,
                        border: `1px solid rgba(53, 53, 53)`,
                        borderRadius: '10px',
                        padding: '20px',
                        height: "120px",

                    }}>
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
                        checked={selectedValue === "0"}
                        onChange={handleChange}
                        value={"0"}
                        name="radio-buttons"
                        inputProps={{'aria-label': '0'}}
                    />
                </Stack>
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
                        checked={selectedValue === '1'}
                        onChange={handleChange}
                        value={'1'}
                        name="radio-buttons"
                        inputProps={{'aria-label': '1'}}
                    />
                </Stack>
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
                        checked={selectedValue === '2'}
                        onChange={handleChange}
                        value={'2'}
                        name="radio-buttons"
                        inputProps={{'aria-label': '2'}}
                    />
                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>)
}
