import SparkLineIndependent from "./SparklineIndependent";
import {useStoreState} from "easy-peasy";

const Sparkline = ({
                       id,
                       labels,
                       data,
                       decreaseDetail = false,
                       height = 100,
                       lineTension = 0.3,
                       fill = false,
                       neutralUpDown = 0 //0 - neutral , 1 - Up Color, 2 - Down Color
                   }) => {

    const sparklineSetting = useStoreState(state => state.settings.sparklineSetting)


    if (sparklineSetting === "1") {
        return <SparkLineIndependent key={0} id={id} data={data}
                                     decreaseDetail={true}
                                     height={height} lineTension={lineTension}
                                     neutralUpDown={neutralUpDown}
                                     fill={fill}/>
    }

    return <SparkLineIndependent key={1} id={id} data={data}
                                 decreaseDetail={false}
                                 height={height} lineTension={lineTension}
                                 neutralUpDown={neutralUpDown}
                                 fill={fill}/>
}

export default Sparkline


