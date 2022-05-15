import React, {useEffect, useState} from 'react'
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FilledInput,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Stack,
    TextField
} from "@mui/material";
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {ADD_USER_COIN, UPDATE_USER_COIN} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {useStoreState} from "easy-peasy";
import {blackColor} from "../../Common/Colors";

export default function UserCoinAction({open, setOpen, userCoinData, coinId, setUserCoinData}) {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [initialValues, setInitialValues] = useState({})

    const [addFunc] = useMutation(ADD_USER_COIN);
    const [updateFunc] = useMutation(UPDATE_USER_COIN);

    const validationSchema = Yup.object({
        coinId: Yup.string().typeError("Coin name must be valid").required("Coin name required"),
        quantity: Yup.number().typeError("Quantity must be a number").min(0.01).required('Quantity required'),
        totalPrice: Yup.number().typeError("Price must be a number").min(0).required('Price required')
    })

    const handleCreate = (values, setSubmitting) => {
        addFunc({
            variables: {
                userId: userDetails.id,
                coinId: values.coinId,
                quantity: Number(values.quantity),
                price: Number(values.totalPrice)
            }
        }).then(({data}) => {
            if (data) {
                setUserCoinData({...data.addUserCoin})
                toast.success(`Coin added`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)
                setOpen(false)
            }

        }).catch(e => {
            console.log(e.message)
            toast.error(`Coins adding failed `, {
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
    const handleUpdate = (values, setSubmitting) => {
        updateFunc({
            variables: {
                updateUserCoinId: values.id,
                userId: userDetails.id,
                quantity: Number(values.quantity),
                price: Number(values.totalPrice)
            }
        }).then(({data}) => {
            if (data) {
                setUserCoinData({...data.updateUserCoin})
                toast.success(`Coins updated`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)
                setOpen(false)
            }
        }).catch(e => {
            console.log(`${e}`)
            console.log(JSON.stringify(e))

            toast.error(`Coins update failed `, {
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
    const handleSubmit = (values, {setSubmitting}) => {
        setSubmitting(true)

        if (values.id) {
            handleUpdate(values, setSubmitting)
        } else {
            handleCreate(values, setSubmitting)
        }


    }

    function handleClose() {
        setOpen(false)
    }

    useEffect(() => {
        setInitialValues({...userCoinData, coinId})
    }, [userCoinData, coinId])

    return (<Dialog open={open} onClose={handleClose}>
        <DialogTitle component={"p"}
                     sx={{backgroundColor: blackColor}}>{initialValues.id ? "Edit" : "Add"} holdings</DialogTitle>
        <DialogContent sx={{backgroundColor: blackColor}}>
            <DialogContentText>
                {initialValues.id ? "Edit" : "Add"} holdings for the coin
            </DialogContentText>
            <br/>
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
                        <Grid container alignItems="flex-start" spacing={2}>
                            <Grid item xs={12} md={6} lg={4}>
                                <TextField
                                    disabled={true}
                                    id="coinId"
                                    name="coinId"
                                    label="Coin Name"
                                    value={values.coinId}
                                    variant={"standard"}
                                    fullWidth
                                    error={errors.coinId && touched.coinId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12}/>
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField
                                    error={errors.quantity && touched.quantity}
                                    id="quantity"
                                    value={values.quantity}
                                    name="quantity"
                                    label="Quantity"
                                    helperText={errors.quantity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    variant={"filled"}
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <FormControl variant={"filled"} fullWidth error={errors.price && touched.price}
                                >
                                    <InputLabel htmlFor="totalPrice">Price per coin</InputLabel>
                                    <FilledInput
                                        id="totalPrice"
                                        value={values.totalPrice}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.totalPrice && touched.totalPrice}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Price per coin"
                                    />
                                    {errors.totalPrice && touched.totalPrice &&
                                        <FormHelperText id="my-helper-text">{errors.totalPrice}</FormHelperText>
                                    }
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <Stack justifyContent={"flex-end"} sx={{marginTop: "1em"}}>
                                    <Button type="submit"
                                            variant={"contained"}
                                            color={"secondary"}
                                            disabled={isSubmitting || !(isValid && dirty)}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Form>)
                }}
            </Formik>
        </DialogContent>
        {/*<DialogActions>*/}
        {/*    <Button onClick={handleClose}>Close</Button>*/}
        {/*</DialogActions>*/}
    </Dialog>)
}
