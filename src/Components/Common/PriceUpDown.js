import {Stack} from "@mui/material";
import React from "react";
import {downColor, upColor} from "../../Common/Colors";
import {ArrowDownwardRounded, ArrowUpwardRounded} from "@mui/icons-material";
import Odometer from "./OdometerAnimation";

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
                <ArrowUpwardRounded sx={{color: upColor}} fontSize={arrowSize}/>}
            <Odometer
                value={value}
                prefix={`+${prefix}`}
                suffix={suffix}
                style={{
                    color: upColor,
                    fontWeight: fontWeight,
                    fontSize: fontSize
                }}
                decimalScale={decimals}
                animate={true}/>
            {/*<CSSTransition key={value} timeout={1000}>*/}
            {/*    <NumberFormat key={value}*/}
            {/*                  className={animateClass.animate}*/}
            {/*                  displayType={'text'}*/}
            {/*                  value={value}*/}
            {/*                  thousandSeparator={false}*/}
            {/*                  prefix={`+${prefix}`}*/}
            {/*                  suffix={suffix}*/}
            {/*                  decimalSeparator="."*/}
            {/*                  style={{*/}
            {/*                      color: upColor,*/}
            {/*                      fontWeight: fontWeight,*/}
            {/*                      fontSize: fontSize*/}
            {/*                  }}*/}
            {/*                  decimalScale={decimals}*/}
            {/*                  fixedDecimalScale={true}/>*/}
            {/*</CSSTransition>*/}
        </Stack>
    } else {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            {arrow && <ArrowDownwardRounded sx={{color: downColor}}
                                            fontSize={arrowSize}/>}
            <Odometer
                value={value}
                prefix={prefix}
                suffix={suffix}
                style={{color: downColor, fontWeight: fontWeight, fontSize: fontSize}}
                animate={false}
                decimalScale={decimals}/>
            {/*<CSSTransition key={value} timeout={1000}>*/}
            {/*    <NumberFormat key={value}*/}
            {/*                  className={animateClass.animate}*/}
            {/*                  displayType={'text'}*/}
            {/*                  value={value}*/}
            {/*                  thousandSeparator={false}*/}
            {/*                  prefix={prefix}*/}
            {/*                  suffix={suffix}*/}
            {/*                  decimalSeparator="."*/}
            {/*                  style={{color: downColor, fontWeight: fontWeight, fontSize: fontSize}}*/}
            {/*                  decimalScale={decimals}*/}
            {/*                  fixedDecimalScale={true}/>*/}
            {/*</CSSTransition>*/}
        </Stack>

    }
}

export default PriceUpDown