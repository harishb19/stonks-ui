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
import {UPDATE_USER_COIN} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";


export default function UpdateCoin({open,setOpen,coinId,userId}) {
    const [ValButtonUpdate,setValButtonUpdate] = React.useState(false)
    const [updateFunc, { data, loading, error }] =
        useMutation(UPDATE_USER_COIN);
    function handleClose() {
        setOpen(false)
    }
    const formik = useFormik({
        initialValues: {
            CoinName: coinId,
            Quantity: 0,
            Price: 0,
        },
        validationSchema: Yup.object({
            CoinName: Yup.string(),
            Quantity: Yup.number()
                .required('Required'),
            Price: Yup.number()
                .required('Required')
        }),
        onSubmit: values => {
            setValButtonUpdate(true)
            console.log("Done!")
            updateFunc({
                variables: {
                    updateUserCoinId: userId+coinId,
                    userId:userId,
                    quantity: Number(values.Quantity),
                    price: Number(values.Price)
                }
            }).then(r => console.log(r))
            console.log(values)
            setValButtonUpdate(false)
            setOpen(false)
        },
    });
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Coin</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Update this coin on your dashboard.
                </DialogContentText>
                <br/>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                disabled={true}
                                multiline
                                id="CoinName"
                                name="CoinName"
                                label="Coin Name"
                                value={formik.values.CoinName}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.CoinName ? <div>{formik.errors.CoinName}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                multiline
                                id="Quantity"
                                name="Quantity"
                                label="Quantity"
                                value={formik.values.Quantity}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.Quantity ? <div>{formik.errors.Quantity}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                multiline
                                id="Price"
                                name="Price"
                                label="Price"
                                value={formik.values.Price}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.Price ? <div>{formik.errors.Price}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12}>
                            <Button type="submit"
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={ValButtonUpdate}
                            >
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}