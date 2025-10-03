import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Axios from "@/lib/axios"
import { toast } from "sonner"

type MyBtnProps = {
  id:number
  title: string
  Open: boolean;
  Close: () => void;
  setLoader:React.Dispatch<React.SetStateAction<boolean>>;
};


function AlertSingle({id , title , Open , setLoader , Close}:MyBtnProps) {

      // delete instru
    async function DelInstru(id:number){
      setLoader(true)
      try{

        const res = await Axios.delete(`api/Instrumentals/${id}`);
        console.log('reponse:', res.data);
        window.location.reload()
        toast.success("Instrument a été supprimé avec succès !");
    
      }catch (error:any){

        if (error.request) {
          setLoader(false)
          console.log("❌ Serveur injoignable ou problème réseau");
          toast.success("Instrument a été supprimé avec succès !");

        }
        setLoader(false)
        console.log('erreur:', error);
        toast.success("Oupp, une erreur est survenue veillez réessayer ou contacter le créateur...");
        return error;
}}


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