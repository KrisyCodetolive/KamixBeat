import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import CoverUploader from "./Cardphoto";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BpmInput from "./BpmInput";
import ScaleSelect from "./ScaleSelect";
import AudioUploader from "./AudioUpload";
import { useState } from "react" 
import InputTitle from "./titleInput";
import InputPrice from "./PriceInput";
import addInstru from "@/api/add-instru";
import { toast } from "sonner"

type MyBtnProps = {
  children: ReactNode;
};

function SendInstru({children}:MyBtnProps ) {
  const [cover, setCover] = useState<File | null>(null)
  const [title, setTitle] = useState("[FREE] Himra - Type Beat 2025 OUBLIER")
  const [bpm, setBpm] = useState<string>("140")
  const [scale, setScale] = useState<string>("Am")
  const [standardPrice, setStandardPrice] = useState<string>("15000")
  const [premiumPrice, setPremiumPrice] = useState<string>("20000")
  const [audios, setAudios] = useState<File[]>([])



async function handleSubmit() {
  // Vérification des champs
  if (!title ||
  !bpm ||
  !scale ||
  !cover ||
  !audios ||
  !standardPrice || !premiumPrice) {
         toast.error("Veuillez remplir tous les champs et ajouter les fichiers nécessaires.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("bpm", bpm.toString());
    formData.append("gamme", scale);
    formData.append("cover", cover!);
    formData.append("preview", audios[0]);
    formData.append("full", audios[1]);
    formData.append("project", audios[2]);

    const prices = ["Free", standardPrice, premiumPrice];
    formData.append("prices", JSON.stringify(prices));

    const rep = await addInstru(formData);
    window.location.reload();
    toast.success("Instrument ajouté avec succès !");
    console.log(rep);

  } catch (error: any) {
    toast.error(error?.message || "Une erreur est survenue lors de l'ajout de l'instrument veuiller réessayer.");
    console.error(error);
  }
}


  return (
    <Sheet >
        <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className=" w-[550px] max-h-[100vh] flex flex-col" >
        <SheetHeader>
          <SheetTitle>Ajouter une instrumental</SheetTitle>
        </SheetHeader>


        <div className="flex-1 overflow-y-auto p-2 flex flex-col items-center gap-5">
            <CoverUploader setCover={setCover} />
            <InputTitle title={title} setTitle={setTitle}/>
            <div className="flex gap-5"><BpmInput setBpm={setBpm}/><ScaleSelect setScale={setScale}/></div>
        </div>

        <div className="flex  items-center  gap-2.5 w-full border h-auto p-2">
         <InputPrice label="Standard" setAction={setStandardPrice}/>
         <InputPrice label="Premium" setAction={setPremiumPrice}/>
        </div>

        <div className="flex  items-center  gap-2.5 w-full border h-auto p-2">
         <AudioUploader onChange={setAudios}/>
        </div>


        <SheetFooter className="overflow-y-auto">
          <SheetClose asChild>
             <Button type="submit"  onClick={handleSubmit}>Ajouter</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
       
    </Sheet>
  );
}

export default SendInstru;
