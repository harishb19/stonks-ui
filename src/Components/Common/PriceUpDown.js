import {Stack} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import NumberFormat from "react-number-format";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import React from "react";
import {downColor, upColor} from "../../Common/Colors";
import animateClass from "./css/animated.module.css"
import {CSSTransition} from "react-transition-group";

const PriceUpDown = ({
                         value,
                         fontSize = "1.1em",
                         arrowSize = "medium",
                         fontWeight = "bold",
                         prefix = "",
                         suffix = "%",
                         decimals = 2,
                         arrow = true
                     }) => {

    if (value === null || value === undefined) {
        return <p>No Value</p>
    }
    if (value > 0) {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            {arrow &&
                <ArrowUpwardRoundedIcon className={animateClass.animate} sx={{color: upColor}} fontSize={arrowSize}/>}
            <CSSTransition key={value} timeout={1000}>
                <NumberFormat key={value}
                              className={animateClass.animate}
                              displayType={'text'}
                              value={value}
                              thousandSeparator={false}
                              prefix={`+${prefix}`}
                              suffix={suffix}
                              decimalSeparator="."
                              style={{
                                  color: upColor,
                                  fontWeight: fontWeight,
                                  fontSize: fontSize
                              }}
                              decimalScale={decimals}
                              fixedDecimalScale={true}/>
            </CSSTransition>
        </Stack>
    } else {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            {arrow && <ArrowDownwardRoundedIcon sx={{color: downColor}} className={animateClass.animate}
                                                fontSize={arrowSize}/>}
            <CSSTransition key={value} timeout={1000}>
                <NumberFormat key={value}
                              className={animateClass.animate}
                              displayType={'text'}
                              value={value}
                              thousandSeparator={false}
                              prefix={prefix}
                              suffix={suffix}
                              decimalSeparator="."
                              style={{color: downColor, fontWeight: fontWeight, fontSize: fontSize}}
                              decimalScale={decimals}
                              fixedDecimalScale={true}/>
            </CSSTransition>
        </Stack>

    }
}

export default PriceUpDown