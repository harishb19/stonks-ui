import {ALL_USER_COINS} from "../../graphql/queries";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import Wallet from "./Wallet";
import {useStoreState} from "easy-peasy";
import BlankWallet from "./BlankWallet";
import {useEffect, useState} from "react";
import {useLazyQuery} from "@apollo/client";

const WalletFetchUser = () => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [fetchUserCoins, {
        data,
        error,
        loading,
        refetch
    }] = useLazyQuery(ALL_USER_COINS, {fetchPolicy: 'network-only',})
    const [userCoinData, setUserCoinData] = useState(null)

    useEffect(() => {
        if (userDetails && userDetails.id) {
            console.log('fired')
            fetchUserCoins({
                variables: {
                    userId: userDetails.id
                }, fetchPolicy: 'network-only',
            })
        }
    }, [fetchUserCoins, userDetails])

    useEffect(() => {
        if (!loading && data && data.userCoins) {
            console.log(data)
            setUserCoinData(data.userCoins)
        }
    }, [data, loading, userDetails])

    if (loading) return <Loading/>
    if (error) return <Error message={error.message} onClick={refetch}/>
    console.log(userCoinData)
    if (userCoinData && userCoinData.length > 0) {
        return <Wallet userCoins={userCoinData}/>
    }
    return <BlankWallet/>
}

export default WalletFetchUser