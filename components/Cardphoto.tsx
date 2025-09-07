import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


type CoverUploaderProps = {
  setCover: React.Dispatch<React.SetStateAction<File | null>>
}

export default function CoverUploader({setCover}:CoverUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
  
    if (file) {
        setCover(file);
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <Card
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer w-30 h-30 flex items-center justify-center rounded-2xl border-2 border-dashed hover:border-primary p-0"
      >
        <CardContent className="p-0 w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
  {preview ? (
    <div
      className="w-full h-full bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${preview})` }}
    />
  ) : (
    <span className="text-muted-foreground text-[10px]">Ajouter une photo</span>
  )}
</CardContent>
      </Card>

      {preview && (
        <Button
          variant="destructive"
          onClick={() => setPreview(null)}
          className="w-20"
        >
          Remove
        </Button>
      )}
    </div>
  )
}
