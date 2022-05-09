import {useStoreState} from "easy-peasy";
import {Button, Grid, Paper, Typography} from "@mui/material";
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
        <>
            <div className={`${loginStyle.titleContainer}`}>
                <Typography color={"secondary"} variant={"h5"} component={"div"}>
                    <b>Sign In</b>
                </Typography>
                <div>
                    <div className={loginStyle.googleBtn}
                         onClick={handleSignInWithGoogle}
                    >
                        <div className={loginStyle.googleIconWrapper}>
                            <img className={loginStyle.googleIcon}
                                 src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                 alt={"google"}/>
                        </div>
                        <p className={loginStyle.btnText}

                        ><b>Sign in with google</b></p>
                    </div>
                </div>
            </div>
            <div>
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
                            <form onSubmit={handleSubmit} className={`${loginStyle.form}`}>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor={"email"} className={`${loginStyle.label}`}>
                                            Email
                                        </label>
                                        <input type="email"
                                               id={"email"}
                                               name={"email"}
                                               value={values.email}
                                               onChange={handleChange}
                                               onBlur={handleBlur}

                                               className={`${loginStyle.input} ${(errors.email && touched.email) ? loginStyle.errorBorder : ""}`}

                                        />
                                        <p className={`${loginStyle.error}`}>
                                            {
                                                (errors.email && touched.email) && errors.email
                                            }

                                        </p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor={"password"} className={`${loginStyle.label}`}>
                                            Password
                                        </label>
                                        <input type="password"
                                               id={"password"}
                                               name={"password"}
                                               value={values.password}
                                               onChange={handleChange}
                                               onBlur={handleBlur}

                                               className={`${loginStyle.input} ${(errors.password && touched.password) ? loginStyle.errorBorder : ""}`}

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
                                    <Grid item xs={12}>
                                        <div className={loginStyle.divider}>
                                            <div className={loginStyle.dividerBorder}/>
                                            <span className={loginStyle.dividerContent}>Or</span>
                                            <div className={loginStyle.dividerBorder}/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant={"outlined"} color={"secondary"} fullWidth
                                                className={`${loginStyle.button}`}
                                                onClick={() => navigate("/auth/signup")}
                                        >
                                            create your account
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant={"text"}
                                                fullWidth
                                                onClick={() => {
                                                    setIsForgotPassword(true)
                                                }}>
                                            <Typography variant={"caption"} align={"center"} component={"div"}>
                                                forgot your password?

                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>


                            </form>
                        )
                    }}

                </Formik>
            </div>
        </>
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
                <Typography color={"secondary"} variant={"h5"} component={"div"}>
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
                            <form onSubmit={handleSubmit} className={`${loginStyle.form}`}>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor={"email"} className={`${loginStyle.label}`}>
                                            Enter email
                                        </label>
                                        <input type="email"
                                               id={"email"}
                                               name={"email"}
                                               value={values.email}
                                               onChange={handleChange}
                                               onBlur={handleBlur}

                                               className={`${loginStyle.input} ${(errors.email && touched.email) ? loginStyle.errorBorder : ""}`}

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
                                            Send reset link

                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={loginStyle.divider}>
                                            <div className={loginStyle.dividerBorder}/>
                                            <span className={loginStyle.dividerContent}>Or</span>
                                            <div className={loginStyle.dividerBorder}/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant={"outlined"} color={"secondary"} fullWidth
                                                className={`${loginStyle.button}`}
                                                onClick={() => {
                                                    setIsForgotPassword(false)
                                                }}

                                        >
                                            sign in instead
                                        </Button>
                                    </Grid>

                                </Grid>


                            </form>
                        )
                    }}

                </Formik>
            </div>
        </>
    )
}


