//import { useState } from "react";
"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface LicenseInfoProps {
    children:ReactNode
//   standardPrice: string;
//   premiumPrice: string;
}

export function LicenseDialog({children}:LicenseInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choisissez votre licence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex justify-between items-center p-2 border rounded">
            <span>Free</span>
            <span>0 CFA</span>
          </div>
          <div className="flex justify-between items-center p-2 border rounded">
            <span>Standard</span>
            <span>15000 CFA</span>
          </div>
          <div className="flex justify-between items-center p-2 border rounded">
            <span>Premium</span>
            <span>20000 CFA</span>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => console.log("Paiement Premium")}>
            Free
          </Button>
          <Button  onClick={() => console.log("Paiement Standard")}>
            Payer Standard
          </Button>
          <Button onClick={() => console.log("Paiement Premium")}>
            Payer Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
