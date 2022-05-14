import {useStoreState} from "easy-peasy";
import {Button, Grid, InputAdornment, InputLabel, Paper, TextField, Typography} from "@mui/material";
import loginStyle from "./css/login.module.css"
import {Formik} from "formik";
import * as Yup from "yup";
import React, {useState} from "react";
import {
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Email, Google, Lock} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

const Login = () => {
    const navigate = useNavigate()
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    const userDetails = useStoreState(state => state.user.userDetails)
    if (userDetails && userDetails.id) {
        navigate("/")
    }
    return (
        <div>
            <Paper elevation={2} className={`${loginStyle.root}`}>
                {
                    isForgotPassword ?
                        <ForgotContainer setIsForgotPassword={setIsForgotPassword}/> :
                        <LoginContainer setIsForgotPassword={setIsForgotPassword}/>
                }
            </Paper>
        </div>
    )
}
export default Login


const LoginContainer = ({setIsForgotPassword}) => {
    const navigate = useNavigate()
    const auth = getAuth();

    const handleUserCheck = (user) => {

        user.getIdTokenResult(true) // 1
            .then((idTokenResult) => {
                if (!("stonks" in idTokenResult.claims) || idTokenResult.claims.stonks === null) {
                    navigate("/auth/signup")
                    toast.info(`Please signup to continue`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    navigate("/")
                }
            })
    }
    const handleSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                if (user) {
                    handleUserCheck(user)
                }


            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorCode, errorMessage, credential)
        });
    }

    const handleLogin = (value, setSubmitting, setFieldError) => {
        let localAuthDetails = {...value}
        signInWithEmailAndPassword(auth, localAuthDetails.email, localAuthDetails.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                handleUserCheck(user)
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/wrong-password":
                        setFieldError("email", "Email or Password incorrect")
                        setFieldError("password", "Email or Password incorrect")
                        break;
                    case "auth/user-not-found":
                        setFieldError("email", "Email or Password incorrect")
                        setFieldError("password", "Email or Password incorrect")
                        break;
                    default:
                        setFieldError("password", "Email or Password incorrect")
                        setFieldError("email", "Email or Password incorrect")

                }

                console.log(error.code)
                setSubmitting(false)

            })
    }
    return (
        <Box justifyContent='center' display='flex' alignItems='center' className={loginStyle.div}>
            {/*<Paper className={loginStyle.paper}>*/}
            <div className={loginStyle.paper}>
                <div className={loginStyle.titleContainer}>
                    <Typography variant={"h5"} component={"div"} className={loginStyle.titleText}>
                        <b>Sign In</b>
                    </Typography>
                </div>
                {/*<div>*/}
                <Formik
                    initialValues={{email: "", password: ""}}
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        setSubmitting(true)
                        handleLogin(values, setSubmitting, setFieldError)
                    }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email().required("Email is required"),
                        password: Yup.string().required("Password is required"),

                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            dirty,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isValid,
                            isSubmitting
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <TextField
                                            multiline
                                            type="email"
                                            id="email"
                                            name="email"
                                            error={(errors.email && touched.email)}
                                            // label="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            variant={"outlined"}
                                            fullWidth
                                            onBlur={handleBlur}
                                            className={loginStyle.inputbox}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <p className={`${loginStyle.error}`}>
                                            {
                                                (errors.email && touched.email) && errors.email
                                            }
                                        </p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <TextField
                                            id="password"
                                            name="password"
                                            // label="Password"
                                            error={(errors.password && touched.password)}
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            variant={"outlined"}
                                            fullWidth
                                            onBlur={handleBlur}
                                            className={loginStyle.inputbox}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <p className={`${loginStyle.error}`}>
                                            {
                                                (errors.password && touched.password) && errors.password
                                            }

                                        </p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant={"contained"} color={"secondary"} fullWidth
                                                className={`${loginStyle.button}`}
                                                disabled={isSubmitting || !(isValid && dirty)}
                                                type={"submit"}
                                        >
                                            sign in
                                        </Button>

                                    </Grid>
                                </Grid>


                            </form>
                        )
                    }}

                </Formik>

                <Typography className={`${loginStyle.smalltext} ${loginStyle.minilink}`}
                            onClick={() => {
                                setIsForgotPassword(true)
                            }}>
                    Forgot your password?</Typography>
                <Typography className={loginStyle.smalltext}>
                    or continue with
                </Typography>
                <div>
                    <IconButton
                        className={loginStyle.avatar}
                        aria-label="google signin"
                        color="primary"
                        onClick={handleSignInWithGoogle}
                    >
                        <Google/>
                    </IconButton>
                </div>
                <Typography className={loginStyle.smalltext}>
                    No Account? <a className={loginStyle.minilink} href={'/auth/signup'}>Signup</a>
                </Typography>
            </div>
        </Box>
    )
}

const ForgotContainer = ({setIsForgotPassword}) => {
    const auth = getAuth();

    const handleForgotPassword = (email) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setIsForgotPassword(false)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }
    return (
        <>
            <div className={`${loginStyle.titleContainer}`}>
                <Typography className={loginStyle.titleText} variant={"h5"} component={"div"}>
                    <b>Forgot password?</b>
                </Typography>
            </div>
            <div>
                <Formik
                    initialValues={{
                        code: "+91",
                        mobile: ""
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        setSubmitting(true)
                        handleForgotPassword(values.email)
                    }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email().required("Email is required"),
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            dirty,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isValid,
                            isSubmitting
                        } = props;
                        return (
                            // <>
                            <form onSubmit={handleSubmit}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <TextField
                                            multiline
                                            type="email"
                                            id="email"
                                            name="email"
                                            // label="Email"
                                            error={(errors.email && touched.email)}
                                            value={values.email}
                                            onChange={handleChange}
                                            variant={"outlined"}
                                            fullWidth
                                            onBlur={handleBlur}
                                            className={loginStyle.inputbox}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <p className={`${loginStyle.error}`}>
                                            {
                                                (errors.email && touched.email) && errors.email
                                            }
                                        </p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant={"contained"} color={"secondary"} fullWidth
                                                className={`${loginStyle.button}`}
                                                disabled={isSubmitting || !(isValid && dirty)}
                                                type={"submit"}
                                        >
                                            sign in
                                        </Button>

                                    </Grid>

                                    <Typography className={`${loginStyle.smalltext} ${loginStyle.minilink}`}
                                                onClick={() => {
                                                    setIsForgotPassword(false)
                                                }}>
                                        Go back to Login</Typography>
                                </Grid>
                            </form>
                        )
                    }}

                </Formik>
            </div>
        </>
    )
}


