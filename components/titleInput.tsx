import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"

type InputTitleProps = {
  title: string
  setTitle: Dispatch<SetStateAction<string>>
}

export default function InputTitle({ title, setTitle }: InputTitleProps) {
  return (
    <Input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="[FREE] Himra - Type Beat 2025 OUBLIER"
      className="w-[250px]"
    />
  )
}