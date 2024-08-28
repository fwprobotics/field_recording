"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRun } from "@/use-runs"

const frameworks = [
  {
    value: "merged",
    label: "Edited",
  },
  {
    value: "robot",
    label: "Robot",
  },
  {
    value: "bird",
    label: "Bird",
  },
  {
    value: "cropped",
    "label":"Field View"
  },
  {
    value: "close",
    label: "Close Up",
  }
]

export function ViewSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [run, setRun] = useRun()

  React.useEffect(() => {
   
    }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between  m-2"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select view..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  defaultChecked={framework.value === "merged"}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setRun({
                        ...run,
                        view: currentValue as "merged" | "bird" | "close" | "robot",
                      })
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
