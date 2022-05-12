import {useStoreState} from "easy-peasy";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const LoginCheck = ({children}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const navigate = useNavigate()

    useEffect(() => {
        if (userDetails && userDetails.id) {
            navigate("/")
        }
    }, [navigate, userDetails])
    if (userDetails && userDetails.id) {

        return null
    }
    return children

}
export default LoginCheck
