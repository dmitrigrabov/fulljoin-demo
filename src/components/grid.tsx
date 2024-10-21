import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

export type GridColumn = {
  name: string
  type: 'text'
  title: string
}

type GridProps = {
  data: Record<string, string>[]
  gridColumns: GridColumn[]
}

export const Grid = ({ data, gridColumns }: GridProps) => {
  const columns = gridColumns.map(({ name, title }) => {
    return {
      ...keyColumn(name, textColumn),
      title,
      disabled: true,
      headerClassName: 'whitespace-nowrap min-w-[100px]'
    }
  })

  return <DataSheetGrid value={data} columns={columns} lockRows={true} />
}
