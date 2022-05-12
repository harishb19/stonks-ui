import {useQuery} from "@apollo/client";
import {ALL_USER_COINS} from "../../graphql/queries";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import Wallet from "./Wallet";
import {useStoreState} from "easy-peasy";
import BlankWallet from "./BlankWallet";

const WalletFetchUser = () => {
    const userDetails = useStoreState(state => state.user.userDetails)

    // const [fetchUserCoins, {data, error, loading, refetch}] = useLazyQuery(ALL_USER_COINS)
    const {data, loading, error, refetch} = useQuery(ALL_USER_COINS, {
        variables: {userId: userDetails.id},
    });

    if (loading) return <Loading/>
    if (error) return <Error message={error.message} onClick={refetch}/>
    if (data && data.userCoins) {
        return <Wallet userCoins={data.userCoins}/>
    }
    return <BlankWallet/>
}

export default WalletFetchUser