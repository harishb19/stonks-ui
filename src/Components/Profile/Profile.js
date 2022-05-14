import React from 'react'
import {
    Button,
    Grid
} from "@mui/material";
import {Form, Formik} from 'formik';
import "yup-phone";
import * as Yup from 'yup';
import {UPDATE_USER} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useState,useEffect} from "react";
import {toast} from "react-toastify";
import Password from "./Password";
import loginStyle from "../Auth/css/login.module.css";
import userStyle from "./css/profile.module.css";

export default function Profile() {
    const [updatePassword,setUpdatePassword] = useState(false)
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
        setInitialValues({firstName: userDetails.firstName,lastName: userDetails.lastName,email: userDetails.email,phoneNumber: userDetails.phoneNumber})
    }, [userDetails])

    return (
        <div>
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

                    return (<Form onSubmit={handleSubmit}>
                        <Grid container  className={userStyle.center} spacing={2}>
                            <Grid item xs={12} md={6} lg={3}>
                                <label htmlFor={"firstName"} className={`${loginStyle.label}`}>
                                    First Name
                                </label>
                                <input type="firstName"
                                       id={"firstName"}
                                       name={"firstName"}
                                       value={values.firstName}
                                       onChange={handleChange}
                                       onBlur={handleBlur}

                                       className={`${loginStyle.input} ${(errors.firstName && touched.firstName) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.firstName && touched.firstName) && errors.firstName}

                                </p>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <label htmlFor={"lastName"} className={`${loginStyle.label}`}>
                                    Last Name
                                </label>
                                <input type="lastName"
                                       id={"lastName"}
                                       name={"lastName"}
                                       value={values.lastName}
                                       onChange={handleChange}
                                       onBlur={handleBlur}

                                       className={`${loginStyle.input} ${(errors.lastName && touched.lastName) ? loginStyle.errorBorder : ""}`}

                                />
                                <p className={`${loginStyle.error}`}>
                                    {(errors.lastName && touched.lastName) && errors.lastName}

                                </p>
                            </Grid>
                            <Grid item xs={12}/>
                            <Grid item xs={12} md={6} lg={6}>
                                <label htmlFor={"email"} className={`${loginStyle.label}`}>
                                    Email
                                </label>
                                <input type="email"
                                       disabled={true}
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
                            <Grid item xs={12}/>
                            <Grid item xs={12} md={6} lg={6}>
                                <label htmlFor={"phoneNumber"} className={`${loginStyle.label}`}>
                                    Phone Number
                                </label>
                                <input type="phoneNumber"
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
                            <Grid item xs={12}>
                                <div className={`${loginStyle.alignLeft}`}>
                                    <Button variant={"contained"} color={"secondary"}
                                            className={`${loginStyle.button} `}
                                            disabled={isSubmitting || !(isValid && dirty)}
                                            type={"submit"}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </Grid>
                            {updatePassword?
                                <>
                                    <Grid item xs={12}/>
                                    <Password setUpdatePassword = {setUpdatePassword}/>
                                </>
                                :
                                <Grid item xs={12}>
                                    <div className={`${loginStyle.alignLeft}`}>
                                        <Button variant={"contained"} color={"secondary"}
                                                className={`${userStyle.btn} `}
                                                type={"submit"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUpdatePassword(true)
                                                }}
                                        >
                                            Update password?
                                        </Button>
                                    </div>
                                </Grid>}
                        </Grid>
                    </Form>)
                }}
            </Formik>
        </div>

    )
}
