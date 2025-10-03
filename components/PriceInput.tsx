import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction } from "react"

type InputPriceProps = {
  label: string
  Price: string
  setAction: Dispatch<SetStateAction<string>>
}

export default function InputPrice({ label, Price , setAction }: InputPriceProps) {
  //const Default = `${Price} CFA`;
  const [price, setPrice] = useState<string>(`${Price} CFA`)
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? price : e.target.value
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
        placeholder={price}
        onChange={handleChange}
        step={5000} 
        className="w-[250px]"
      />
    </div>
  )
}
