import {DataGrid, gridClasses} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import Sparkline from "./sparkline";
import PriceUpDown from "./priceUpDown";
import NumberFormat from "react-number-format";
import React, {memo} from "react";

const CoinGrid = ({coins}) => {

    const StripedDataGrid = styled(DataGrid)(({theme}) => ({
        border: 'none', boxShadow: 0, '.MuiDataGrid-cell': {
            border: 'none',
        }, '& .MuiDataGrid-columnSeparator': {
            visibility: 'hidden',
        },
        "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
            outline: "none"
        },
        '& .MuiDataGrid-columnHeaders': {backgroundColor: "#252731", borderRadius: '15px', border: "none"},
        [`& .${gridClasses.row}.odd`]: {
            borderRadius: '15px',
            border: '2px solid rgba(0, 0, 0, 0)',
            transition: 'all 200ms ease-out',
            backgroundColor: "#27292E",
            '&:hover, &.Mui-hovered': {
                transition: 'all 200ms ease-im',
                border: "2px solid #345DFF",
            },
        },
        [`& .${gridClasses.row}.even`]: {
            borderRadius: '15px',
            border: '2px solid rgba(0, 0, 0, 0)',
            transition: 'all 200ms ease-out',
            backgroundColor: "#1F2128",
            '&:hover, &.Mui-hovered': {
                transition: 'all 200ms ease-im',
                border: "2px solid #345DFF",
            },
        },
        '& .MuiPaginationItem-root': {
            border: 0,
        },
    }));

    const columns = [
        {
            field: 'image',
            headerName: '',
            editable: false,
            width: 30,
            headerAlign: 'left',
            filterable: false,
            sortable: false,
            renderCell: (params) => (
                <img src={params.row.image || ''} alt={params.row.name || 'coin'} width={"30px"} height={"30px"}/>
            ),
        },
        {
            field: 'name',
            headerName: 'Coin',
            editable: false,
            minWidth: 150,
            headerAlign: 'left',
            valueGetter: (params) => `${params.row.name || ''}`
        }, {
            field: 'symbol',
            headerName: 'Symbol',
            headerAlign: 'left',
            editable: false,
            valueGetter: (params) => `${params.row.symbol.toUpperCase() || ''}`
        }, {
            field: 'currentPrice',
            headerName: 'Price',
            headerAlign: 'right',
            type: 'number',
            minWidth: 110,
            editable: false,
            renderCell: (params) => (<NumberFormat displayType={'text'}
                                                   value={params.row.coins_market_data.currentPrice || 0}
                                                   thousandSeparator={true}
                                                   suffix=" USD"
                                                   decimalSeparator="."
                                                   decimalScale={2}
                                                   fixedDecimalScale={true}/>),
            valueGetter: (params) => `${params.row.coins_market_data.currentPrice || '0'}`
        }, {
            field: 'percent',
            headerAlign: 'left',
            headerName: '% Change',
            description: 'This column has a value getter and is not sortable.',
            editable: false,
            minWidth: 100,
            renderCell: (params) => (<PriceUpDown value={params.row.coins_market_data.priceChangePercentage24h}/>),
            valueGetter: (params) => params.row.coins_market_data.priceChangePercentage24h
        }, {
            field: 'marketCap',
            headerAlign: 'right',
            headerName: 'Market Cap',
            type: 'number',
            minWidth: 150,
            editable: false,
            valueGetter: (params) => `${params.row.coins_market_data.marketCap || '0'}`
        }, {
            field: 'volume',
            headerAlign: 'right',
            headerName: 'Volume',
            type: 'number',
            minWidth: 110,
            editable: false,
            valueGetter: (params) => `${params.row.coins_market_data.totalVolume || '0'}`
        }, {
            field: 'sparkline',
            headerAlign: 'center',
            headerName: '7 Day Trend',
            minWidth: 110,
            editable: false,
            filterable: false,
            sortable: false,
            renderCell: (params) => (
                <Sparkline id={params.row.id} data={params.row.coins_market_data.sparkline} decreaseDetail={true}
                           height={100}/>)
        },];


    return (<div style={{display: 'flex', height: '500px'}}>
        <div style={{flexGrow: 1}}>
            <StripedDataGrid
                rows={coins}
                columns={columns}
                autoPageSize
                disableSelectionOnClick={true}
                rowHeight={75}
                pageSize={50}
                disableColumnMenu={true}
                disableColumnSorting={true}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
            />
        </div>
    </div>);
}

export default memo(CoinGrid);