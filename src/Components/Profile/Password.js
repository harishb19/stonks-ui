import React from 'react'
import {
    Button,
    Grid
} from "@mui/material";
import {Form, Formik} from 'formik';
import "yup-phone";
import * as Yup from 'yup';
import {useStoreState} from "easy-peasy";
import {useState,useEffect} from "react";
import loginStyle from "../Auth/css/login.module.css";
import {getAuth,updatePassword, signInWithEmailAndPassword} from "firebase/auth"
import {toast} from "react-toastify";

export default function Password({setUpdatePassword}) {
    const userDetails = useStoreState(state => state.user.userDetails)
    console.log(userDetails)
    const [submitState,setSubmitState] = useState(false)
    const [initialValues, setInitialValues] = useState({})
    const validationSchema = Yup.object({
        currentPassword: Yup.string().required('Current Password is required'),
        password: Yup.string().min(6, "Password should be min 6 character long").required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password is required')
    })
    const handleSubmitOnClick = (values) => {
        setSubmitState(true)
        if(values.currentPassword === values.passwordConfirmation) {
            toast.error(`New password and current password can't be the same`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setSubmitState(false)
            return
        }
        console.log(values)
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
                setSubmitState(false)
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
                setSubmitState(false)
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
            setSubmitState(false)
        })
    }


    useEffect(() => {
        setInitialValues({currentPassword: "", password: "", passwordConfirmation: ""})
    }, [userDetails])

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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

                return (<Form>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={12} md={6}>
                            <label htmlFor={"currentPassword"} className={`${loginStyle.label}`}>
                                Current Password
                            </label>
                            <input type="password"
                                   autoComplete="new-password"
                                   id={"currentPassword"}
                                   name={"currentPassword"}
                                   value={values.currentPassword}
                                   onChange={handleChange}
                                   onBlur={handleBlur}

                                   className={`${loginStyle.input} ${(errors.currentPassword && touched.currentPassword) ? loginStyle.errorBorder : ""}`}

                            />
                            <p className={`${loginStyle.error}`}>
                                {(errors.currentPassword && touched.currentPassword) && errors.currentPassword}

                            </p>
                        </Grid>
                        <Grid item xs={12}/>
                        <Grid item xs={12} md={6}>
                            <label htmlFor={"password"} className={`${loginStyle.label}`}>
                                New Password
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
                                Confirm New Password
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
                        <Grid item xs={12}>
                            <div className={`${loginStyle.alignLeft}`}>
                                <Button variant={"contained"} color={"secondary"}
                                        className={`${loginStyle.button} `}
                                        disabled={submitState || !(isValid && dirty)}
                                        type={"submit"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSubmitOnClick(values)
                                        }}
                                >
                                    Update Password
                                </Button>
                            </div>

                        </Grid>
                    </Grid>
                </Form>)
            }}
        </Formik>
    )
}
