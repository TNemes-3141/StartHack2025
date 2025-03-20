
export type AxisChartData = {
  x: Date | string,
  y: number | number[],
}

export type AxisChartDataList = AxisChartData[];


export type NonAxisChartDataList = number[];


export const apexAxisSeriesConverter = (dataList: AxisChartDataList) => {  
  return ([{data: dataList}] as ApexAxisChartSeries)
}


export const apexNonAxisSeriesConverter = (dataList: NonAxisChartDataList) => {
  return (dataList as ApexNonAxisChartSeries)
}