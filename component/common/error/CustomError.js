import React from "react";
import {Button} from "@material-ui/core";

const Error = ({onClick, message}) => {
    return (
        <div>

            <div>
                <h4>Sorry something went wrong !</h4>
                <p>
                    {message}
                </p>
                <Button
                    type="button"
                    className="outline"
                    onClick={onClick}
                >
                    Refresh
                </Button>
            </div>
        </div>
    )
}

export default Error
