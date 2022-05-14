import React, {useEffect, useState} from 'react'
import {Avatar, Box, Button, Grid, InputAdornment, InputLabel, Paper, TextField, Typography} from "@mui/material";
import {Formik} from 'formik';
import {AccountCircle, Badge, Email, LocalPhone} from '@mui/icons-material'
import "yup-phone";
import * as Yup from 'yup';
import {UPDATE_USER} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";
import {useStoreActions, useStoreState} from "easy-peasy";
import {toast} from "react-toastify";
import Password from "./Password";
import loginStyle from "../Auth/css/login.module.css";
import userStyle from "./css/profile.module.css";

export default function Profile() {
    const [updatePassword, setUpdatePassword] = useState(false)
    const userDetails = useStoreState(state => state.user.userDetails)
    console.log(userDetails)
    const setUserDetails = useStoreActions(actions => actions.user.setUserDetails)
    console.log(userDetails)
    const [initialValues, setInitialValues] = useState({})
    const [updateUserFunc] = useMutation(UPDATE_USER);
    const validationSchema = Yup.object({
        firstName: Yup.string().typeError("First Name must be valid").required('First Name Required'),
        lastName: Yup.string().typeError("Last Name must be valid").required('Last Name Required'),
        email: Yup.string().email().typeError("Email should be like abc@xyz.com").required('Email Required'),
        phoneNumber: Yup.string().phone("", true, "Phone number must be valid").required("Phone number is required").nullable(false)

    })

    const handleSubmit = (values, {setSubmitting}) => {
        setSubmitting(true)
        console.log(values)
        updateUserFunc({
            variables: {
                updateUserId: userDetails.id,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber,
            }
        }).then(({data}) => {
            if (data) {
                setUserDetails({...data.updateUser})
                toast.success(`User updated`, {
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

        }).catch(e => {
            console.log(JSON.stringify(e))
            toast.error(`User update failed `, {
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
        setInitialValues({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
        })
    }, [userDetails])

    return (
        <Box justifyContent='center' display='flex' alignItems='center' className={userStyle.mainDiv}>
            <Paper elevation={2} className={`${userStyle.root}`}>
                <Box justifyContent='center' display='flex' alignItems='center'>
                    <Avatar className={userStyle.avatar}>
                        <AccountCircle className={userStyle.avatarImage}/>
                    </Avatar>
                </Box>
                <Box justifyContent='center' display='flex' alignItems='center' className={userStyle.div}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                        validateOnMount
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
                                isSubmitting,
                            } = props;

                            return (

                                <form onSubmit={handleSubmit}>
                                    <Grid container alignItems="center" spacing={2}>
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
                                                    variant={"outlined"}
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
                                                    variant={"outlined"}
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
                                            <Grid item xs={12} md={12} lg={12}>
                                                <InputLabel htmlFor="email">Email</InputLabel>
                                                <TextField
                                                    disabled
                                                    multiline
                                                    type="email"
                                                    id="email"
                                                    name="email"
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
                                            <Grid item xs={12} md={12} lg={12}>
                                                <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                                                <TextField
                                                    type="text"
                                                    id={"phoneNumber"}
                                                    name={"phoneNumber"}
                                                    value={values.phoneNumber}
                                                    // label="Phone Number"
                                                    onChange={handleChange}
                                                    variant={"outlined"}
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
                                            <Grid item xs={12} md={12} lg={12}>
                                                {/*<div className={`${loginStyle.alignLeft}`}>*/}
                                                <Button color={"secondary"} fullWidth
                                                        className={`${loginStyle.button}`}
                                                        disabled={isSubmitting || !(isValid && dirty)}
                                                        type={"submit"}
                                                >
                                                    Update
                                                </Button>
                                                {/*</div>*/}
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12}>
                                                {updatePassword ?
                                                    <Password setUpdatePassword={setUpdatePassword}/>
                                                    :
                                                    <Grid item xs={12} alignItems="center">
                                                        <Typography
                                                            className={`${loginStyle.smalltext} ${loginStyle.minilink}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setUpdatePassword(true)
                                                            }}>
                                                            Update Password</Typography>

                                                    </Grid>}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>)
                        }}
                    </Formik>
                </Box>
            </Paper>
        </Box>


    )
}
