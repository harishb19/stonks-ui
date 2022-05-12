import React from "react";
import {Button} from "@mui/material";

const Error = ({onClick, message}) => {
    return (<div>

        <div>
            <h4>Sorry something went wrong !</h4>
            <p>
                {message}
            </p>
            <Button
                type="button"
                className="outline"
                onClick={onClick ? onClick : () => {
                    window.location.reload()
                }}
            >
                Refresh
            </Button>
        </div>
    </div>)
}

export default Error
