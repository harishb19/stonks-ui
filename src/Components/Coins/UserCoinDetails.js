import {Stack, Typography} from "@mui/material";
import {downColor, greyColor, upColor} from "../../Common/Colors";
import AnimatedNumberFormat from "../Common/AnimatedNumberFormat";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import PriceUpDown from "../Common/PriceUpDown";
import NumberFormat from "react-number-format";

const UserCoinDetails = ({value, profit, price, quantity}) => {
    return <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2.5}
                  flexWrap={"wrap"}>
        <Stack direction={"column"} alignItems={"start"}>
            <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                Value
            </Typography>
            <AnimatedNumberFormat displayType={'text'}
                                  value={getDollarNumber(value)}
                                  thousandSeparator={true}
                                  decimalScale={2}
                                  fixedDecimalScale={true}
                                  prefix="$" decimalSeparator="."
                                  suffix={getDollarText(value)}
                                  style={{fontSize: "1.6em", fontWeight: "600"}}
            />
        </Stack>
        <Stack direction={"column"} alignItems={"start"}>
            <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                {profit > 0 ? "Profit" : "Loss"}
            </Typography>
            <Stack direction={"row"} spacing={1}>
                <AnimatedNumberFormat displayType={'text'}
                                      value={getDollarNumber(profit)}
                                      fixedDecimalScale={true}
                                      thousandSeparator={true}
                                      decimalScale={2}
                                      prefix="$" decimalSeparator="."
                                      suffix={getDollarText(profit)}
                                      style={{
                                          fontSize: "1.6em",
                                          fontWeight: "600",
                                          color: profit > 0 ? upColor : downColor
                                      }}/>
                <PriceUpDown fontSize={'0.9em'} arrowSize={"small"} value={profit / value * 100}/>
            </Stack>
        </Stack>
        <Stack direction={"column"} alignItems={"start"}>
            <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                Bought at
            </Typography>
            <NumberFormat displayType={'text'}
                          value={getDollarNumber(price)}
                          prefix={"$"}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={2}
                          decimalSeparator="."
                          suffix={getDollarText(price)}
                          style={{fontSize: "1.6em", fontWeight: "600"}}/>
        </Stack>
        <Stack direction={"column"} alignItems={"start"}>
            <Typography color={greyColor} variant={"body2"} fontWeight={600} component={"p"}>
                Qty
            </Typography>
            <NumberFormat displayType={'text'}
                          value={getDollarNumber(quantity)}
                          thousandSeparator={true}
                          decimalScale={0} style={{fontSize: "1.6em", fontWeight: "600"}}/>
        </Stack>
    </Stack>
}

export default UserCoinDetails