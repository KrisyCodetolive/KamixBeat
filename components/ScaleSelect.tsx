import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dispatch, SetStateAction } from "react"

type ScaleSelectProps = {
  value?: string
  setScale: Dispatch<SetStateAction<string>>
}

export default function ScaleSelect({ value = "Am", setScale }: ScaleSelectProps) {
  const [gamme, setGamme] = useState<string>(value)
  


  const handleChange = (newValue: string) => {
    setGamme(newValue)
    setScale(newValue)
  }

    const scales = [
    "C", "Cm", "C#", "C#m",
    "D", "Dm", "D#", "D#m",
    "E", "Em",
    "F", "Fm", "F#", "F#m",
    "G", "Gm", "G#", "G#m",
    "A", "Am", "A#", "A#m",
    "B", "Bm"
  ]

  return (
    <Select value={gamme} onValueChange={handleChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Scale" />
      </SelectTrigger>
      <SelectContent>
        {scales.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
