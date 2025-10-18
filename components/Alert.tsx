import {delInstruAll} from "@/api/del-instru";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import api from "@/lib/axios";
import { ReactNode } from "react";

import { toast } from "sonner"

type MyBtnProps = {
  children: ReactNode;
};


function AlertUI({children}:MyBtnProps) {

  // delete all instru
async function DelInstru(){

  try {

    const rep = await api.delete("/api/del-instru");
    toast.success("Toutes les instruments on été supprimé avec succès !");
    window.location.reload();
    console.log(rep);

  } catch (error: any) {
    toast.error(error?.message || "Une erreur est survenue lors de la suppression veuiller réessayer.");
    console.error(error);
  }
}


  return ( 

    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Est-tu sure?</AlertDialogTitle>
      <AlertDialogDescription>
        Cette opération supprimera toutes les instrumentals sans retour en arrière
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={DelInstru}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
   );
}

export default AlertUI;