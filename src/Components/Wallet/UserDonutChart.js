import React, {useEffect, useState} from 'react';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const UserDonutChart = ({userCoins}) => {

    const [labels, setLabels] = useState([])
    const [value, setValue] = useState([])

    const getCoinNames = (userCoins) => {
        if (!userCoins || userCoins.length === 0)
            return [];
        const sortedCoins = [...userCoins].sort(function (a, b) {
            return ((a.quantity * a.totalPrice) - (b.quantity * b.totalPrice))
        });
        const newLabels = sortedCoins.slice(0, 5).map(x => x.coins_static.name)
        const newValues = sortedCoins.slice(0, 5).map(x => x.quantity * x.totalPrice)
        if (sortedCoins.length > 5) {
            newLabels.push("Other")
            newValues.push(sortedCoins.slice(5).reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.totalPrice),
                0))
        }
        const totalValue = newValues.reduce((prev, current) => prev + current, 0)
        const newPercent = newValues.map(x => (x / totalValue * 100).toFixed(2))
        return {labels: newLabels, data: newPercent}
    }

    useEffect(() => {
        const coinData = getCoinNames(userCoins)
        setLabels(coinData.labels)
        setValue(coinData.data)
    }, [userCoins])

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Portfolio distribution',
                data: value,
                backgroundColor: [
                    'rgba(255, 0, 142, 1)',
                    'rgba(210, 39, 121, 1)',
                    'rgba(97, 40, 151, 1)',
                    'rgba(12, 30, 127, 1)',
                    'rgba(153, 0, 240, 1)',
                    'rgba(249, 0, 191, 1)',
                ],
                borderColor: [
                    'rgba(255, 0, 142, 1)',
                    'rgba(210, 39, 121, 1)',
                    'rgba(97, 40, 151, 1)',
                    'rgba(12, 30, 127, 1)',
                    'rgba(153, 0, 240, 1)',
                    'rgba(249, 0, 191, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Doughnut data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + "%";
                        }
                        return label;
                    }
                }
            }
        },
    }}/>;
}

export default UserDonutChart