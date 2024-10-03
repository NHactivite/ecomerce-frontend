import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ArcElement,
  PointElement,
 LineElement,
 Filler
} from "chart.js";
import { Bar, Doughnut,Line,Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);
const months=["January", "February", "March", "April", "May", "June"];

interface barchartProps{
  horizontal?:boolean;
  data_1:number[];
  data_2:number[];
  title_1:string;
  title_2:string;
  bgColor_1:string;
  bgColor_2:string;
  labels?:string[]
}

const ChartComponent = ({horizontal=false,data_1=[],data_2=[],bgColor_1,bgColor_2,title_1,title_2,labels=months}:barchartProps) => {

const chartData:ChartData<"bar",number[],string> = {
    labels,
    datasets: [
      {
        label: title_1,
        data: data_1,
        backgroundColor:bgColor_1,
        barThickness:"flex",
        barPercentage:1,
        categoryPercentage:0.4,
      },
      {
        label: title_2,
        data: data_2,
        backgroundColor: bgColor_2,
        barThickness:"flex",
        barPercentage:1,
        categoryPercentage:0.4,
      },
    ]
  };

  const chartOptions:ChartOptions<"bar"> = {
    responsive: true,
    indexAxis:horizontal?"y":"x",
    plugins: {
      legend: {
        display:false,
        position:"bottom",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart"
      }
    },
    scales:{
       y:{
        beginAtZero:true,
        grid:{
          display:false,
        }
       },
       x:{
        grid:{
          display:false,
        }
       }
    }
  };

  return <Bar width={horizontal?"200%":""} data={chartData} options={chartOptions} />;
};
export default ChartComponent;



interface doughnutProps{
  data:number[];
  bgColor:string[];
  labels:string[];
  cutout?:number|string;
  legends?:boolean;
  offset?:number[]
}

export const DoughnutChart=({labels,data,bgColor,legends=true,cutout,offset}:doughnutProps)=>{
  const doughnutData:ChartData<"doughnut",number[],string>={
    labels,
    datasets:[{
      data,
      backgroundColor:bgColor,
      borderWidth:0,
      offset,
    }]
   };
  const doughnutOptions:ChartOptions<"doughnut">={
    responsive:true,
    plugins:{
      legend:{
        display:legends,
        position:"bottom",
        labels:{
          padding:40,
        }
      }
    },
    cutout
  }
  return <Doughnut data={doughnutData} options={doughnutOptions}/>;
}



interface PieProps{
  data:number[];
  bgColor:string[];
  labels:string[];
  offset?:number[]
}

export const PieChart=({labels,data,bgColor,offset}:PieProps)=>{
  const pieData:ChartData<"pie",number[],string>={
    labels,
    datasets:[{
      data,
      backgroundColor:bgColor,
      borderWidth:1,
      offset,
    }]
   };
  const pieOptions:ChartOptions<"pie">={
    responsive:true,
    plugins:{
      legend:{
        display:true,
      }
    }
  }
  return <Pie data={pieData} options={pieOptions}/>;
}




interface linechartProps{
  data:number[];
  bgColor:string;
  label:string;
  borderColor:string;
  labels:string[]
}

export const LineComponent= ({data=[],bgColor,label,borderColor,labels}:linechartProps) => {

const chartData:ChartData<"line",number[],string> = {
    labels,
    datasets: [
      { 
        fill:true,
        label,
        data,
        backgroundColor:bgColor,
        borderColor
      }
    ]
  };

  const chartOptions:ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display:false,
        position:"bottom",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart"
      }
    },
    scales:{
       y:{
        beginAtZero:true,
        grid:{
          display:false,
        }
       },
       x:{
        grid:{
          display:false,
        }
       }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};
