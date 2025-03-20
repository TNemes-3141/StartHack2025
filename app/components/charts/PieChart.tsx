import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic";
import { apexNonAxisSeriesConverter, NonAxisChartDataList } from "./ApexSeriesConverter";
import { pie_data_list } from "./PlaceholderData";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChart = ({
  dataList,
  id
} : {
  dataList?: NonAxisChartDataList,
  id: string
}) => {
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

  return <div>
    <ReactApexChart options={options} series={dataList ? apexNonAxisSeriesConverter(dataList) : apexNonAxisSeriesConverter(pie_data_list)} type="donut" height={250} />
  </div>
}

export default PieChart;