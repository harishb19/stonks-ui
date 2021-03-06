import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    registerables as registerablesJS,
    Title,
    Tooltip
} from 'chart.js';
import React, {useEffect, useRef, useState} from 'react';
import {Chart} from 'react-chartjs-2'
import {downColor, neutralColor, pinkColor, upColor} from "../../Common/Colors";

ChartJS.register(...registerablesJS);

ChartJS.register(
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
);
const SparkLineIndependent = ({
                                  id,
                                  labels,
                                  data,
                                  decreaseDetail = false,
                                  height = 100,
                                  lineTension = 0.3,
                                  fill = false,
                                  neutralUpDown = 0 //0 - neutral , 1 - Up Color, 2 - Down Color
                              }) => {

    const finalColor = neutralUpDown === 1 ? upColor : neutralUpDown === 2 ? downColor : pinkColor;
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        datasets: [],
    });
    if (decreaseDetail) {
        const newData = [];
        let avg = 0;
        for (let i = 0; i < data.length; i++) {
            if (i !== 0 && i % 24 === 0) {
                newData.push(avg)
                avg = 0;
            }
            avg += data[i];
        }
        if (avg !== 0)
            newData.push(avg)
        data = newData;
    }
    if (!labels || labels.length <= 0) {
        labels = Array.from({length: data.length}, (v, k) => k + 1)
    }
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
    );
    const options = {
        animation: {
            duration: 0
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false
            }, tooltips: {
                enabled: false
            },
        },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            xAxis: {
                display: false,
            },
            yAxis: {
                display: false,
            }
        },

    };

// eslint-disable-next-line react-hooks/exhaustive-deps
    function createGradient(ctx, area) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        if (neutralUpDown === 1) {
            gradient.addColorStop(1, upColor);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
        } else if (neutralUpDown === 2) {
            gradient.addColorStop(1, downColor);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
        } else {
            gradient.addColorStop(1, neutralColor);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
        }
        return gradient;
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
    const chartJSData = {
        labels: labels,
        datasets: [
            {
                id: id,
                fill: fill,
                lineTension: lineTension,
                borderWidth: 2,
                borderColor: finalColor,
                borderCapStyle: 'butt',
                data: data,
                pointHitRadius: 0,
            }
        ],
    }
    // eslint-disable-next-line
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) {
            return;
        }
        const chartData = {
            ...chartJSData,
            datasets: chartJSData.datasets.map(dataset => ({
                ...dataset,
                backgroundColor: fill ? createGradient(chart.ctx, chart.chartArea) : finalColor,
            })),
        };
        setChartData(chartData);
        // eslint-disable-next-line
    }, []);


    if (!data || data.length <= 0) {
        return <p>Could not load sparkline</p>
    }
    return (
        <Chart ref={chartRef} type='line' data={chartData} options={options} datasetIdKey='id'
               height={height} style={{padding: '10px'}}
        />
    );
}

export default SparkLineIndependent;
