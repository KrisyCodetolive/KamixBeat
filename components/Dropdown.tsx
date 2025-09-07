import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import AlertSingle from "./AlertSingle";

type MyBtnProps = {
  id: number;
  children: ReactNode;
  title: string;
};

function MenuDropdown({ children, id, title }: MyBtnProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsAlertOpen(true); // Ouvre l'alerte
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
      <AlertSingle id={id} title={title} Open={isAlertOpen} Close={()=> setIsAlertOpen(false)}/>
    </div>
  );
}

export default MenuDropdown;
