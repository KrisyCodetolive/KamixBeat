"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SendInstru from "@/components/SendInstru";
import Instru from "./instrumental";
import api from "@/lib/axios";
import { formatDate } from "@/utils/formDate";
import AlertUI from "./Alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {  Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import MenuDropdown from "./Dropdown";
import InstruPopup from "./PopUpInstru";
import { getInstru } from "@/api/get-Instru";
import Loader  from "./Loader";

interface Instru {
  instruId: number;
  title: string;
  bpm: string;
  genre: string;
  cover: string;
  url: string;
  date: string;
}

function DisplayInstru() {
  const [instruments, setInstruments] = useState<Instru[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstruId, setSelectedInstruId] = useState<number>(0);
  const [ouvrir, setOuvrir] = useState(false);
  const [infoChargement, setInfoChargement] = useState("Liste des instrus disponibles");

  // get Instru requête
  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await api.get("/api/Instrumentals");
        setInstruments(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        setInfoChargement("Une erreur est survenue veillez réessayer ou contacter le créateur")
        
      } finally {
        setLoading(false);
      }
    }

    fetchInstruments();
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (loading) return <Loader/>;

  return (
    <div>
      <Card className="w-full shadow-md">
        <CardHeader className="flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Liste des instrus</h2>

          <div className="flex gap-2">
            <SendInstru setLoader={setLoading}>
              <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl px-4 py-2 shadow-md transition-all duration-200">
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </SendInstru>

            <AlertUI>
              <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Supprimer</span>
              </Button>
            </AlertUI>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>{infoChargement}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Adresse</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {instruments.map((instru, index) => (
                <TableRow
                  key={instru.instruId}
                  onClick={() => {
                    setSelectedInstruId(instru.instruId);
                    setOuvrir(true);
                  }}
                >
                  <TableCell>{instru.title}</TableCell>
                  <TableCell>{formatDate(instru.date)}</TableCell>
                  <TableCell>
                    <a
                      href={`${origin}/client/${instru.instruId}`}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {`${origin}/client/${instru.instruId}`}
                    </a>
                  </TableCell>
                  <TableCell>
                    <MenuDropdown setLoader={setLoading} id={instru.instruId} title={instru.title}>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </div>
                    </MenuDropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {
        ouvrir && <InstruPopup id={selectedInstruId} open={ouvrir} setOpen={() => setOuvrir(false)} /> 

      }
      
    </div>
  );
}

export default DisplayInstru;
