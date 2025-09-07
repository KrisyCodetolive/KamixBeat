import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction } from "react"

type InputPriceProps = {
  label: string
  setAction: Dispatch<SetStateAction<string>>
}

export default function InputPrice({ label, setAction }: InputPriceProps) {
  const [price, setPrice] = useState<string>("12000")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "12000" : e.target.value
    setPrice(value)
    if (value) {
      setAction(value)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label} (CFA)</Label>
      <Input
        type="number"
        value={price}
        placeholder="12.000 CFA"
        onChange={handleChange}
        className="w-[250px]"
      />
    </div>
  )
}
