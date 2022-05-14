import {DataGrid, gridClasses} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import Sparkline from "./Sparkline";
import PriceUpDown from "./PriceUpDown";
import {Box, Grid, LinearProgress, Stack, Tooltip, tooltipClasses, Typography} from "@mui/material";
import {greyColor} from "../../Common/Colors";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import {InfoOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import AnimatedNumber from "./AnimatedNumber";
import NotificationActions from "../Notification/NotificationActions";
import {useStoreState} from "easy-peasy";
import React, {useEffect, useState} from "react"
import AnimatedNumberWrapper from "./AnimatedNumberWrapper";

const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");


const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 'none', boxShadow: 0, '.MuiDataGrid-cell': {
        border: 'none',
    }, '& .MuiDataGrid-columnSeparator': {
        visibility: 'hidden',
    }, "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
        outline: "none"
    }, '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'rgba(50, 50, 50, 0.5)', borderBottom: '1px solid rgba(53, 53, 53)',
    }, [`& .${gridClasses.row}.transparentRow`]: {
        borderBottom: '1px solid rgba(53, 53, 53)',
        transition: 'all 200ms ease-out',
        backgroundColor: 'rgba(50, 50, 50, 0.35)',
        cursor: "pointer",
        '&:hover, &.Mui-hovered': {
            transition: 'all 200ms ease-im', backgroundColor: 'rgba(50, 50, 50, 0.55)',
        },
    }, '& .MuiPaginationItem-root': {
        border: 0,
    },
}));

const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#18191A", minWidth: '300px', padding: "20px"
    },
}));


