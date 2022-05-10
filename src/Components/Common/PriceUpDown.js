import {Stack} from "@mui/material";
import NumberFormat from "react-number-format";
import React from "react";
import {downColor, upColor} from "../../Common/Colors";
import animateClass from "./css/animated.module.css"
import {CSSTransition} from "react-transition-group";
import {ArrowDownwardRounded, ArrowUpwardRounded} from "@mui/icons-material";

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
    // const styles = useSpring({ opacity: toggle ? 1 : 0 })

    if (value === null || value === undefined) {
        return <p>No Value</p>
    }
    if (value > 0) {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            {arrow &&
                <ArrowUpwardRounded className={animateClass.animate} sx={{color: upColor}} fontSize={arrowSize}/>}
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
            {arrow && <ArrowDownwardRounded sx={{color: downColor}} className={animateClass.animate}
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