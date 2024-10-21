import { Dispatch, SetStateAction } from 'react'
import { MultiSelect } from '@/components/multi-select'
import { Selection } from '@/components/types'

type SelectorProps = {
  name: string
  values: string[]
  selected: Selection | undefined
  setSelected: Dispatch<SetStateAction<Selection | undefined>>
}

export const Selector = ({ name, values, selected, setSelected }: SelectorProps) => {
  return (
    <div className="max-w-60">
      <MultiSelect
        options={Array.from(values)
          .sort()
          .map(value => ({ value, label: value }))}
        setSelectedValues={selectedValues => {
          setSelected(
            selectedValues.length ? { bucketName: name, bucketValues: selectedValues } : undefined
          )
        }}
        selectedValues={selected?.bucketValues ?? []}
        placeholder={name}
        variant="inverted"
        maxCount={0}
      />
    </div>
  )
}
