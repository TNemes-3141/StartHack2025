import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const series = [44, 55, 41, 17, 15]


const PieChart = () => {
  const options: ApexOptions = {
    chart: {
      height: 250,
      type: "donut",
      background: 'transparent',
      toolbar: { show: false }
    },
    colors: ["#FF2715", "#E52313", "#DA2112", "#CA1F11", "#B51C0F", "#A81A0E"],
    stroke: {
      show: false, // Enables outline
      width: 3, // Thickness of the outline
      colors: ["#ffffff"] // Outline color (can be an array for different slices)
    },
  }

  return <div className="w-full h-full">
    <ReactApexChart options={options} series={series} type="donut" height={250} />
  </div>
}

export default PieChart;