import React, {useEffect, useState} from 'react'
import {Button, Grid, InputAdornment, InputLabel, TextField} from "@mui/material";
import {Lock} from '@mui/icons-material'
import {Formik} from 'formik';
import "yup-phone";
import * as Yup from 'yup';
import {useStoreState} from "easy-peasy";
import loginStyle from "../Auth/css/login.module.css";
import {getAuth, signInWithEmailAndPassword, updatePassword} from "firebase/auth"
import {toast} from "react-toastify";

export default function Password({setUpdatePassword}) {
    const userDetails = useStoreState(state => state.user.userDetails)
    const [initialValues, setInitialValues] = useState({})
    const validationSchema = Yup.object({
        currentPassword: Yup.string().required('Current Password is required'),
        password: Yup.string().min(6, "Password should be min 6 character long").required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password is required')
    })
    const handleSubmitOnClick = (values, {setSubmitting}) => {
        setSubmitting(true)
        if (values.currentPassword === values.passwordConfirmation) {
            toast.error(`New password and current password can't be the same`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setSubmitting(false)
            return
        }
        const auth = getAuth();
        const user = auth.currentUser;
        signInWithEmailAndPassword(auth, userDetails.email, values.currentPassword).then((data) => {
            updatePassword(user, values.passwordConfirmation).then((data) => {
                toast.success(`Password updated`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)
                setUpdatePassword(false)
            }).catch((e) => {
                toast.error(`${JSON.stringify(e)}`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)
            })
        }).catch((e) => {
            toast.error(`Wrong Password`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setSubmitting(false)
        })
    }


    useEffect(() => {
        setInitialValues({currentPassword: "", password: "", passwordConfirmation: ""})
    }, [userDetails])

    return (<Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnMount
        onSubmit={handleSubmitOnClick}
    >
        {(props) => {
            const {
                values, touched, errors, dirty, handleChange, handleBlur, handleSubmit, isValid, isSubmitting,
            } = props;

            return (<form onSubmit={handleSubmit}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid container item xs={12} md={12} lg={12} spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                            <TextField
                                type="password"
                                autoComplete="new-password"
                                id={"currentPassword"}
                                name={"currentPassword"}
                                value={values.currentPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(errors.currentPassword && touched.currentPassword)}
                                // label="Confirm Password"
                                variant={"outlined"}
                                fullWidth
                                className={loginStyle.inputbox}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Lock/>
                                    </InputAdornment>),
                                }}
                            />
                            <p className={`${loginStyle.error}`}>
                                {(errors.currentPassword && touched.currentPassword) && errors.currentPassword}

                            </p>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <InputLabel htmlFor="password">New Password</InputLabel>
                            <TextField
                                type="password"
                                autoComplete="new-password"
                                id={"password"}
                                name={"password"}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(errors.password && touched.password)}
                                // label="Confirm Password"
                                variant={"outlined"}
                                fullWidth
                                className={loginStyle.inputbox}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Lock/>
                                    </InputAdornment>),
                                }}
                            />
                            <p className={`${loginStyle.error}`}>
                                {(errors.password && touched.password) && errors.password}

                            </p>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <InputLabel htmlFor="passwordConfirmation">Confirm New Password</InputLabel>
                            <TextField
                                type="password"
                                autoComplete="new-password"
                                id={"passwordConfirmation"}
                                name={"passwordConfirmation"}
                                value={values.passwordConfirmation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(errors.passwordConfirmation && touched.passwordConfirmation)}
                                // label="Confirm Password"
                                variant={"outlined"}
                                fullWidth
                                className={loginStyle.inputbox}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <Lock/>
                                    </InputAdornment>),
                                }}
                            />
                            <p className={`${loginStyle.error}`}>
                                {(errors.passwordConfirmation && touched.passwordConfirmation) && errors.passwordConfirmation}

                            </p>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Button variant={"contained"} color={"secondary"}
                                    className={`${loginStyle.button} `}
                                    disabled={isSubmitting || !(isValid && dirty)}
                                    type={"submit"}
                            >
                                Update Password
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>
            </form>)
        }}
    </Formik>)
}
