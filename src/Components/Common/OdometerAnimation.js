import Odometer from 'react-odometerjs';
import "odometer/themes/odometer-theme-default.css";
import {useEffect, useState} from "react";
import './css/odometer.css'

const OdometerAnimation = ({value, className, decimalScale = 2, prefix = '', suffix = '', style, animate = true}) => {
    const [val, setVal] = useState(value)
    useEffect(() => {
        setVal(value)
    }, [value])
    const format = (value) => {
        return value.toFixed(decimalScale);
    }
    const formatString = () => {
        return "(,ddd)." + "d".repeat(decimalScale)
    }
    // console.log(animate)
    return <div className={className} style={style}>
        <span>{prefix}</span>
        <Odometer key={value} value={val} format={formatString()} duration={1000} animation={animate ? "count" : null}/>
        <span>{suffix}</span>
    </div>
}


export default OdometerAnimation