"use client";

import { SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";// adapte Input si tu as un autre composant
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import PaystackPop from "@paystack/inline-js";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/axios";

interface LicenseInfoProps {
  children: React.ReactNode;
  id: string;
  title:string; 
  Price: {
    path: string;
    price: string; // en NGN ou en la devise d'origine
  }[];
}

export function LicenseDialog({ children, Price, id, title }: LicenseInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);




  const NGNtoXOF = (price: string) => Number(price)*100; 
  const handlePay = async (email: string, amount: number, iden: string) => {
    try {
      const res = await axios.post("/api/Paystack/Initialization", {
        email,
        amount,
      });
      
      const data = res.data;
      if (!data) throw new Error("Erreur d'initialisation Paystack");

      const popup = new PaystackPop();
      popup.resumeTransaction(data.access_code, {
        onSuccess: async (transaction: any) => {
          console.log("Paiement réussi :", transaction);

          // Vérification côté serveur
          setIsDownloading(true);
          const verify = await api.post("/api/Paystack/verify", {
            params:iden,
            reference: transaction.reference,
            type:"Standard",
          });

          if (verify.data.success) {
              console.log("id:",iden)
            // Téléchargement après paiement
            await handleDownload(iden, "Standard", transaction.reference,email);
          } else {
            alert("⚠️ Paiement non confirmé !");
          }
        },
        onCancel: () => alert("Paiement annulé"),
      });
    } catch (error: any) {
      console.error("Erreur Paystack :", error.message);
      alert("Erreur d'initialisation du paiement");
    }
  };

  const handleDownload = async (idenn: string, type: string, ref:string , mail:string="inconnu") => {
    try {
      setIsOpen(false);
      setIsDownloading(true);
      setProgress(0);
      setIsSuccess(null);
      console.log("id:",idenn)
      const response = await axios.post("/api/Paystack/verify", {
        params: idenn,
        reference: ref,
        type,
        email:mail
      });
      console.log("id:",idenn)
      const signedUrl = response.data.signedUrl;
      if (!signedUrl) throw new Error("URL signée manquante");

      const fileResponse = await axios.get(signedUrl, {
        responseType: "blob",
        onDownloadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      const blob = new Blob([fileResponse.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setIsSuccess(true);
      setTimeout(() => setIsDownloading(false), 1500);
    } catch (error) {
      console.error("Erreur téléchargement :", error);
      setIsSuccess(false);
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  const handleStandardClick = async (id:string) => {
    const priceXOF = NGNtoXOF(Price[1].price);
    
    if (priceXOF === 0) {
      await handleDownload(id, "Standard","0",email);
    } else {
      // Demander l'email si non rempli
      if (!email) {
        alert("Veuillez entrer votre email pour la licence Standard");
        return;
      }
      await handlePay(email, priceXOF, id);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Choisissez votre licence</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {Price[0].price === "0" ? null : (
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Free</span>
                <span>0 CFA</span>
              </div>
            )}

            <div className="flex flex-col gap-2 p-2 border rounded">
              <div className="flex justify-between items-center">
                <span>Standard</span>
                <span>{Price[0].price} CFA</span>
              </div>
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center p-2 border rounded">
              <span>Premium</span>
              <span>INDISPONIBLE</span>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {Price[0].price === "0" ? null : (
              <Button variant="outline" onClick={() => handleDownload(id, "Free", "0")}>
                Free
              </Button>
            )}
            <Button variant="default" onClick={()=> handleStandardClick(id)}>
              Standard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- Loader ---------------- */}
      {isDownloading && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          {isSuccess === null && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-white mb-4" />
              <Progress value={progress} className="w-64 h-2" />
              <p className="text-white mt-2">{progress}%</p>
            </>
          )}
          {isSuccess === true && (
            <div className="flex flex-col items-center text-green-400">
              <CheckCircle2 className="w-10 h-10 mb-2" />
              <p>Téléchargement terminé ✅</p>
            </div>
          )}
          {isSuccess === false && (
            <div className="flex flex-col items-center text-red-400">
              <XCircle className="w-10 h-10 mb-2" />
              <p>Échec du téléchargement ❌</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
