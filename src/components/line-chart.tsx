import { DataSeries } from '@/components/types'
import ReactECharts, { EChartsOption } from 'echarts-for-react'

type LineChartProps = {
  xAxisData: string[]
  yAxisDataSeries: DataSeries[]
}

export const LineChart = ({ xAxisData, yAxisDataSeries }: LineChartProps) => {
  const options: EChartsOption = {
    grid: { top: 8, right: 8, bottom: 24, left: 70 },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      axisLine: {
        onZero: false
      },
      startValue: Math.min(...yAxisDataSeries.flatMap(({ data }) => data)) * 0.99,
      axisLabel: {
        formatter: (value: number) => {
          return value.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            notation: 'compact',
            compactDisplay: 'short'
          })
        }
      }
    },
    series: yAxisDataSeries.map(({ name, data }) => ({
      id: name,
      label: name,
      name,
      data,
      type: 'line',
      smooth: true
    })),
    tooltip: {
      trigger: 'axis'
    }
  }

  return <ReactECharts option={options} notMerge={true} />
}
