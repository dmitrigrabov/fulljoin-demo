import ReactECharts, { EChartsOption } from 'echarts-for-react'

type HorizontalBarChartProps = {
  yAxisData: string[]
  xAxisDataSeries: { name: string; data: number[] }
}

export const HorizontalBarChart = ({ yAxisData, xAxisDataSeries }: HorizontalBarChartProps) => {
  const options: EChartsOption = {
    grid: { top: 8, right: 8, bottom: 24, left: 70 },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: yAxisData
    },
    series: [
      {
        id: xAxisDataSeries.name,
        label: xAxisDataSeries.name,
        name: xAxisDataSeries.name,
        data: xAxisDataSeries.data,
        type: 'bar'
      }
    ]
  }

  return <ReactECharts option={options} notMerge={true} />
}
