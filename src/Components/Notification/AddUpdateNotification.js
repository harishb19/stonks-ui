import {useStoreState} from "easy-peasy";
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {INSERT_NOTIFICATIONS} from "../../graphql/mutation";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {Form, Formik} from "formik";

const AddUpdateNotification = ({open, setOpen, userNotification, coinId, setUserNotification}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [initialValues, setInitialValues] = useState({})
    const [stagingValues, setStagingValues] = useState({})
    const [addFunc] = useMutation(INSERT_NOTIFICATIONS);

    const validationSchema = Yup.object({
        coinId: Yup.string().typeError("Coin must be a string").required('Coin required'),
        topic: Yup.string().typeError("Topic must be selected").required('Topic required'),
        conditionType: Yup.string().typeError("Condition is required").required('Condition is required'),
        condition: Yup.number().typeError("Value must be a number").min(0, "Minimum value must ve greater than 0").required('Value is required')
    })

    const handleInsert = (values, setSubmitting) => {
        console.log(values)
        addFunc({
            variables: {
                input: {...values}
            }
        }).then(({data}) => {
            if (data) {
                setUserNotification([...userNotification, {...data.createNotification}])
                toast.success(`Notification added`, {
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
            console.log(JSON.stringify(e))
            toast.error(`Notification adding failed `, {
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
        let condition = {}
        console.log("=>(AddUpdateNotification.js:80) condition", condition);
        condition[values.conditionType] = Number(values.condition)
        console.log("=>(AddUpdateNotification.js:81) condition", condition);
        let insertObj = {
            userId: userDetails.id,
            coinId: values.coinId,
            condition,
            topic: values.topic
        }
        if (userNotification && userNotification.length > 0) {
            userNotification.forEach(notif => {
                if (notif && notif.topic === values.topic) {
                    setStagingValues({
                        values: {
                            ...insertObj
                        },
                        setSubmitting
                    })
                }
            })
        } else {
            console.log("=>(AddUpdateNotification.js:101) insertObj", insertObj);
            handleInsert(insertObj, setSubmitting)
        }


    }


    useEffect(() => {
        setInitialValues({coinId})

    }, [coinId])


    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{initialValues.id ? "Edit" : "Add"} notification</DialogTitle>
                <DialogContent>
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
                                setFieldValue,
                                handleBlur,
                                handleSubmit,
                                isValid,
                                isSubmitting,
                            } = props;

                            return (<Form onSubmit={handleSubmit} style={{marginTop: "1em"}}>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={12} md={12} lg={4}>
                                        <FormControl fullWidth
                                                     error={errors.topic && touched.topic}
                                        >
                                            <InputLabel id="topic-label">Topic</InputLabel>
                                            <Select
                                                labelId="topic-label"
                                                id="topic"
                                                value={values.topic}
                                                label="Topic"
                                                onChange={(e) => setFieldValue("topic", e.target.value)}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select topic</em>
                                                </MenuItem>
                                                <MenuItem value={"price"}>Price change</MenuItem>
                                                <MenuItem value={"high"}>Market cap high</MenuItem>
                                                <MenuItem value={"low"}>Market cap low</MenuItem>
                                            </Select>
                                            {errors.topic && touched.topic &&
                                                <FormHelperText id="topic-helper-text">{errors.topic}</FormHelperText>
                                            }                                </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <FormControl fullWidth
                                                     error={errors.conditionType && touched.conditionType}
                                        >
                                            <InputLabel id="conditionType-label">Condition</InputLabel>
                                            <Select
                                                labelId="conditionType-label"
                                                id="conditionType"
                                                value={values.conditionType}
                                                label="Condition"
                                                onChange={(e) => setFieldValue("conditionType", e.target.value)}>
                                                <MenuItem value="" disabled>
                                                    <em>Select Condition</em>
                                                </MenuItem>
                                                <MenuItem value={"gt"}> > </MenuItem>
                                                <MenuItem value={"lt"}>  &lt; </MenuItem>
                                                <MenuItem value={"eq"}> = </MenuItem>
                                            </Select>
                                            {errors.conditionType && touched.conditionType &&
                                                <FormHelperText
                                                    id="conditionType-helper-text">{errors.conditionType}</FormHelperText>
                                            }                                </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <TextField
                                            error={errors.condition && touched.condition}
                                            id="condition"
                                            value={values.condition}
                                            name="condition"
                                            label="Value"
                                            helperText={errors.condition}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            variant={"outlined"}
                                            fullWidth={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack justifyContent={"flex-end"} sx={{marginTop: "1em"}}>
                                            <Button type="submit"
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    disabled={isSubmitting || !(isValid && dirty)}
                                            >
                                                Add
                                            </Button>
                                        </Stack>

                                    </Grid>
                                    {/*{JSON.stringify(errors)}*/}
                                </Grid>
                            </Form>)
                        }}
                    </Formik>
                </DialogContent>
            </Dialog>
            <Dialog open={stagingValues && stagingValues.values} disableEscapeKeyDown>
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        A notification already exist for the coin on the same topic. <br/>
                        do you wish to continue creating this notification?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleInsert(stagingValues.values, stagingValues.setSubmitting)
                    }} variant={"contained"}>Yes</Button>
                    <Button onClick={() => {
                        setStagingValues({})
                        setOpen(false)
                    }
                    } variant={"outlined"}>No</Button>
                </DialogActions>
            </Dialog>

        </>

    )
}
export default AddUpdateNotification
