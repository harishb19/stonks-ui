import {useStoreState} from "easy-peasy";
import {Box, Button, Grid, InputAdornment, InputLabel, Paper, TextField, Typography} from "@mui/material";
import loginStyle from "./css/login.module.css"
import {Formik} from "formik";
import * as Yup from "yup";
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {SIGNUP_USER} from "../../graphql/mutation";
import "yup-phone";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Badge, Email, Google, LocalPhone, Lock} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const Signup = () => {
    const navigate = useNavigate()
    const userDetails = useStoreState(state => state.user.userDetails)
    if (userDetails && userDetails.id) {
        navigate("/")
    }
    const auth = getAuth();
    const regex = /^[0-9]{10}$/
    const passwordValidation = {
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().min(6, "Password should be min 6 character long").required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password is required'),
        phoneNumber: Yup.string().required("Phone number is required").matches(regex, "Phone number is not valid").nullable(false)
    }
    const googleValidation = {
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email().required("Email is required"),
        phoneNumber: Yup.string().required("Phone number is required").matches(regex, "Phone number is not valid").nullable(false)
    }


    const [initialValue, setInitialValue] = useState({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "", phoneNumber: ""
    })
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)
    const [firebaseUid, setFirebaseUid] = useState("")

    const [insertUser] = useMutation(SIGNUP_USER)

    const handleSignupWithGoogle = () => {
        setIsGoogleAuth(true)
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("signup", user)
                if (user) {
                    let name = user.displayName
                    const nameArray = name.split(" ");
                    setFirebaseUid(user.uid)
                    setInitialValue({
                        firstName: nameArray && nameArray[0],
                        lastName: nameArray && nameArray[1],
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                    })
                }


                // ...
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
    const handleSignup = (value, {setFieldError, setSubmitting}) => {
        setSubmitting(true)
        const localUserDetails = {...value}
        if (isGoogleAuth) {
            handleInsertUser({
                firstName: localUserDetails.firstName,
                lastName: localUserDetails.lastName,
                email: localUserDetails.email,
                firebaseUid: firebaseUid,
                phoneNumber: localUserDetails.phoneNumber,
            }, setSubmitting)
        } else {
            createUserWithEmailAndPassword(auth, localUserDetails.email, localUserDetails.password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    handleInsertUser({
                        firstName: localUserDetails.firstName,
                        lastName: localUserDetails.lastName,
                        email: localUserDetails.email,
                        firebaseUid: user.uid,
                        phoneNumber: localUserDetails.phoneNumber,

                    }, setSubmitting)
                })
                .catch((error) => {
                    if (error.code.match("auth/email-already-in-use")) {
                        setFieldError("email", "Email already in use.")
                    } else {
                        //TODO add error toast
                        console.log(error.message)
                    }
                    setSubmitting(false)

                })
        }

    }
    const handleInsertUser = (userDetails, setSubmitting) => {
        insertUser({
            variables: {
                ...userDetails
            }
        }).then((response) => {
            if (response && response.data && response.data.signUp && response.data.signUp.id) {

                navigate("/auth/login")
                toast.success(`Sign up successful. Login to continue!`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)

            }
        }).catch((error) => {
            console.log(error.message)
            setSubmitting(false)
            //TODO add error toast
            signOut(auth).then(r => {
                console.log("signout")
            }).catch((e) => {
                //TODO add error toast
                console.log(e)
            })
        })
    }
    useEffect(() => {
        console.log("initialValue", initialValue)
    }, [initialValue])

    return (
        <Paper elevation={2} className={`${loginStyle.rootSignup}`}>
            <Box justifyContent='center' display='flex' alignItems='center' className={loginStyle.div}>
                <div className={loginStyle.paper}>
                    <div className={loginStyle.titleContainer}>
                        <Typography variant={"h5"} component={"div"} className={loginStyle.titleText}>
                            <b>Sign Up</b>
                        </Typography>
                    </div>
                    <Formik
                        initialValues={{...initialValue}}
                        onSubmit={handleSignup}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape(isGoogleAuth ? {...googleValidation} : {...passwordValidation})}
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
                                    <Grid container alignItems="center">
                                        <Grid container item xs={12} md={12} lg={12} spacing={2}>
                                            <Grid item xs={12} md={6} lg={6}>
                                                <InputLabel htmlFor="firstName">First Name</InputLabel>
                                                <TextField
                                                    multiline
                                                    type="text"
                                                    name={"firstName"}
                                                    id={"firstName"}
                                                    value={values.firstName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    variant={"filled"}
                                                    fullWidth
                                                    className={loginStyle.inputboxmini}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Badge/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {
                                                        (errors.firstName && touched.firstName) && errors.firstName
                                                    }
                                                </p>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={6}>
                                                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                                <TextField
                                                    multiline
                                                    // label={"Last Name"}
                                                    type="text"
                                                    name={"lastName"}
                                                    id={"lastName"}
                                                    value={values.lastName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    variant={"filled"}
                                                    fullWidth
                                                    className={loginStyle.inputboxmini}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Badge/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {
                                                        (errors.lastName && touched.lastName) && errors.lastName
                                                    }
                                                </p>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={12}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <TextField
                                                multiline
                                                disabled={isGoogleAuth}
                                                type="email"
                                                id="email"
                                                name="email"
                                                // label="Email"
                                                value={values.email}
                                                onChange={handleChange}
                                                variant={"filled"}
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
                                        <Grid item xs={12} md={12} lg={12}>
                                            <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                                            <TextField
                                                type="text"
                                                id={"phoneNumber"}
                                                name={"phoneNumber"}
                                                value={values.phoneNumber}
                                                // label="Phone Number"
                                                onChange={handleChange}
                                                variant={"filled"}
                                                fullWidth
                                                onBlur={handleBlur}
                                                className={loginStyle.inputbox}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocalPhone/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <p className={`${loginStyle.error}`}>
                                                {
                                                    (errors.phoneNumber && touched.phoneNumber) && errors.phoneNumber
                                                }
                                            </p>
                                        </Grid>
                                        {!isGoogleAuth && <>
                                            <Grid container item xs={12} md={12} lg={12} spacing={2}>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <InputLabel htmlFor="password">Password</InputLabel>
                                                    <TextField
                                                        id="password"
                                                        name="password"
                                                        // label="Password"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        variant={"filled"}
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
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <InputLabel htmlFor="passwordConfirmation">Confirm
                                                        Password</InputLabel>
                                                    <TextField
                                                        type="password"
                                                        autoComplete="new-password"
                                                        id={"passwordConfirmation"}
                                                        name={"passwordConfirmation"}
                                                        value={values.passwordConfirmation}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // label="Confirm Password"
                                                        variant={"filled"}
                                                        fullWidth
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
                                                            (errors.passwordConfirmation && touched.passwordConfirmation) && errors.passwordConfirmation
                                                        }

                                                    </p>
                                                </Grid>
                                            </Grid>
                                        </>}
                                        <Grid item xs={12}>
                                            <Button variant={"contained"} color={"secondary"} fullWidth
                                                    className={`${loginStyle.button}`}
                                                    disabled={isSubmitting || !(isValid && dirty)}
                                                    type={"submit"}
                                            >
                                                Create Account
                                            </Button>

                                        </Grid>
                                    </Grid>


                                </form>
                            )
                        }}

                    </Formik>
                    <Typography className={loginStyle.smalltext}>
                        or continue with
                    </Typography>
                    <div>
                        <IconButton
                            className={loginStyle.avatar}
                            aria-label="google signin"
                            color="primary"
                            onClick={handleSignupWithGoogle}
                        >
                            <Google/>
                        </IconButton>
                    </div>
                    <Typography className={loginStyle.smalltext}>
                        Already have an account? <a className={loginStyle.minilink} href={'/auth/login'}> Login</a>
                    </Typography>
                </div>
            </Box>
        </Paper>
    )
}
export default Signup
