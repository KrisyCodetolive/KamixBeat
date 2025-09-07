import {delInstru} from "@/api/del-instru";
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

import { ReactNode } from "react";

import { toast } from "sonner"

type MyBtnProps = {
    id:number
//   children: ReactNode;
  title: string
  Open: boolean;
  Close: () => void;
};


function AlertSingle({id,title,Open , Close}:MyBtnProps) {

      // delete instru
    async function DelInstru(id:number){
    
      try {
    
        const rep = await delInstru(id);
        toast.success("l'instrumental a bien été supprimé avec succès !");
        window.location.reload();
        console.log(rep);
    
      } catch (error: any) {
        toast.error(error?.message || "Une erreur est survenue lors de la suppression veuiller réessayer.");
        console.error(error);
      }
    }


  return ( 

    <AlertDialog open={Open}>
      {/* <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> */}
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Est-tu sure?</AlertDialogTitle>
      <AlertDialogDescription>
        Veux tu vraiment supprimer <span className="text-red-500">{title}</span> ?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={(e)=>{Close(); e.stopPropagation()}} >Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={(e)=> {DelInstru(id); e.stopPropagation()}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
   );
}

export default AlertSingle;