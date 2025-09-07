import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"

type BpmInputProps = {
  value?: number
  setBpm: Dispatch<SetStateAction<string>>
}

export default function BpmInput({ value = 140, setBpm }: BpmInputProps) {
  const [bpm, setBPM] = useState<number>(value)

  const handleChange = (newValue: number) => {
    setBPM(newValue)
    setBpm(String(newValue))
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => handleChange(bpm > 0 ? bpm - 5 : 0)} variant="outline">
        -
      </Button>
      <Input
        type="number"
        value={bpm}
        placeholder="Bpm"
        onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
        className="w-20 text-center"
      />
      <Button onClick={() => handleChange(bpm + 5)} variant="outline">
        +
      </Button>
    </div>
  )
}
