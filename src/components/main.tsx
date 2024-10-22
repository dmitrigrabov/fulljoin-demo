import { LineChart } from '@/components/line-chart'
import { useState } from 'react'
import { setWith } from 'lodash-es'
import { Grid, GridColumn } from '@/components/grid'
import { Selection } from '@/components/types'
import { HorizontalBarChart } from '@/components/horizontal-bar-chart'
import { SelectSegment } from '@/components/select-segment'

type MainProps = {
  data: Record<string, (string|number)[]>
}

export const Main = ({ data }: MainProps) => {
  const [selection, setSelection] = useState<Selection>()

  const months = Array.from(new Set(data.month)).sort() as string[]

  const totals = groupDataByColumn({
    data,
    bucketName: 'bucket',
    bucketValues: mrrLabels,
    selection
  })

  const gridColumns: GridColumn[] = [
    { name: 'bucket', title: 'Breakdown', type: 'text' },
    ...months.map(month => ({ name: month, title: month, type: 'text' as const }))
  ]

  const gridRows = mrrLabels.map(mrrLabel => {
    const row: Record<string, string> = { bucket: mrrLabel }

    months.forEach(month => {
      const value = totals[mrrLabel]?.[month]
      row[month] = String(
        value?.toLocaleString('en-US', {
          useGrouping: true
        }) ?? 0
      )
    })

    return row
  })

  console.log(selection)

  return (
    <div className="flex flex-col gap-4">
      <SelectSegment
        skipNames={['month', 'subscription_id', 'value', 'bucket']}
        bucketValues={Object.keys(data)}
        selection={selection}
        setSelection={setSelection}
        data={data}
      />
      <Charts selection={selection} totals={totals} xAxisData={months} months={months} data={data} />
      <div className="p-4">
        <Grid data={gridRows} gridColumns={gridColumns} />
      </div>
    </div>
  )
}



type GroupDataByColumnArgs = {
  data: Record<string, (string|number)[]>
  bucketName: string
  bucketValues: string[]
  selection: Selection | undefined
}

const groupDataByColumn = ({
  data,
  bucketName,
  bucketValues,
  selection
}: GroupDataByColumnArgs) => {
  const totals: Record<string, Record<string, number>> = {}

  data.month.forEach((month, index) => {
    bucketValues.forEach(bucketValue => {
      if (selection) {
        const itemInFilter = data[selection.bucketName as keyof typeof data][index]

        if (!(typeof itemInFilter === 'string' && selection.bucketValues.includes(itemInFilter))) {
          return
        }
      }

      if (data[bucketName][index] === bucketValue) {
        const currentValue = totals[bucketValue]?.[month]

        setWith(
          totals,
          [bucketValue, month],
          (currentValue ?? 0) + Number(data.value[index]),
          Object
        )
      }
    })
  })

  return totals
}

type GetLastMonthMrrSegmentsArgs = {
  months: string[]
  selection: Selection
  data: Record<string, (string|number)[]>
}

const getLastMonthMrrSegments = ({ months, selection, data }: GetLastMonthMrrSegmentsArgs) => {
  const { bucketName, bucketValues } = selection
  const lastMonth = months[months.length - 1]

  const totals: Record<string, number> = Object.fromEntries(
    bucketValues.map(bucketValue => [bucketValue, 0])
  )

  data.month.forEach((month, index) => {
    if (month !== lastMonth) return

    if (data.bucket[index] !== '6. Ending MRR') return

    const bucketValue = data[bucketName as keyof typeof data][index]

    if (!bucketValues.includes(bucketValue as string)) return

    totals[bucketValue] = (totals[bucketValue] ?? 0) + Number(data.value[index])
  })

  return {
    name: bucketName,
    data: Object.values(totals).map(value => Number(value.toFixed(2)))
  }
}

const mrrLabels = [
  '1. New MRR',
  '2. Expansion MRR',
  '3. Reactivation MRR',
  '4. Downgrade MRR',
  '5. Churn MRR',
  '6. Ending MRR'
]

type ChartsProps = {
  selection: Selection | undefined
  totals: Record<string, Record<string, number>>
  xAxisData: string[]
  months: string[]
  data: Record<string, (string|number)[]>
}

const Charts = ({ selection, totals, xAxisData, months, data }: ChartsProps) => {
  if (!selection?.bucketValues?.length) {
    return (
      <div className="p-4">
        <LineChart
          xAxisData={xAxisData}
          yAxisDataSeries={Object.entries(totals)
            .filter(([name]) => name === '6. Ending MRR')
            .map(([name, values]) => {
              return {
                name,
                data: Object.values(values).map(number => Number(number.toFixed(2)))
              }
            })}
        />
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col md:flex-row">
      <div className="flex-1">
        <LineChart
          xAxisData={xAxisData}
          yAxisDataSeries={Object.entries(totals)
            .filter(([name]) => name === '6. Ending MRR')
            .map(([name, values]) => {
              return {
                name,
                data: Object.values(values).map(number => Number(number.toFixed(2)))
              }
            })}
        />
      </div>

      <div className="flex-1">
        {selection?.bucketValues?.length ? (
          <HorizontalBarChart
            yAxisData={selection.bucketValues}
            xAxisDataSeries={getLastMonthMrrSegments({ months, selection, data })}
          />
        ) : null}
      </div>
    </div>
  )
}
