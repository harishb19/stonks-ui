import {DataGrid, gridClasses} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import Sparkline from "./Sparkline";
import PriceUpDown from "./PriceUpDown";
import {Box, Grid, LinearProgress, Stack, Tooltip, tooltipClasses, Typography} from "@mui/material";
import {greyColor} from "../../Common/Colors";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import {InfoOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import AnimatedNumberFormat from "./AnimatedNumberFormat";
import NotificationActions from "../Notification/NotificationActions";
import {useStoreState} from "easy-peasy";
import React from "react"

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 'none', boxShadow: 0, '.MuiDataGrid-cell': {
        border: 'none',
    }, '& .MuiDataGrid-columnSeparator': {
        visibility: 'hidden',
    },
    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
        outline: "none"
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'rgba(50, 50, 50, 0.5)',
        borderBottom: '1px solid rgba(53, 53, 53)',
    },
    [`& .${gridClasses.row}.transparentRow`]: {
        borderBottom: '1px solid rgba(53, 53, 53)',
        transition: 'all 200ms ease-out',
        backgroundColor: 'rgba(50, 50, 50, 0.35)', cursor: "pointer",
        '&:hover, &.Mui-hovered': {
            transition: 'all 200ms ease-im',
            backgroundColor: 'rgba(50, 50, 50, 0.55)',
        },
    },
    '& .MuiPaginationItem-root': {
        border: 0,
    },
}));

const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#18191A",
        minWidth: '300px',
        padding: "20px"
    },
}));

