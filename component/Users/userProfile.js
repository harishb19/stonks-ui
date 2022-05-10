import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {UPDATE_USER} from "../../graphql/queries";
import {useMutation, useQuery} from "@apollo/client";
import {GET_USER} from "../../graphql/queries"

export default function UserProfile({userId}) {
    console.log(userId)
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const [updateUserFunc, { data: dataUpdate, loading: loadingUpdate, error: errorUpdate }] =
        useMutation(UPDATE_USER);
    const { loading, error, data } = useQuery(GET_USER, {
        fetchPolicy: "cache-and-network",
        variables: {
            userId: userId,
        },
    });
    try{
        const formik = useFormik({
            initialValues: {
                FirstName: data.user.firstName,
                LastName: data.user.lastName,
                Email: data.user.email,
                PhoneNumber: data.user.phoneNumber
            },
            validationSchema: Yup.object({
                FirstName: Yup.string().required('Required'),
                LastName: Yup.string().required('Required'),
                Email: Yup.string().email().required('Required'),
                PhoneNumber: Yup.string()
                    .required("Required")
                    .matches(phoneRegExp, 'Phone number is not valid')
                    .min(10, "to short")
                    .max(10, "to long"),
            }),
            onSubmit: values => {
                console.log(values)
                updateUserFunc({
                    variables: {
                        FirstName: values.FirstName,
                        LastName: values.LastName,
                         Email: values.Email,
                        PhoneNumber: values.PhoneNumber,
                    }
                }).then(r => console.log(r))
            },
        });
        return (
            <form onSubmit={formik.handleSubmit}>
                <Grid container alignItems="flex-start" spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            multiline
                            id="FirstName"
                            name="FirstName"
                            label="First Name"
                            value={formik.values.FirstName}
                            onChange={formik.handleChange}
                            variant={"outlined"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}/>
                    {formik.errors.FirstName ? <div>{formik.errors.FirstName}</div> : null}
                    <br/>
                    <br/>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            multiline
                            id="LastName"
                            name="LastName"
                            label="Last Name"
                            value={formik.values.LastName}
                            onChange={formik.handleChange}
                            variant={"outlined"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}/>
                    {formik.errors.LastName ? <div>{formik.errors.LastName}</div> : null}
                    <br/>
                    <br/>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            multiline
                            id="Email"
                            name="Email"
                            label="Email"
                            value={formik.values.Email}
                            onChange={formik.handleChange}
                            variant={"outlined"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}/>
                    {formik.errors.Email ? <div>{formik.errors.Email}</div> : null}
                    <br/>
                    <br/>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            multiline
                            id="PhoneNumber"
                            name="PhoneNumber"
                            label="Phone Number"
                            value={formik.values.PhoneNumber}
                            onChange={formik.handleChange}
                            variant={"outlined"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}/>
                    {formik.errors.PhoneNumber ? <div>{formik.errors.PhoneNumber}</div> : null}
                    <br/>
                    <br/>
                    <Grid item xs={12}>
                        <Button type="submit"
                                variant={"contained"}
                                color={"primary"}
                        >Update
                        </Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
    catch(e) {
        if(error){
            return <div>Error!</div>
        }
        else if (loading) {
            return <div>Loading!</div>
        }
        return <div>Some unknown error occurred!</div>
    }
}