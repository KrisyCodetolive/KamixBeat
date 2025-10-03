import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import AlertSingle from "./AlertSingle";

type MyBtnProps = {
  id: number;
  children: ReactNode;
  title: string;
  setLoader:React.Dispatch<React.SetStateAction<boolean>>;
};

function MenuDropdown({ children, id, title , setLoader }: MyBtnProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsAlertOpen(true); 
  };

  return (
    <div>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Télécharger</DropdownMenuItem>
          <DropdownMenuItem onClick={(e)=> {e.stopPropagation(); handleDeleteClick()}}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertSingle setLoader={setLoader} id={id} title={title} Open={isAlertOpen} Close={()=> setIsAlertOpen(false)}/>
    </div>
  );
}

export default MenuDropdown;