const defaultColumns = [{
    field: 'rank',
    headerName: 'Rank',
    editable: false,
    width: 55,
    headerAlign: 'center',
    type: 'number',
    align: 'center',
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.rank ? params.row.coins_market_data.rank : 0}`
}, {
    field: 'name',
    headerName: 'Name',
    editable: false,
    minWidth: 250,
    headerAlign: 'left',
    renderCell: (params) => (<Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
        <img src={params.row.image || ''} alt={params.row.name || 'coin'} onError={onMediaFallback} width={"30px"}
             height={"30px"}/>
        {
            params.row.name &&
            <Typography variant={"h6"} component={"p"}>
                {params.row.name}
            </Typography>
        }
        {
            params.row.symbol &&
            <Typography variant={"subtitle2"} component={"p"} sx={{color: greyColor}}>
                {params.row.symbol.toUpperCase()}
            </Typography>
        }
    </Stack>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.name ? params.row.name : ''}`
}, {
    field: 'currentPrice',
    headerName: 'Price',
    headerAlign: 'right',
    type: 'number',
    minWidth: 110,
    editable: false,
    renderCell: (params) => (<Stack direction={"row"} spacing={1} alignItems={"center"}>
        <AnimatedNumberWrapper displayType={'text'}
                               value={params.row.coins_market_data && params.row.coins_market_data.currentPrice ? params.row.coins_market_data.currentPrice : 0}
                               thousandSeparator={true}
                               prefix="$"
                               decimalSeparator="."
                               decimalScale={2}
                               fixedDecimalScale={true}/>
        <HtmlTooltip
            title={<React.Fragment>
                <Typography color="inherit" textAlign={"center"} component={"p"}
                            variant={"subtitle2"}>{params.row.name ? params.row.name : ""} Price
                    Change</Typography>
                <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                    <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                        1 Hour</Typography>
                    <PriceUpDown fontSize={'15px'}
                                 fontWeight={'500'}
                                 value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage1h ? params.row.coins_market_data.priceChangePercentage1h : 0}
                                 arrow={false}/>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                    <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                        24 Hours</Typography>
                    <PriceUpDown fontSize={'15px'}
                                 fontWeight={'500'}
                                 value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage24h ? params.row.coins_market_data.priceChangePercentage24h : 0}
                                 arrow={false}/>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                    <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                        7 Days</Typography>
                    <PriceUpDown fontSize={'15px'}
                                 fontWeight={'500'}
                                 value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage7d ? params.row.coins_market_data.priceChangePercentage7d : 0}
                                 arrow={false}/>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                    <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                        30 Days</Typography>
                    <PriceUpDown fontSize={'15px'}
                                 fontWeight={'500'}
                                 value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage30d ? params.row.coins_market_data.priceChangePercentage30d : 0}
                                 arrow={false}/>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                    <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                        1 Year</Typography>
                    <PriceUpDown fontSize={'15px'}
                                 fontWeight={'500'}
                                 value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage1y ? params.row.coins_market_data.priceChangePercentage1y : 0}
                                 arrow={false}/>
                </Stack>
            </React.Fragment>}
        >
            <InfoOutlined sx={{color: greyColor, fontSize: "15px"}}/>
        </HtmlTooltip>
    </Stack>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.currentPrice ? params.row.coins_market_data.currentPrice : '0'}`
}, {
    field: 'percent',
    headerAlign: 'center',
    headerName: '% Change',
    description: 'This column has a value getter and is not sortable.',
    editable: false,
    type: 'number',
    minWidth: 70,
    align: "center",
    renderCell: (params) => (<PriceUpDown fontSize={"1em"} fontWeight={"500"} arrowSize={"small"}
                                          value={params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage24h ? params.row.coins_market_data.priceChangePercentage24h : 0}/>),
    valueGetter: (params) => params.row.coins_market_data && params.row.coins_market_data.priceChangePercentage24h ? params.row.coins_market_data.priceChangePercentage24h : 0
}, {
    field: 'marketCap',
    headerAlign: 'right',
    headerName: 'Market Cap',
    type: 'number',
    minWidth: 80,
    editable: false,
    renderCell: (params) => (<AnimatedNumberWrapper displayType={'text'}
                                                    value={getDollarNumber(params.row.coins_market_data && params.row.coins_market_data.marketCap ? params.row.coins_market_data.marketCap : 0)}
                                                    thousandSeparator={true}
                                                    decimalSeparator="."
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    prefix={"$"}
                                                    suffix={getDollarText(params.row.coins_market_data && params.row.coins_market_data.marketCap ? params.row.coins_market_data.marketCap : 0)}/>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.marketCap ? params.row.coins_market_data.marketCap : '0'}`
}, {
    field: 'volume',
    headerAlign: 'right',
    headerName: 'Volume',
    type: 'number',
    minWidth: 110,
    editable: false,
    renderCell: (params) => (<AnimatedNumberWrapper displayType={'text'}
                                                    value={getDollarNumber(params.row.coins_market_data && params.row.coins_market_data.totalVolume ? params.row.coins_market_data.totalVolume : 0)}
                                                    thousandSeparator={true}
                                                    decimalSeparator="."
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    prefix={"$"}
                                                    suffix={getDollarText(params.row.coins_market_data && params.row.coins_market_data.totalVolume ? params.row.coins_market_data.totalVolume : 0)}/>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.totalVolume ? params.row.coins_market_data.totalVolume : '0'}`
}, {
    field: 'high24',
    headerName: 'High (24H)',
    headerAlign: 'right',
    type: 'number',
    minWidth: 110,
    editable: false,
    renderCell: (params) => (<AnimatedNumberWrapper displayType={'text'}
                                                    value={params.row.coins_market_data && params.row.coins_market_data.high24 ? params.row.coins_market_data.high24 : 0}
                                                    thousandSeparator={true}
                                                    prefix="$"
                                                    decimalSeparator="."
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}/>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.high24 ? params.row.coins_market_data.high24 : '0'}`
}, {
    field: 'low24',
    headerName: 'Low (24H)',
    headerAlign: 'right',
    type: 'number',
    minWidth: 110,
    editable: false,
    renderCell: (params) => (<AnimatedNumberWrapper displayType={'text'}
                                                    value={params.row.coins_market_data && params.row.coins_market_data.low24 ? params.row.coins_market_data.low24 : 0}
                                                    thousandSeparator={true}
                                                    prefix="$"
                                                    decimalSeparator="."
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}/>),
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.low24 ? params.row.coins_market_data.low24 : '0'}`
}, {
    field: 'activeCoins',
    headerName: 'Circulating Supply',
    headerAlign: 'center',
    type: 'number',
    minWidth: 140,
    editable: false,
    filterable: false,
    sortable: false,
    renderCell: (params) => {
        if (!params.row.coins_market_data || !params.row.coins_market_data.totalCoins || !params.row.coins_market_data.totalActiveCoins)
            return <Box/>
        let val = 100;
        if (params.row.coins_market_data.totalCoins) {
            val = (params.row.coins_market_data.totalActiveCoins / params.row.coins_market_data.totalCoins) * 100
        }
        return <Stack direction={"column"} width={"100%"} spacing={1}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <AnimatedNumber
                    decimalScale={0}
                    suffix={"%"}
                    displayType={'text'}
                    value={val}>
                </AnimatedNumber>
                <HtmlTooltip
                    title={<React.Fragment>
                        <Typography variant={"subtitle2"} component={"p"} color="inherit"
                                    textAlign={"center"}>Circulating Supply</Typography>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography variant={"body2"} component={"p"} color="inherit"
                                        sx={{color: greyColor}}>Active Coins</Typography>
                            <Typography fontSize={"15px"}
                                        color="inherit">{params.row.coins_market_data.totalActiveCoins}</Typography>
                        </Stack>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography variant={"body2"} component={"p"} color="inherit"
                                        sx={{color: greyColor}}>Total Coins</Typography>
                            <Typography fontSize={"15px"}
                                        color="inherit">{params.row.coins_market_data.totalCoins}</Typography>
                        </Stack>
                    </React.Fragment>}
                >
                    <InfoOutlined sx={{color: greyColor, fontSize: "15px"}}/>
                </HtmlTooltip>
            </Stack>
            <Grid container>
                <Grid xs item>
                    <LinearProgress
                        value={val}
                        variant="determinate"/>
                </Grid>
            </Grid>
        </Stack>
    },
    valueGetter: (params) => `${params.row.coins_market_data && params.row.coins_market_data.totalActiveCoins ? params.row.coins_market_data.totalActiveCoins : '0'}`
}, {
    field: 'sparkline',
    headerAlign: 'center',
    headerName: '7 Day Trend',
    minWidth: 150,
    editable: false,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
        !params.row.coins_market_data || !params.row.coins_market_data.sparkline ?
            <Box/> :
            <Sparkline id={params.row.id} data={params.row.coins_market_data.sparkline} decreaseDetail={false}
                       height={"75px"}/>)
},]
const CoinGrid = ({coins}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    const [columns, setColumns] = useState([])
    let navigate = useNavigate();

    useEffect(() => {
        if (userDetails && userDetails.id) {
            setColumns([...defaultColumns, {
                field: 'notification',
                headerAlign: 'center',
                headerName: '',
                minWidth: 30,
                editable: false,
                filterable: false,
                sortable: false,
                renderCell: (params) => (<NotificationActions coinId={params.row.id}/>)
            }])
        } else {
            setColumns([...defaultColumns])
        }
    }, [userDetails])
    return (<Box style={{height: '475px'}}>
        <StyledDataGrid
            rows={coins}
            initialState={{
                sorting: {
                    sortModel: [{field: 'marketCap', sort: 'desc'}],
                },
            }}
            columns={columns}
            autoPageSize
            disableSelectionOnClick={true}
            rowHeight={75}
            pageSize={50}
            disableColumnMenu={true}
            disableColumnSorting={true}
            getRowClassName={() => 'transparentRow'}
            onRowClick={(params, event) => {
                navigate(`/coins/${params.row.id}`);
            }}
        />
    </Box>);
}

export default CoinGrid;
