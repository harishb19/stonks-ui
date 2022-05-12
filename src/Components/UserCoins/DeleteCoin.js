import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {DELETE_USER_COIN} from "../../graphql/mutation";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";


export default function DeleteCoin({open, setOpen, coinId, userId, setUserCoinData}) {
    const [deleteFunc] = useMutation(DELETE_USER_COIN);

    function handleYes() {
        deleteFunc({
            variables: {
                deleteUserCoinId: userId + coinId, userId: userId
            }
        }).then(({data}) => {
            if (data) {
                setUserCoinData({})
                toast.success(`Coin deleted`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setOpen(false)
            }

        }).catch(e => {
            console.log(e.message)
            toast.error(`Coin deletion failed `, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

        })
    }

    function handleNo() {
        setOpen(false)
    }

    return (<Dialog open={open} onClose={handleNo}>
            <DialogTitle>Delete Coin</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYes}>Yes</Button>
                <Button onClick={handleNo}>No</Button>
            </DialogActions>
        </Dialog>)
}
