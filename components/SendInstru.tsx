import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import CoverUploader from "./Cardphoto";
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import BpmInput from "./BpmInput";
import ScaleSelect from "./ScaleSelect";
import AudioUploader from "./AudioUpload";
import { useState } from "react";
import InputTitle from "./titleInput";
import InputPrice from "./PriceInput";
import { toast } from "sonner";
import Axios from "@/lib/axios";

type MyBtnProps = {
  children: ReactNode;
  setLoader:React.Dispatch<React.SetStateAction<boolean>>;
};

function SendInstru({ children , setLoader }: MyBtnProps) {
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("[FREE] Himra - Type Beat 2025 OUBLIER");
  const [bpm, setBpm] = useState<string>("140");
  const [scale, setScale] = useState<string>("Am");
  const [standardPrice, setStandardPrice] = useState<string>("15000");
  const [premiumPrice, setPremiumPrice] = useState<string>("20000");
  const [audios, setAudios] = useState<File[]>([]);

  //shipping manager
  async function handleSubmit() {
    // Vérification des champs
    setLoader(true)
    if (
      !title ||
      !bpm ||
      !scale ||
      !cover ||
      audios.length === 0 ||
      !standardPrice ||
      !premiumPrice
    ) {
      toast.error(
        "Veuillez remplir tous les champs et ajouter les fichiers nécessaires."
      );
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

      const rep = await Axios.post("api/Instrumentals", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
      

      console.log("Succès :", rep.data);
      window.location.reload();
      toast.success("Instrument ajouté avec succès !");
      //setLoader(false)
  
    } catch (error: any) {
      setLoader(false)
      if (error.response) {
        console.log("Erreur côté serveur :", error.response.data);
        toast.error(error.response.data.error || "Erreur inconnue côté serveur");
      } else if (error.request) {
        setLoader(false)
        console.log("Pas de réponse du serveur :", error.request);
        toast.error("Impossible de contacter le serveur. Vérifie ta connexion.");
      } else {
    // Autre erreur (par ex: mauvaise config Axios)
        setLoader(false)
        console.log("Erreur inconnue :", error.message);
        toast.error("Oupps, une erreur est survenue veillez réessayer ou contactez le créateur");
      }
  }

}

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto w-[550px] max-h-[100vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Ajouter une instrumental</SheetTitle>
        </SheetHeader>

        <div className="p-2 flex flex-col items-center gap-5">
          <CoverUploader setCover={setCover} />
          <InputTitle title={title} setTitle={setTitle} />
          <div className="flex gap-5">
            <BpmInput setBpm={setBpm} />
            <ScaleSelect setScale={setScale} />
          </div>
        </div>

        <div className="flex  items-center  gap-2.5 w-full border h-auto p-2">
          <InputPrice
            label="Standard"
            Price={standardPrice}
            setAction={setStandardPrice}
          />
          <InputPrice
            label="Premium"
            Price={premiumPrice}
            setAction={setPremiumPrice}
          />
        </div>

        <div className="flex  items-center  gap-2.5 w-full border h-auto p-2">
          <AudioUploader onChange={setAudios} />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSubmit}>
              Ajouter
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default SendInstru;
