import NumberFormat from "react-number-format";
import React from "react";
import {CSSTransition} from "react-transition-group";
import animateClass from "./css/animated.module.css"

const AnimatedNumber = ({
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
    return <CSSTransition key={value} timeout={1000}>
        <NumberFormat key={value}
                      className={`${className} ${animateClass.animate}`}
                      displayType={'text'}
                      value={value}
                      thousandSeparator={thousandSeparator}
                      prefix={prefix}
                      suffix={suffix}
                      decimalSeparator={decimalSeparator}
                      style={style}
                      decimalScale={decimalScale}
                      fixedDecimalScale={fixedDecimalScale}/>
    </CSSTransition>
}

export default AnimatedNumber