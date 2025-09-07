import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type AudioUploaderProps = {
  onChange?: (files: File[]) => void
}

export default function AudioUploader({ onChange }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : []
    setFiles(selected)
    onChange?.(selected)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Ajouter des fichiers audio</Label>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFilesChange}
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Sélectionner les fichiers
      </Button>

      {files.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 text-sm">
          {files.map((file) => (
            <li key={file.name} className="truncate">{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
