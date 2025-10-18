import { getItems } from "@/api/get-Items";
import api from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import  Loader  from "@/components/Loader";
import { Dot} from "lucide-react";
import { Instru } from "@/utils/Instru";



interface InstruPopupProps {
  id: number;
  open: boolean;
  setOpen: (value: boolean) => void;
}

function InstruPopup({ id, open, setOpen }: InstruPopupProps) {
  const [instru, setInstru] = useState<Instru | null>(null);
  const [loading, setLoading] = useState(true);

  // get Instru requête
  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await api.get(`/api/Instrumentals/${id}`);
        console.log(res.data);
        setInstru(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstruments();
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="sr-only">Instrumental</DialogTitle> 
        {loading ? (
          <Loader />
        ) : !instru ? (
      <p className="text-center text-red-500">Instrumental non disponible</p>
    ) : (
          <>
            <DialogHeader className="flex justify-center items-center">
              <img
                src={instru.SignedUrl[0]}
                alt="cover"
                className="w-40 h-auto object-cover rounded-xl shadow"
              />
            </DialogHeader>
            <div className="flex flex-col justify-center items-center gap-3">
              <DialogTitle>{instru.Instru.title}</DialogTitle>
              <p className="text-blue-500">
                <a href={`${process.env.NEXT_PUBLIC_BASIC_UR}/client/${id}`} target="_blank">{`http://localhost:3000/client/${id}`}</a>
              </p>

              <div className="flex justify-center items-center gap-2">
                <p>{instru.Instru.bpm} bpm</p>
                <Dot />
                <p>{instru.Instru.gamme}</p>
              </div>

              <div className="flex justify-center items-center gap-2">
                <p>
                  {instru.Audio[1].price == "0"
                    ? "GRATUIT"
                    : instru.Audio[1].price + " CFA"}
                </p>
                <p>{instru.Audio[2].price} CFA</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InstruPopup;
