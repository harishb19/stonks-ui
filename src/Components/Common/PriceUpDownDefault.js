import {Stack} from "@mui/material";
import React from "react";
import {downColor, upColor} from "../../Common/Colors";
import {ArrowDownwardRounded, ArrowUpwardRounded} from "@mui/icons-material";
import AnimatedNumber from "./AnimatedNumber";

const PriceUpDownDefault = ({
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
    return <Stack direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={0}>

        {
            arrow && value > 0 ?
                <ArrowUpwardRounded sx={{color: upColor}} fontSize={arrowSize}/> :
                arrow ?
                    <ArrowDownwardRounded sx={{color: downColor}} fontSize={arrowSize}/> : null
        }
        <AnimatedNumber
            value={value}
            prefix={value > 0 ? `+${prefix}` : prefix}
            suffix={suffix}
            style={{
                color: value > 0 ? upColor : downColor,
                fontWeight: fontWeight,
                fontSize: fontSize
            }}
            decimalScale={2}
            animate={true}/>
    </Stack>
}

export default PriceUpDownDefault