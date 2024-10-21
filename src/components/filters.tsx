import { Selector } from '@/components/selector'
import { Selection } from '@/components/types'
import { Dispatch, SetStateAction } from 'react'

type FiltersProps = {
  data: Record<string, string[]>
  skipNames?: string[]
  selection: Selection | undefined
  setSelection: Dispatch<SetStateAction<Selection | undefined>>
}

export const Filters = ({ skipNames, data, selection, setSelection }: FiltersProps) => (
  <div className="flex flex-wrap p-4 gap-4 ">
    {Object.entries(data)
      .filter(([name]) => !skipNames?.includes(name))
      .map(([name, value]) => (
        <Selector
          key={name}
          name={name}
          values={Array.from(new Set(value))}
          selected={selection?.bucketName === name ? selection : undefined}
          setSelected={setSelection}
        />
      ))}
  </div>
)
