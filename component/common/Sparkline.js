import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2'

const Sparkline = ({id, labels, data, decreaseDetail = false, height = 100}) => {
    if (!data || data.length <= 0) {
        return <p>Could not load sparkline</p>
    }
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
        Legend
    );

    const options = {
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
        }
    };

    return (<Line
        datasetIdKey='id'
        height={height}
        data={{
            labels: labels,
            datasets: [
                {
                    id: id,
                    fill: true,
                    lineTension: 0.3,
                    borderWidth: 2,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    data: data,
                }
            ],
        }}
        options={options}
    />);
}

export default Sparkline;