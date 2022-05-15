import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import OdometerAnimation from "./OdometerAnimation";
import {useStoreState} from "easy-peasy";

const AnimatedNumberWrapper = ({
                                   value,
                                   className,
                                   thousandSeparator,
                                   prefix,
                                   suffix,
                                   decimalSeparator,
                                   style,
                                   decimalScale,
                                   fixedDecimalScale
                               }) => {

    const numberSetting = useStoreState(state => state.settings.numberSetting)

    return (numberSetting === "0" ? <AnimatedNumber key={value}
                                                    className={className}
                                                    displayType={'text'}
                                                    value={value}
                                                    thousandSeparator={thousandSeparator}
                                                    prefix={prefix}
                                                    suffix={suffix}
                                                    decimalSeparator={decimalSeparator}
                                                    style={style}
                                                    decimalScale={2}
                                                    fixedDecimalScale={fixedDecimalScale}/> : <OdometerAnimation
        className={className}
        displayType={'text'}
        value={value}
        prefix={prefix}
        suffix={suffix}
        style={style}
        decimalScale={2}
        animate={numberSetting === "2"}/>)

}

export default AnimatedNumberWrapper