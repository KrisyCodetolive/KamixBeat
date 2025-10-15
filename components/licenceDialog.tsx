//import { useState } from "react";
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useEffect } from "react";
import axios from "axios";
import PaystackPop from "@paystack/inline-js";
import { AnyARecord } from "dns";

interface LicenseInfoProps {
  children: ReactNode;
  Price: {
    path: string;
    price: string;
  }[];
}

export function LicenseDialog({ children, Price }: LicenseInfoProps) {
  //   useEffect(() => {
  //   // Charger Paystack côté navigateur seulement
  //   if (typeof window !== "undefined") {
  //     require("@paystack/inline-js");
  //   }
  // }, []);

  //transaction de payement
  const handlePay = async () => {
    //setLoading(true);

    try {
      // Initialiser la transaction via ton backend
      const res = await axios.post(
        "/api/Paystack/Initialization",
        {
          email: "test@example.com",
          amount: 2000, // 20 NGN pour test
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      console.log("Données reçues:", data);

      if (data) {
        // Ouvrir la popup Paystack
        const popup = new PaystackPop();
        popup.resumeTransaction(data.access_code, {
          onSuccess: async (transaction: any) => {
            console.log("Paiement réussi :", transaction);

                    // Vérification côté serveur
            const verify = await axios.post("/api/Paystack/verify", {
              reference: transaction.reference,
            });

            if (verify.data.success) {
              alert("🎉 Paiement confirmé par le serveur !");
            } else {
              alert("⚠️ Paiement non confirmé, réessaye !");
            }
          },
          onCancel: () => {
            alert("Paiement annulé");
          },
        });
      } else {
        alert("Erreur d'initialisation du paiement");
      }
    } catch (error: any) {
      console.error(
        "Erreur lors de l'initialisation :",
        error.response?.data || error.message
      );
      alert("Erreur lors de l'initialisation du paiement");
    }

    //setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choisissez votre licence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Price[1].price == "0" ? (
            ""
          ) : (
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Free</span>
              <span>0 CFA</span>
            </div>
          )}

          <div className="flex justify-between items-center p-2 border rounded">
            <span>Standard</span>
            <span>{Price[1].price} CFA</span>
          </div>
          <div className="flex justify-between items-center p-2 border rounded">
            <span>Premium</span>
            <span>{Price[2].price} CFA</span>
          </div>
        </div>
        <DialogFooter>
          {Price[1].price == "0" ? (
            <></>
          ) : (
            <Button
              variant="outline"
              onClick={() => console.log("Paiement Premium")}
            >
              Free
            </Button>
          )}

          <Button
            variant={Price[1].price == "0" ? "outline" : "default"}
            onClick={handlePay}
          >
            Standard
          </Button>
          <Button onClick={() => console.log("Paiement Premium")}>
            Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
