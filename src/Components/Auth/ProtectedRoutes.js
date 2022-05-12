import {useStoreState} from "easy-peasy";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useEffect} from "react";

const ProtectedRoutes = ({children}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userDetails || !userDetails.id) {
            toast.info(`Please login to continue`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            navigate("/auth/login")
        }
    }, [navigate, userDetails])
    if (!userDetails || !userDetails.id) {

        return null
    }
    return children

}
export default ProtectedRoutes
