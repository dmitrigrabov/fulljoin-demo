import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Dispatch, SetStateAction } from 'react'
import { Selection } from './types'
import data from '@/data.json'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { MultiSelect } from '@/components/multi-select'

type SelectSegmentProps = {
  bucketValues: string[]
  skipNames?: string[]
  selection: Selection | undefined
  setSelection: Dispatch<SetStateAction<Selection | undefined>>
}

export const SelectSegment = ({
  bucketValues,
  skipNames,
  selection,
  setSelection
}: SelectSegmentProps) => {
  return (
    <div className="p-4 gap-2 flex items-center">
      <Select
        value={selection?.bucketName || ''}
        onValueChange={value => {
          setSelection({
            bucketName: value,
            bucketValues: Array.from(new Set(data[value as keyof typeof data] as string[])).sort()
          })
        }}
      >
        <SelectTrigger className="w-min">
          <SelectValue placeholder="Select segment" />
        </SelectTrigger>
        <SelectContent>
          {bucketValues
            .filter(value => !skipNames?.includes(value))
            .map(value => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {selection && (
        <Button variant="ghost" size="icon" onClick={() => setSelection(undefined)}>
          <X />
        </Button>
      )}
      {selection && (
        <MultiSelect
          className="w-min"
          options={Array.from(new Set(data[selection.bucketName as keyof typeof data] as string[]))
            .sort()
            .map(value => ({ label: value, value }))}
          selectedValues={selection.bucketValues}
          setSelectedValues={items => {
            setSelection({ ...selection, bucketValues: items })
          }}
        />
      )}
    </div>
  )
}
