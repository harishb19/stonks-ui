import {makeStyles, Stack} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import NumberFormat from "react-number-format";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import React from "react";

const PriceUpDown = ({value}) => {
    const useStyles = makeStyles(() => ({
        percentUp: {
            color: "#4EBF67", fontWeight: "bold", fontSize: "1.1em",
        }, percentDown: {
            color: "#FE7A68", fontWeight: "bold", fontSize: "1.1em",
        }
    }));
    const classes = useStyles();
    if (value === null || value === undefined) {
        return <p>No Value</p>
    }
    if (value > 0) {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            <ArrowUpwardRoundedIcon sx={{color: "#4EBF67"}}/>
            <NumberFormat displayType={'text'}
                          value={value}
                          thousandSeparator={false}
                          prefix={value > 0 ? "+" : ''}
                          suffix="%"
                          decimalSeparator="."
                          className={classes.percentUp}
                          decimalScale={2}
                          fixedDecimalScale={true}/>
        </Stack>
    } else {
        return <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={0}>
            <ArrowDownwardRoundedIcon sx={{color: "#FE7A68"}}/>
            <NumberFormat displayType={'text'}
                          value={value}
                          thousandSeparator={false}
                          prefix={value > 0 ? "+" : ''}
                          suffix="%"
                          decimalSeparator="."
                          className={classes.percentDown}
                          decimalScale={2}
                          fixedDecimalScale={true}/>
        </Stack>
    }
}

export default PriceUpDown