let columns = [
    {
        field: 'rank',
        headerName: 'Rank',
        editable: false,
        width: 55,
        headerAlign: 'center',
        type: 'number',
        align: 'center',
        valueGetter: (params) => `${params.row.coins_market_data.rank || ''}`
    },
    {
        field: 'name',
        headerName: 'Name',
        editable: false,
        minWidth: 250,
        headerAlign: 'left',
        renderCell: (params) => (
            <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                <img src={params.row.image || ''} alt={params.row.name || 'coin'} width={"30px"} height={"30px"}/>
                <Typography variant={"h6"} component={"p"}>
                    {params.row.name}
                </Typography>
                <Typography variant={"subtitle2"} component={"p"} sx={{color: greyColor}}>
                    {params.row.symbol.toUpperCase()}
                </Typography>
            </Stack>
        ),
        valueGetter: (params) => `${params.row.name || ''}`
    }, {
        field: 'currentPrice',
        headerName: 'Price',
        headerAlign: 'right',
        type: 'number',
        minWidth: 110,
        editable: false,
        renderCell: (params) => (<Stack direction={"row"} spacing={1} alignItems={"center"}>
            <AnimatedNumberFormat displayType={'text'}
                                  value={params.row.coins_market_data.currentPrice || 0}
                                  thousandSeparator={true}
                                  prefix="$"
                                  decimalSeparator="."
                                  decimalScale={2}
                                  fixedDecimalScale={true}/>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        <Typography color="inherit" textAlign={"center"} component={"p"}
                                    variant={"subtitle2"}>{params.row.name} Price
                            Change</Typography>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                                1 Hour</Typography>
                            <PriceUpDown fontSize={'15px'}
                                         fontWeight={'500'}
                                         value={params.row.coins_market_data.priceChangePercentage1h}
                                         arrow={false}/>
                        </Stack>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                                24 Hours</Typography>
                            <PriceUpDown fontSize={'15px'}
                                         fontWeight={'500'}
                                         value={params.row.coins_market_data.priceChangePercentage24h}
                                         arrow={false}/>
                        </Stack>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                                7 Days</Typography>
                            <PriceUpDown fontSize={'15px'}
                                         fontWeight={'500'}
                                         value={params.row.coins_market_data.priceChangePercentage7d}
                                         arrow={false}/>
                        </Stack>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                                30 Days</Typography>
                            <PriceUpDown fontSize={'15px'}
                                         fontWeight={'500'}
                                         value={params.row.coins_market_data.priceChangePercentage30d}
                                         arrow={false}/>
                        </Stack>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{marginTop: "10px"}}>
                            <Typography color="inherit" variant={'body2'} component={'p'} sx={{color: greyColor}}>Past
                                1 Year</Typography>
                            <PriceUpDown fontSize={'15px'}
                                         fontWeight={'500'}
                                         value={params.row.coins_market_data.priceChangePercentage1y}
                                         arrow={false}/>
                        </Stack>
                    </React.Fragment>
                }
            >
                <InfoOutlined sx={{color: greyColor, fontSize: "15px"}}/>
            </HtmlTooltip>
        </Stack>),
        valueGetter: (params) => `${params.row.coins_market_data.currentPrice || '0'}`
    }, {
        field: 'percent',
        headerAlign: 'center',
        headerName: '% Change',
        description: 'This column has a value getter and is not sortable.',
        editable: false,
        type: 'number',
        minWidth: 70,
        align: "center",
        renderCell: (params) => (
            <PriceUpDown fontSize={"1em"} fontWeight={"500"} arrowSize={"small"}
                         value={params.row.coins_market_data.priceChangePercentage24h}/>),
        valueGetter: (params) => params.row.coins_market_data.priceChangePercentage24h
    }, {
        field: 'marketCap',
        headerAlign: 'right',
        headerName: 'Market Cap',
        type: 'number',
        minWidth: 80,
        editable: false,
        renderCell: (params) => (<AnimatedNumberFormat displayType={'text'}
                                                       value={getDollarNumber(params.row.coins_market_data.marketCap)}
                                                       thousandSeparator={true}
                                                       decimalSeparator="."
                                                       decimalScale={2}
                                                       fixedDecimalScale={true}
                                                       prefix={"$"}
                                                       suffix={getDollarText(params.row.coins_market_data.marketCap)}/>),
        valueGetter: (params) => `${params.row.coins_market_data.marketCap || '0'}`
    }, {
        field: 'volume',
        headerAlign: 'right',
        headerName: 'Volume',
        type: 'number',
        minWidth: 110,
        editable: false,
        renderCell: (params) => (<AnimatedNumberFormat displayType={'text'}
                                                       value={getDollarNumber(params.row.coins_market_data.totalVolume)}
                                                       thousandSeparator={true}
                                                       decimalSeparator="."
                                                       decimalScale={2}
                                                       fixedDecimalScale={true}
                                                       prefix={"$"}
                                                       suffix={getDollarText(params.row.coins_market_data.totalVolume)}/>),
        valueGetter: (params) => `${params.row.coins_market_data.totalVolume || '0'}`
    }, {
        field: 'high24',
        headerName: 'High (24H)',
        headerAlign: 'right',
        type: 'number',
        minWidth: 110,
        editable: false,
        renderCell: (params) => (<AnimatedNumberFormat displayType={'text'}
                                                       value={params.row.coins_market_data.high24 || 0}
                                                       thousandSeparator={true}
                                                       prefix="$"
                                                       decimalSeparator="."
                                                       decimalScale={2}
                                                       fixedDecimalScale={true}/>),
        valueGetter: (params) => `${params.row.coins_market_data.high24 || '0'}`
    }, {
        field: 'low24',
        headerName: 'Low (24H)',
        headerAlign: 'right',
        type: 'number',
        minWidth: 110,
        editable: false,
        renderCell: (params) => (<AnimatedNumberFormat displayType={'text'}
                                                       value={params.row.coins_market_data.low24 || 0}
                                                       thousandSeparator={true}
                                                       prefix="$"
                                                       decimalSeparator="."
                                                       decimalScale={2}
                                                       fixedDecimalScale={true}/>),
        valueGetter: (params) => `${params.row.coins_market_data.low24 || '0'}`
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
            let val = 100;
            if (params.row.coins_market_data.totalCoins) {
                val = (params.row.coins_market_data.totalActiveCoins / params.row.coins_market_data.totalCoins) * 100
            }
            return <Stack direction={"column"} width={"100%"} spacing={1}>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <AnimatedNumberFormat
                        decimalScale={0}
                        suffix={"%"}
                        displayType={'text'}
                        value={val}>
                    </AnimatedNumberFormat>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
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
                            </React.Fragment>
                        }
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
        valueGetter: (params) => `${params.row.coins_market_data.totalActiveCoins || '0'}`
    },
    {
        field: 'sparkline',
        headerAlign: 'center',
        headerName: '7 Day Trend',
        minWidth: 150,
        editable: false,
        filterable: false,
        sortable: false,
        renderCell: (params) => (
            <Sparkline id={params.row.id} data={params.row.coins_market_data.sparkline} decreaseDetail={false}
                       height={"75px"}/>)
    },];

const CoinGrid = ({coins}) => {
    const userDetails = useStoreState(state => state.user.userDetails)
    let navigate = useNavigate();
    if (userDetails && userDetails.id) {
        columns.push({
            field: 'notification',
            headerAlign: 'center',
            headerName: 'Notification',
            minWidth: 30,
            editable: false,
            filterable: false,
            sortable: false,
            renderCell: (params) => (
                <NotificationActions/>)
        })
        console.log(columns)
    }
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
            getRowClassName={() =>
                'transparentRow'
            }
            onRowClick={(params, event) => {
                navigate(`/coins/${params.row.id}`);
            }}
        />
    </Box>);
}

export default CoinGrid;