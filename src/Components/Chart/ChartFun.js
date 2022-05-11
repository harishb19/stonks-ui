import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {fitWidth} from "react-stockcharts/lib/helper";
import {discontinuousTimeScaleProvider} from "react-stockcharts/lib/scale";
import {last} from "react-stockcharts/lib/utils";
import {Chart, ChartCanvas, ZoomButtons} from "react-stockcharts";
import {XAxis, YAxis} from "react-stockcharts/lib/axes";
import {downColor, greyColor, neutralColor, upColor} from "../../Common/Colors";
import {
    CrossHairCursor,
    CurrentCoordinate,
    EdgeIndicator,
    MouseCoordinateX,
    MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import {format} from "d3-format";
import {AreaSeries, BarSeries, CandlestickSeries} from "react-stockcharts/lib/series";
import {curveBasis} from "d3-shape";
import {OHLCTooltip} from "react-stockcharts/lib/tooltip";
import {timeFormat} from "d3-time-format";


let CandleStickChartWithDarkTheme = (props) => {
    const [suffix, setSuffix] = useState(0)

    const node = useRef()

    const {type, data: calculatedData, width, ratio, chartType = 0} = props;
    const {mouseMoveEvent, panEvent, zoomEvent, zoomAnchor} = props;

    const height = 650
    const margin = {left: 70, right: 70, top: 20, bottom: 30};

    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid ? {innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2, tickStrokeWidth: 0.5} : {};
    const xGrid = showGrid ? {innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2, tickStrokeWidth: 0.5} : {};

    const xScaleProvider = discontinuousTimeScaleProvider
        .inputDateAccessor(d => d.date);
    const {
        data, xScale, xAccessor, displayXAccessor,
    } = xScaleProvider(calculatedData);


    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    const resetYDomain = () => {
        node.current.resetYDomain();
    }

    const handleReset = () => {
        setSuffix((prev) => prev + 1)
    }

    useEffect(() => {
        setSuffix(1)
    }, [])
    return (<ChartCanvas ref={node}
                         mouseMoveEvent={mouseMoveEvent}
                         panEvent={panEvent}
                         zoomEvent={zoomEvent}
                         zoomAnchor={zoomAnchor}
                         height={height}
                         width={width}
                         ratio={ratio}
                         margin={margin}
                         type={type}
                         seriesName={`MSFT_${suffix}`}
                         data={data}
                         xScale={xScale}
                         xAccessor={xAccessor}
                         displayXAccessor={displayXAccessor}
                         xExtents={xExtents}
                         clamp={"both"}
    >
        <Chart id={1} height={475}
               yExtents={[d => [d.high, d.low]]}
               padding={{top: 10, bottom: 0}}

        >
            <YAxis axisAt="right" orient="right" ticks={5} {...yGrid} inverted={true}
                   tickStroke="#FFFFFF" stroke={greyColor} zoomEnabled={zoomEvent}/>
            <XAxis axisAt="bottom" orient="bottom"
                   {...xGrid}
                   tickStroke="#FFFFFF"
                   stroke={greyColor} zoomEnabled={zoomEvent}/>
            <MouseCoordinateY
                at="right"
                orient="right"
                displayFormat={format(".2f")}/>
            {
                chartType === 0 ? <CandlestickSeries
                        stroke={d => d.close > d.open ? upColor : downColor}
                        wickStroke={d => d.close > d.open ? upColor : downColor}
                        fill={d => d.close > d.open ? upColor : downColor} opacity={1}/> :
                    <AreaSeries yAccessor={d => d.price} stroke={neutralColor} interpolation={curveBasis}/>
            }
            <CurrentCoordinate yAccessor={d => d.price} fill="white"/>

            <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                           yAccessor={d => d.close}
                           opacity={0.5}
                           fill={d => d.close > d.open ? upColor : downColor}/>

            <OHLCTooltip origin={[-40, -10]} labelFill={"white"}
                         textFill={neutralColor}/>
            <ZoomButtons
                onReset={handleReset}
            />
        </Chart>
        <Chart id={2}
               yExtents={d => d.volume}
               height={100} origin={(w, h) => [0, h - 225]}
        >
            <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}
                   tickStroke="#FFFFFF" stroke={greyColor} zoomEnabled={zoomEvent}/>
            <BarSeries
                yAccessor={d => d.volume}
                stroke={false}
                fill={d => d.close > d.open ? upColor : downColor} opacity={0.7}/>
            <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={timeFormat("%B %d, %Y %I:%M %p")}/>
            <MouseCoordinateY
                at="left"
                orient="left"
                displayFormat={format(".4s")}/>
        </Chart>
        <CrossHairCursor stroke="#FFFFFF"/>
    </ChartCanvas>);
}
CandleStickChartWithDarkTheme.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
    type: "svg",
};
CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
