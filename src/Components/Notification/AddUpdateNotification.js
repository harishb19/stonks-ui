import {useStoreState} from "easy-peasy";
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {INSERT_NOTIFICATIONS, UPDATE_NOTIFICATIONS} from "../../graphql/mutation";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {
    Button,
    CircularProgress,
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
import {blackColor} from "../../Common/Colors";
import Loading from "../Loading/Loading";

const numberConverter = (number, type) => {
    switch (type) {
        case "na":
            console.log("=>(AddUpdateNotification.js:29) number", number);
            return number
        case "k":
            console.log("=>(AddUpdateNotification.js:32) ", number * (10 ** 3));
            return number * (10 ** 3)
        case "m":
            console.log("=>(AddUpdateNotification.js:35) number * 10 ^ 6", number * (10 ** 6));
            return number * (10 ** 6)
        case "b":
            console.log("=>(AddUpdateNotification.js:38) number * 10 ^ 9", number * (10 ** 9));
            return number * (10 ** 9)
        case "t":
            console.log("=>(AddUpdateNotification.js:41) number * 10 ^ 12", number * (10 ** 12));
            return number * (10 ** 12)
        default:
            return number
    }
}
const AddUpdateNotification = ({open, setOpen, userNotification, coinId, setUserNotification}) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [initialValues, setInitialValues] = useState({amountType: "na"})
    const [stagingValues, setStagingValues] = useState({})
    const [addFunc] = useMutation(INSERT_NOTIFICATIONS);

    const validationSchema = Yup.object({
        coinId: Yup.string().typeError("Coin must be a string").required('Coin required'),
        topic: Yup.string().typeError("Topic must be selected").required('Topic required'),
        conditionType: Yup.string().typeError("Condition is required").required('Condition is required'),
        condition: Yup.number().typeError("Value must be a number").min(1, "Minimum value must ve greater than 0").required('Value is required'),
        amountType: Yup.string().typeError("Magnitude required").required('Magnitude is required')
    })

    const handleInsert = (values, setSubmitting) => {
        console.log(values)
        addFunc({
            variables: {
                input: {...values}
            }
        }).then(({data}) => {
            if (data) {
                console.log([...userNotification, {...data.createNotification}])
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
        condition[values.conditionType] = numberConverter(Number(values.condition), values.amountType)
        console.log("=>(AddUpdateNotification.js:98) values.amountType", values.amountType);
        console.log("=>(AddUpdateNotification.js:81) condition", condition);
        let insertObj = {
            userId: userDetails.id,
            coinId: values.coinId,
            condition,
            topic: values.topic
        }
        if (userNotification && userNotification.length > 0) {
            let check = 0
            userNotification.forEach(notif => {
                if (notif && notif.topic === values.topic) {
                    check++
                    setStagingValues({
                        values: {
                            ...insertObj
                        },
                        setSubmitting
                    })
                }
            })
            if (check === 0) {
                handleInsert(insertObj, setSubmitting)
            }
        } else {
            console.log("=>(AddUpdateNotification.js:101) insertObj", insertObj);
            handleInsert(insertObj, setSubmitting)
        }


    }


    useEffect(() => {
        setInitialValues({coinId, amountType: "na"})

    }, [coinId])


    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle component={"p"}
                             sx={{backgroundColor: blackColor}}>{initialValues.id ? "Edit" : "Add"} notification</DialogTitle>
                <DialogContent sx={{backgroundColor: blackColor}}>
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
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant={"filled"}
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
                                                <MenuItem value={"high"}>Market cap</MenuItem>
                                            </Select>
                                            {errors.topic && touched.topic &&
                                                <FormHelperText id="topic-helper-text">{errors.topic}</FormHelperText>
                                            }                                </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant={"filled"}
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
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={errors.condition && touched.condition}
                                            id="condition"
                                            value={values.condition}
                                            name="condition"
                                            label="Value"
                                            helperText={errors.condition}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            variant={"filled"}
                                            fullWidth={true}
                                        />
                                    </Grid>
                                    {
                                        values.topic && values.topic !== "price" && <Grid item xs={12} md={6}>
                                            <FormControl fullWidth variant={"filled"}
                                                         error={errors.amountType && touched.amountType}
                                            >
                                                <InputLabel id="conditionType-label">Magnitude</InputLabel>
                                                <Select
                                                    labelId="conditionType-label"
                                                    id="amountType"
                                                    value={values.conditionType}
                                                    label="Magnitude"
                                                    defaultValue={"na"}
                                                    onChange={(e) => setFieldValue("amountType", e.target.value)}>
                                                    <MenuItem value="" disabled>
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    <MenuItem value={"na"}> none </MenuItem>
                                                    <MenuItem value={"k"}> K </MenuItem>
                                                    <MenuItem value={"m"}> M </MenuItem>
                                                    <MenuItem value={"b"}> B </MenuItem>
                                                    <MenuItem value={"t"}> T </MenuItem>
                                                </Select>
                                                {errors.amountType && touched.amountType &&
                                                    <FormHelperText
                                                        id="conditionType-helper-text">{errors.amountType}</FormHelperText>
                                                }                                </FormControl>
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <Stack justifyContent={"flex-end"} sx={{marginTop: "1em"}}>
                                            <Button type="submit"
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    disabled={isSubmitting || !(isValid && dirty)}
                                            >
                                                {
                                                    isSubmitting ? <CircularProgress/> : "Add"
                                                }

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
                <DialogTitle sx={{backgroundColor: blackColor}}>Warning</DialogTitle>
                <DialogContent sx={{backgroundColor: blackColor}}>
                    <DialogContentText>
                        A notification already exist for the coin on the same topic. <br/>
                        do you wish to continue creating this notification?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{backgroundColor: blackColor}}>
                    <Button onClick={() => {
                        handleInsert(stagingValues.values, stagingValues.setSubmitting)
                        setStagingValues({})
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
export const UpdateNotification = ({
                                       id,
                                       setOpen,
                                       topic,
                                       condition,
                                       amountType,
                                       conditionType,
                                       setUserNotification,
                                       refetch
                                   }) => {
    const userDetails = useStoreState(state => state.user.userDetails)

    const [initialValues, setInitialValues] = useState({})
    const [stagingValues, setStagingValues] = useState({})
    const [updateNotif] = useMutation(UPDATE_NOTIFICATIONS);

    const validationSchema = Yup.object({
        topic: Yup.string().typeError("Topic must be selected").required('Topic required'),
        conditionType: Yup.string().typeError("Condition is required").required('Condition is required'),
        condition: Yup.number().typeError("Value must be a number").min(1, "Minimum value must ve greater than 0").required('Value is required'),
        amountType: Yup.string().typeError("Magnitude required").required('Magnitude is required')
    })

    const handleUpdate = (values, setSubmitting) => {
        console.log(values)
        updateNotif({
            variables: {
                ...values
            }
        }).then(({data}) => {
            if (data) {
                // setUserNotification((userNotification) => [...userNotification, {...data.createNotification}])
                refetch()
                toast.success(`Notification updated`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setStagingValues({})
                setSubmitting(false)
                setOpen(false)
            }

        }).catch(e => {
            console.log(JSON.stringify(e))
            console.log(e)
            if (e) {
                toast.error(`Notification update failed `, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setSubmitting(false)
            } else {
                setOpen(false)
            }

        })
    }
    const handleSubmit = (values, {setSubmitting}) => {
        setSubmitting(true)
        let condition = {}
        condition[values.conditionType] = numberConverter(Number(values.condition), values.amountType)

        let insertObj = {
            userId: userDetails.id,
            condition,
            id: values.id
        }

        setStagingValues({
            values: {
                ...insertObj
            },
            setSubmitting
        })
    }


    useEffect(() => {
        let type = "na"
        if (amountType || amountType === "" || amountType === " ") {
            type = amountType.toLowerCase().trim()
        }
        setInitialValues({id, topic, condition, conditionType, amountType: type})

    }, [topic, condition, amountType, conditionType, id])

    if (initialValues && initialValues.id) {
        return (
            <>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
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
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant={"filled"}
                                                 error={errors.topic && touched.topic}
                                    >
                                        <InputLabel id="topic-label">Topic</InputLabel>
                                        <Select
                                            labelId="topic-label"
                                            id="topic"
                                            disabled
                                            value={values.topic}
                                            defaultValue={initialValues.topic}
                                            label="Topic"
                                            onChange={(e) => setFieldValue("topic", e.target.value)}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Select topic</em>
                                            </MenuItem>
                                            <MenuItem value={"price"}>Price change</MenuItem>
                                            <MenuItem value={"high"}>Market cap</MenuItem>
                                        </Select>
                                        {errors.topic && touched.topic &&
                                            <FormHelperText id="topic-helper-text">{errors.topic}</FormHelperText>
                                        }                                </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant={"filled"}
                                                 error={errors.conditionType && touched.conditionType}
                                    >
                                        <InputLabel id="conditionType-label">Condition</InputLabel>
                                        <Select
                                            disabled
                                            labelId="conditionType-label"
                                            id="conditionType"
                                            value={values.conditionType}
                                            defaultValue={initialValues.conditionType}
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={errors.condition && touched.condition}
                                        id="condition"
                                        value={values.condition}
                                        name="condition"
                                        label="Value"
                                        defaultValue={initialValues.condition}
                                        helperText={errors.condition}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant={"filled"}
                                        fullWidth={true}
                                    />
                                </Grid>
                                {
                                    values.topic && values.topic !== "price" && <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant={"filled"}
                                                     error={errors.amountType && touched.amountType}
                                        >
                                            <InputLabel id="conditionType-label">Magnitude</InputLabel>
                                            <Select
                                                labelId="conditionType-label"
                                                id="amountType"
                                                value={values.amountType}
                                                label="Magnitude"
                                                defaultValue={initialValues.amountType}
                                                onChange={(e) => setFieldValue("amountType", e.target.value)}>
                                                <MenuItem value="" disabled>
                                                    <em>Select</em>
                                                </MenuItem>
                                                <MenuItem value={"na"}> none </MenuItem>
                                                <MenuItem value={"k"}> K </MenuItem>
                                                <MenuItem value={"m"}> M </MenuItem>
                                                <MenuItem value={"b"}> B </MenuItem>
                                                <MenuItem value={"t"}> T </MenuItem>
                                            </Select>
                                            {errors.amountType && touched.amountType &&
                                                <FormHelperText
                                                    id="conditionType-helper-text">{errors.amountType}</FormHelperText>
                                            }                                </FormControl>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "1em"}}>
                                        {/*<Box>*/}
                                        <Button type="submit"
                                                fullWidth
                                                variant={"contained"}
                                                color={"primary"}
                                                disabled={isSubmitting || !(isValid && dirty)}
                                                sx={{marginRight: "1em"}}
                                        >
                                            {
                                                isSubmitting ? <CircularProgress/> : "Update"
                                            }

                                        </Button>
                                        {/*</Box>*/}
                                        {/*<Box>*/}
                                        <Button
                                            fullWidth
                                            variant={"contained"}
                                            color={"primary"}
                                            disabled={isSubmitting}
                                            onClick={() => setOpen(false)}
                                        >
                                            {
                                                isSubmitting ? <CircularProgress/> : "Cancel"
                                            }

                                        </Button>
                                        {/*</Box>*/}

                                    </Stack>

                                </Grid>
                                {/*{JSON.stringify(errors)}*/}
                            </Grid>
                        </Form>)
                    }}
                </Formik>

                <Dialog open={stagingValues && stagingValues.values} disableEscapeKeyDown>
                    <DialogTitle sx={{backgroundColor: blackColor}}>Warning</DialogTitle>
                    <DialogContent sx={{backgroundColor: blackColor}}>
                        <DialogContentText>
                            Do you really wish to update the notification?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{backgroundColor: blackColor}}>
                        <Button onClick={() => {
                            handleUpdate(stagingValues.values, stagingValues.setSubmitting)
                            setStagingValues({})
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
    return <Loading/>
}
export default AddUpdateNotification
