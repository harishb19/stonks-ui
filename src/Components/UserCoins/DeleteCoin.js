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
import {DELETE_USER_COIN} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";


export default function DeleteCoin({open,setOpen, coinId, userId}) {
    const [ValButtonDelete,setValButtonDelete] = React.useState(false)
    const [deleteFunc, { data, loading, error }] =
        useMutation(DELETE_USER_COIN);
    function handleYes() {
        deleteFunc({
            variables: {
                deleteUserCoinId: userId + coinId,
                userId: userId
             }
        }).then(r => console.log(r))
        setOpen(false)
    }
    function handleNo() {
        setOpen(false)
    }
    // const formik = useFormik({
    //     initialValues: {
    //         CoinName: "Bitcoin"
    //     },
    //     validationSchema: Yup.object({
    //         CoinName: Yup.string()
    //     }),
    //     onSubmit: values => {
    //         setValButtonDelete(true)
    //         console.log("Done!")
    //         deleteFunc({
    //             variables: {
    //                 deleteUserCoinId: "TestD",
    //                 userId: "TestU"
    //             }
    //         }).then(r => console.log(r))
    //         console.log(values)
    //         setValButtonDelete(false)
    //         setOpen(false)
    //     },
    // });
    return (
        <Dialog open={open} onClose={handleNo}>
            <DialogTitle>Delete Coin</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure?
                </DialogContentText>
                <br/>
                {/*<form onSubmit={formik.handleSubmit}>*/}
                {/*    <Grid container alignItems="flex-start" spacing={2}>*/}
                {/*        <Grid item xs={12} md={6} lg={4}>*/}
                {/*            <TextField*/}
                {/*                disabled={true}*/}
                {/*                multiline*/}
                {/*                id="CoinName"*/}
                {/*                name="CoinName"*/}
                {/*                label="Coin Name"*/}
                {/*                value={formik.values.CoinName}*/}
                {/*                onChange={formik.handleChange}*/}
                {/*                variant={"outlined"}*/}
                {/*                fullWidth*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*        <Grid item xs={12}/>*/}
                {/*        {formik.errors.CoinName ? <div>{formik.errors.CoinName}</div> : null}*/}
                {/*        <br/>*/}
                {/*        <br/>*/}
                {/*        <Grid item xs={12}>*/}
                {/*            <Button type="submit"*/}
                {/*                    variant={"contained"}*/}
                {/*                    color={"primary"}*/}
                {/*                    disabled={ValButtonDelete}*/}
                {/*            >*/}
                {/*                Delete*/}
                {/*            </Button>*/}
                {/*        </Grid>*/}
                {/*    </Grid>*/}
                {/*</form>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYes}>Yes</Button>
                <Button onClick={handleNo}>No</Button>
            </DialogActions>
        </Dialog>
    )
}