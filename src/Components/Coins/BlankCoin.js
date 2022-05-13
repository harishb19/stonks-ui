import {Button, Stack, Typography} from "@mui/material";
import {CurrencyBitcoin} from "@mui/icons-material";
import {greyColor} from "../../Common/Colors";
import {useNavigate} from "react-router-dom";

const BlankCoin = ({coinId}) => {
    const navigate = useNavigate();
    return <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{marginTop: "10%"}}>
        <CurrencyBitcoin sx={{width: "10%", height: "10%"}} color={"disabled"}/>
        <Typography variant={"h6"} component={"p"} sx={{color: greyColor}}>
            Could not receive market data from api
        </Typography>
        <Button
            type="button"
            className="outline"
            onClick={() => {
                if (coinId)
                    navigate(`/coins/${coinId}`)
            }}
        >
            Refresh
        </Button>
    </Stack>
}
export default BlankCoin