import * as React from 'react';
import {useState} from 'react';
import {styled} from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {greyColor, pinkColor} from "../../Common/Colors";
import {Box, Divider} from "@mui/material";
import coinStyle from "../Coins/css/coin.module.css"

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: "5px",
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        "&.Mui-selected, &.Mui-selected:hover": {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: pinkColor,
            color: "white !important",
            fontWeight: "bold",
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
            color: greyColor
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
            color: greyColor
        },
    },
}));

export default function ChartSelector({durationChange, chartTypeChange}) {
    const [duration, setDuration] = useState('month');
    const [chartType, setChartType] = useState(0)

    const getChartDuration = (value) => {
        switch (value) {
            case 'd':
                return {days: "1", duration: 'minutely'}
            case 'd7':
                return {days: "7", duration: 'hourly'}
            case 'month':
                return {days: "30", duration: 'daily'}
            case 'm2':
                return {days: "60", duration: 'daily'}
            case 'm3':
                return {days: "90", duration: 'daily'}
            case 'm6':
                return {days: "180", duration: 'daily'}
            case 'y1':
                return {days: "365", duration: 'daily'}
            default:
                return {days: "30", duration: "hourly"}
        }
    }


    const handleDuration = (event, newDuration) => {
        if (newDuration !== null) {
            setDuration(newDuration);
            if (durationChange) {
                const {days, duration} = getChartDuration(newDuration)
                durationChange(days, duration)
            }
        }
    };

    const handleType = (event, newType) => {
        if (newType !== null) {
            setChartType(newType);
            if (chartTypeChange) {
                chartTypeChange(newType)
            }
        }
    };

    return (
        <div>
            <Box
                className={coinStyle.frostedDivNoPad}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={duration}
                    exclusive
                    onChange={handleDuration}
                    aria-label="chart date"
                >
                    <ToggleButton value="d" aria-label="1 day">
                        1D
                    </ToggleButton>
                    <ToggleButton value="d7" aria-label="7 days">
                        7D
                    </ToggleButton>
                    <ToggleButton value="month" aria-label="1 month">
                        1M
                    </ToggleButton>
                    <ToggleButton value="m2" aria-label="2 months">
                        2M
                    </ToggleButton>
                    <ToggleButton value="m3" aria-label="3 months">
                        3M
                    </ToggleButton>
                    <ToggleButton value="m6" aria-label="6 months">
                        6M
                    </ToggleButton>
                    <ToggleButton value="y1" aria-label="1 year">
                        1Y
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{mx: 0.5, my: 1}}/>
                <StyledToggleButtonGroup
                    size="small"
                    value={chartType}
                    exclusive
                    onChange={handleType}
                    aria-label="chart date"
                >
                    <ToggleButton value={0} aria-label="Candlestick">
                        Candle
                    </ToggleButton>
                    <ToggleButton value={1} aria-label="Area">
                        Area
                    </ToggleButton>
                </StyledToggleButtonGroup>

            </Box>
        </div>
    );
}
