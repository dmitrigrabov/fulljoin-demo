import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useState, forwardRef, type ComponentType, type ButtonHTMLAttributes } from 'react'

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva('m-1 transition ease-in-out duration-300', {
  variants: {
    variant: {
      default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
      secondary:
        'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type Option = {
  /** The text to display for the option. */
  label: string
  /** The unique value associated with the option. */
  value: string
  /** Optional icon component to display alongside the option. */
  icon?: ComponentType<{ className?: string }>
}

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: Option[]

  selectedValues: string[]

  setSelectedValues: (selectedValues: string[]) => void

  /** The default selected values when the component mounts. */
  defaultValue?: string[]

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      selectedValues,
      setSelectedValues,
      variant,
      placeholder = 'Select options',
      maxCount = 0,
      modalPopover = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    // const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    //   if (event.key === 'Enter') {
    //     setIsPopoverOpen(true)
    //   } else if (event.key === 'Backspace' && !event.currentTarget.value) {
    //     const newSelectedValues = [...selectedValues]
    //     newSelectedValues.pop()
    //     setSelectedValues(newSelectedValues)
    //     onValueChange(newSelectedValues)
    //   }
    // }

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter(value => value !== option)
        : [...selectedValues, option]
      setSelectedValues(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
    }

    const handleTogglePopover = () => {
      setIsPopoverOpen(prev => !prev)
    }

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount)
      setSelectedValues(newSelectedValues)
    }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear()
      } else {
        const allValues = options.map(option => option.value)
        setSelectedValues(allValues)
      }
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.length === 1 && !maxCount ? (
                    <SelectedOption
                      key={selectedValues[0]}
                      value={selectedValues[0]}
                      options={options}
                      variant={variant}
                    />
                  ) : null}
                  {selectedValues.slice(0, maxCount).map(option => (
                    <SelectedOption
                      key={option}
                      value={option}
                      options={options}
                      variant={variant}
                    />
                  ))}
                  {selectedValues.length > Math.max(1, maxCount) && (
                    <Badge
                      className={cn(
                        'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                        multiSelectVariants({ variant })
                      )}
                    >
                      {maxCount
                        ? `+ ${selectedValues.length - maxCount} more`
                        : `${selectedValues.length - maxCount} selected`}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mx-2 h-4 w-4 cursor-pointer rounded-full"
                    onClick={event => {
                      event.stopPropagation()
                      clearExtraOptions()
                    }}
                  >
                    <XIcon
                      className="h-4 mx-2 cursor-pointer text-muted-foreground"
                      onClick={event => {
                        event.stopPropagation()
                        handleClear()
                      }}
                    />
                  </Button>
                  <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selectedValues.length === options.length
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
                {options.map(option => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'

type SelectedOptionProps = {
  value: string
  options: Option[]
  variant: 'default' | 'secondary' | 'destructive' | 'inverted' | null | undefined
}

const SelectedOption = ({ value, options, variant }: SelectedOptionProps) => {
  const option = options.find(o => o.value === value)
  const IconComponent = option?.icon

  return (
    <Badge key={value} className={cn(multiSelectVariants({ variant }))}>
      {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
      {option?.label}
    </Badge>
  )
}
