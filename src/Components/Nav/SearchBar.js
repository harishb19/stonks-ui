import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import {Box, Typography} from "@mui/material";
import {greyColor} from "../../Common/Colors";
import {useNavigate} from "react-router-dom";

const SearchBar = ({coins}) => {
    const navigate = useNavigate()

    return (<Stack spacing={2} sx={{width: 300}}>
        <Autocomplete
            
            freeSolo
            color={"secondary"}
            id="free-solo-2-demo"
            disableClearable
            options={coins}
            clearOnBlur={true}
            size="small"
            clearOnEscape={true}
            getOptionLabel={(option) => option.name}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.defaultMuiPrevented = true;
                }
            }}
            onChange={(event, newValue) => {
                navigate(`/coins/${newValue.id}`)
            }}
            renderInput={(params) => (<TextField
                {...params}
                color={"secondary"}
                label="Search Coins"
                variant={"outlined"}
                InputProps={{
                    ...params.InputProps,
                    type: 'search',
                }}
            />)}
            renderOption={(props, option) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                    <img
                        loading="lazy"
                        width="30"
                        src={option.image}
                        alt=""
                    />
                    <Stack direction={"column"}>
                        <Typography variant={"h6"} component={"p"} sx={{marginTop: "5px"}}>
                            {option.name}
                        </Typography>
                        <Typography variant={"body1"} component={"p"} color={greyColor} sx={{marginBottom: "5px"}}>
                            {option.symbol.toUpperCase()}
                        </Typography>

                    </Stack>
                </Box>)}
        />
    </Stack>);
}

export default SearchBar
