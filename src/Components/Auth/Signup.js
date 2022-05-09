import {useStoreActions, useStoreState} from "easy-peasy";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
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

const Signup = () => {
    const navigate = useNavigate()
    const userDetails = useStoreState(state => state.user.userDetails)
    if (userDetails && userDetails.id) {
        navigate("/")
    }
    const auth = getAuth();
    const passwordValidation = {
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().min(6, "Password should be min 6 character long").required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password is required'),
        phoneNumber: Yup.string().phone("", true, "Phone number must be valid").required("Phone number is required").nullable(false)
    }
    const googleValidation = {
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email().required("Email is required"),
        phoneNumber: Yup.string().phone("", true, "Phone number must be valid").required("Phone number is required").nullable(false)
    }


    const setUserDetails = useStoreActions(actions => actions.user.setUserDetails)

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
                let user = {...response.data.signUp}
                setUserDetails({...user})

                navigate("/")
                toast.success(`Welcome to stonks!`, {
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


    return (<Container maxWidth={"md"}>
        <div className={`${loginStyle.titleContainer}`}>
            <Typography color={"secondary"} variant={"h5"} component={"div"}>
                <b>Sign up</b>
            </Typography>
            <div>
                <Box className={loginStyle.googleBtn} sx={{width: "195px !important"}}>
                    <div className={loginStyle.googleIconWrapper}>
                        <img className={loginStyle.googleIcon}
                             src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                             alt={"google"}/>
                    </div>
                    <p className={loginStyle.btnText}
                       onClick={handleSignupWithGoogle}
                    ><b>Sign up with google</b></p>
                </Box>
            </div>
        </div>
        <div>
            <Formik
                initialValues={{...initialValue}}
                onSubmit={handleSignup}
                enableReinitialize={true}
                validationSchema={Yup.object().shape(isGoogleAuth ? {...googleValidation} : {...passwordValidation})}
            >
                {(props) => {
                    const {
                        values, touched, errors, dirty, handleChange, handleBlur, handleSubmit, isValid, isSubmitting
                    } = props;
                    return (<form onSubmit={handleSubmit} className={`${loginStyle.form}`}>
                        <Grid container alignItems="flex-start" spacing={4}>
                            <Grid item xs={12} md={6}>
                                <label htmlFor={"firstName"} className={`${loginStyle.label}`}>
                                    First name
                                </label>
                                <input type="text"
                                       name={"firstName"}
                                       id={"firstName"}
                                       value={values.firstName}
                                       onChange={handleChange}
                                       onBlur={handleBlur}

                                       className={`${loginStyle.input} ${(errors.firstName && touched.firstName) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.firstName && touched.firstName) && errors.firstName}

                                </p>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor={"lastName"} className={`${loginStyle.label}`}>
                                    Last name
                                </label>
                                <input type="text"
                                       name={"lastName"}
                                       id={"lastName"}
                                       value={values.lastName}
                                       onChange={handleChange}
                                       onBlur={handleBlur}

                                       className={`${loginStyle.input} ${(errors.lastName && touched.lastName) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.lastName && touched.lastName) && errors.lastName}

                                </p>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor={"email"} className={`${loginStyle.label}`}>
                                    Email
                                </label>
                                <input type="email"
                                       disabled={isGoogleAuth}
                                       id={"email"}
                                       name={"email"}
                                       value={values.email}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={`${loginStyle.input} ${(errors.email && touched.email) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.email && touched.email) && errors.email}

                                </p>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <label htmlFor={"phoneNumber"} className={`${loginStyle.label}`}>
                                    Phone Number
                                </label>
                                <input type="text"
                                       id={"phoneNumber"}
                                       name={"phoneNumber"}
                                       value={values.phoneNumber}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       className={`${loginStyle.input} ${(errors.phoneNumber && touched.phoneNumber) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.phoneNumber && touched.phoneNumber) && errors.phoneNumber}

                                </p>
                            </Grid>
                            {!isGoogleAuth && <>
                                <Grid item xs={12} md={6}>
                                    <label htmlFor={"password"} className={`${loginStyle.label}`}>
                                        Password
                                    </label>
                                    <input type="password"
                                           autoComplete="new-password"
                                           id={"password"}
                                           name={"password"}
                                           value={values.password}
                                           onChange={handleChange}
                                           onBlur={handleBlur}

                                           className={`${loginStyle.input} ${(errors.password && touched.password) ? loginStyle.errorBorder : ""}`}

                                    />
                                    <p className={`${loginStyle.error}`}>
                                        {(errors.password && touched.password) && errors.password}

                                    </p>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <label htmlFor={"passwordConfirmation"} className={`${loginStyle.label}`}>
                                        Confirm password
                                    </label>
                                    <input type="password"
                                           autoComplete="new-password"
                                           id={"passwordConfirmation"}
                                           name={"passwordConfirmation"}
                                           value={values.passwordConfirmation}
                                           onChange={handleChange}
                                           onBlur={handleBlur}

                                           className={`${loginStyle.input} ${(errors.passwordConfirmation && touched.passwordConfirmation) ? loginStyle.errorBorder : ""}`}

                                    />
                                    <p className={`${loginStyle.error}`}>
                                        {(errors.passwordConfirmation && touched.passwordConfirmation) && errors.passwordConfirmation}

                                    </p>
                                </Grid>
                            </>}


                            <Grid item xs={12}>
                                <div className={`${loginStyle.alignCenter}`}>
                                    <Button variant={"contained"} color={"secondary"}
                                            className={`${loginStyle.button} `}
                                            disabled={isSubmitting || !(isValid && dirty)}
                                            type={"submit"}
                                    >
                                        complete sign up
                                    </Button>
                                </div>

                            </Grid>
                        </Grid>


                    </form>)
                }}

            </Formik>
        </div>
    </Container>)
}
export default Signup
