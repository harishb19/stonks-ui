import {Stack, Typography} from "@mui/material";
import {AccountBalanceWalletOutlined} from "@mui/icons-material";
import {greyColor} from "../../Common/Colors";

const BlankWallet = () => {
    return <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{marginTop: "10%"}}>
        <AccountBalanceWalletOutlined sx={{width: "10%", height: "10%"}} color={"disabled"}/>
        <Typography variant={"h6"} component={"p"} sx={{color: greyColor}}>
            No coins added
        </Typography>
    </Stack>
}
export default BlankWallet