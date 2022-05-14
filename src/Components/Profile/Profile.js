import React, {useEffect, useState} from 'react'
import {Box, Button, Divider, Grid, InputAdornment, InputLabel, Paper, TextField, Typography} from "@mui/material";
import {Formik} from 'formik';
import {Badge, Email, LocalPhone} from '@mui/icons-material'
import "yup-phone";
import * as Yup from 'yup';
import {UPDATE_USER} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";
import {useStoreActions, useStoreState} from "easy-peasy";
import {toast} from "react-toastify";
import Password from "./Password";
import loginStyle from "../Auth/css/login.module.css";
import userStyle from "./css/profile.module.css";
import {UserProfile} from "../Nav/PrimaryAppBar";

export default function Profile() {
    const [updatePassword, setUpdatePassword] = useState(false)
    const userDetails = useStoreState(state => state.user.userDetails)
    const isPasswordProvider = useStoreState(state => state.user.isPasswordProvider)
    const setUserDetails = useStoreActions(actions => actions.user.setUserDetails)
    const [initialValues, setInitialValues] = useState({})
    const [updateUserFunc] = useMutation(UPDATE_USER);
    const regex = /^[0-9]{10}$/
    const validationSchema = Yup.object({
        firstName: Yup.string().typeError("First Name must be valid").required('First Name Required'),
        lastName: Yup.string().typeError("Last Name must be valid").required('Last Name Required'),
        email: Yup.string().email().typeError("Email should be like abc@xyz.com").required('Email Required'),
        phoneNumber: Yup.string().required("Phone number is required").matches(regex, "Phone number is not valid").nullable(false)

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

    return (<Box justifyContent='center' display='flex' alignItems='center' className={userStyle.mainDiv}>
            <Paper elevation={2} className={`${userStyle.root}`}>
                <Box justifyContent='center' display='flex' alignItems='center'
                     sx={{height: "69px", marginBottom: "2em"}}>
                    <UserProfile sx={{width: 69, height: 69}}/>
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
                                                    error={(errors.firstName && touched.firstName)}
                                                    onBlur={handleBlur}
                                                    variant={"outlined"}
                                                    fullWidth
                                                    className={loginStyle.inputboxmini}
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <Badge/>
                                                        </InputAdornment>),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {(errors.firstName && touched.firstName) && errors.firstName}
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
                                                    error={(errors.lastName && touched.lastName)}
                                                    variant={"outlined"}
                                                    fullWidth
                                                    className={loginStyle.inputboxmini}
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <Badge/>
                                                        </InputAdornment>),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {(errors.lastName && touched.lastName) && errors.lastName}
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
                                                    error={(errors.email && touched.email)}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    variant={"outlined"}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    className={loginStyle.inputbox}
                                                    helperText={"Cannot change email"}
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <Email/>
                                                        </InputAdornment>),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {(errors.email && touched.email) && errors.email}
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
                                                    error={(errors.phoneNumber && touched.phoneNumber)}
                                                    onChange={handleChange}
                                                    variant={"outlined"}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    className={loginStyle.inputbox}
                                                    InputProps={{
                                                        startAdornment: (<InputAdornment position="start">
                                                            <LocalPhone/>
                                                        </InputAdornment>),
                                                    }}
                                                />
                                                <p className={`${loginStyle.error}`}>
                                                    {(errors.phoneNumber && touched.phoneNumber) && errors.phoneNumber}
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

                                        </Grid>
                                    </Grid>
                                </form>)
                        }}
                    </Formik>
                </Box>

                {isPasswordProvider && <Grid container sx={{marginTop: "1em"}} spacing={3}>
                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={12}/>
                    <Grid item xs={12}>
                        <Typography variant={"h6"} component={"div"}>
                            Change password
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Password setUpdatePassword={setUpdatePassword}/>
                    </Grid></Grid>
                }


            </Paper>
        </Box>


    )
}
