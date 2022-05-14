import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import OdometerAnimation from "./OdometerAnimation";

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

    const type = 1
    return (type === 0 ? <AnimatedNumber key={value}
                                         className={className}
                                         displayType={'text'}
                                         value={value}
                                         thousandSeparator={thousandSeparator}
                                         prefix={prefix}
                                         suffix={suffix}
                                         decimalSeparator={decimalSeparator}
                                         style={style}
                                         decimalScale={decimalScale}
                                         fixedDecimalScale={fixedDecimalScale}/> :
        <OdometerAnimation
            className={className}
            displayType={'text'}
            value={value}
            thousandSeparator={thousandSeparator}
            prefix={prefix}
            suffix={suffix}
            decimalSeparator={decimalSeparator}
            style={style}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            animate={type === 2}/>)

}

export default AnimatedNumberWrapper