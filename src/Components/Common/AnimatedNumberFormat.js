import NumberFormat from "react-number-format";
import React from "react";
import {CSSTransition} from "react-transition-group";
import animateClass from "./css/animated.module.css"

const AnimatedNumberFormat = (props) => {

    return <CSSTransition key={props.value} timeout={1000}>
        <NumberFormat key={props.value}
                      className={`${props.className} ${animateClass.animate}`}
                      displayType={'text'}
                      value={props.value}
                      thousandSeparator={props.thousandSeparator}
                      prefix={props.prefix}
                      suffix={props.suffix}
                      decimalSeparator={props.decimalSeparator}
                      style={props.style}
                      decimalScale={props.decimalScale}
                      fixedDecimalScale={props.fixedDecimalScale}/>
    </CSSTransition>
}

export default AnimatedNumberFormat