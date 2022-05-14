import Odometer from 'react-odometerjs';
import "odometer/themes/odometer-theme-default.css";
import {useEffect, useState} from "react";
import './css/odometer.css'

const OdometerAnimation = ({value, className, decimalScale, prefix = '', suffix = '', style, animate = true}) => {
    const [val, setVal] = useState(value)
    useEffect(() => {
        setVal(value)
    }, [value])
    const format = (value) => {
        return value.toFixed(decimalScale).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    const formatString = "(,ddd)." + "d".repeat(decimalScale)
    return <div className={className} style={style}>
        <span>{prefix}</span>
        {
            animate ? <Odometer key={value} value={val} formatFunction={format} duration={1000}
                                animation={"count"}/> :
                <Odometer key={value} value={val} format={formatString} duration={1000}/>
        }
        <span>{suffix}</span>
    </div>
}
//format={formatString}

export default OdometerAnimation