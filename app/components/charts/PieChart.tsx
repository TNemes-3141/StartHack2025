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

  }

  return <div>
    <ReactApexChart options={options} series={series} type="line" height={250} />
  </div>
}

export default PieChart;