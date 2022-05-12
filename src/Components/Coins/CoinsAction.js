import {Button, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserCoinAction from "../UserCoins/AddCoin";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteCoin from "../UserCoins/DeleteCoin";
import EditIcon from "@mui/icons-material/Edit";
import Color from "color";
import {pinkColor} from "../../Common/Colors";
import {useStoreState} from "easy-peasy";
import {useLazyQuery} from "@apollo/client";
import {USER_COIN_BY_COIN_ID} from "../../graphql/queries";
import Error from "../Error/CustomError";
import {useEffect, useState} from "react";
import NotificationActions from "../Notification/NotificationActions";

const CoinsAction = ({coinDetails}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [openCoinAction, setOpenCoinAction] = useState(false)
    const [openCoinActionMore, setOpenCoinActionMore] = useState(false)

    const [openDelete, setOpenDelete] = useState(false)
    const [userCoinData, setUserCoinData] = useState({})
    const [fetchUserCoin, {data, error, loading}] = useLazyQuery(USER_COIN_BY_COIN_ID)

    useEffect(() => {
        if (!loading && data && data.userCoins && data.userCoins[0]) {
            setUserCoinData({...data.userCoins[0]})
        }
    }, [data, loading, userDetails])
    useEffect(() => {
        if (userDetails && userDetails.id) {
            fetchUserCoin({
                variables: {
                    coinId: coinDetails.id, userId: userDetails.id
                }
            })
        }
    }, [coinDetails.id, fetchUserCoin, userDetails])

    if (error) return <Error message={error.message}/>
    if (userDetails && userDetails.id) {
        return (<>
            <Stack direction={"row"} spacing={3} sx={{marginTop: '20px'}}>
                {userCoinData && userCoinData.id ?

                    <>
                        <NotificationActions/>
                        <Button variant="outlined" startIcon={<AddIcon/>} color={"success"} onClick={() => {
                            setOpenCoinActionMore(true)
                        }}>
                            Add more
                        </Button>
                        <Button variant="outlined" startIcon={<EditIcon/>} color={"secondary"} onClick={() => {
                            setOpenCoinAction(true)
                        }}
                                sx={{color: `${Color(pinkColor).lighten(0.35)}`}}>
                            Edit
                        </Button>
                        <Button variant="outlined" startIcon={<RemoveIcon/>} color={"error"} onClick={() => {
                            setOpenDelete(true)
                        }}>
                            Remove
                        </Button>


                    </> :
                    <>
                        <NotificationActions/>
                        <Button variant="outlined" startIcon={<AddIcon/>} color={"success"} onClick={() => {
                            setOpenCoinAction(true)
                        }}>
                            Add
                        </Button>
                    </>}


                {/*<IconButton aria-label="fingerprint">*/}
                {/*    <StarOutlineIcon/>*/}
                {/*</IconButton>*/}

            </Stack>
            <UserCoinAction open={openCoinAction} setOpen={setOpenCoinAction} userCoinData={userCoinData}
                            coinId={coinDetails.id} setUserCoinData={setUserCoinData}/>
            <UserCoinAction open={openCoinActionMore} setOpen={setOpenCoinActionMore} userCoinData={{}}
                            coinId={coinDetails.id} setUserCoinData={setUserCoinData}/>

            <DeleteCoin open={openDelete} setOpen={setOpenDelete} coinId={coinDetails.id}
                        userId={userDetails.id} setUserCoinData={setUserCoinData}/>
        </>)

    }
    return null
}
export default CoinsAction
