import {useParams} from "react-router-dom";

const CoinPage = () => {
    const {coinId} = useParams()
    return (<div>Coin page {coinId}</div>)
}
export default CoinPage
