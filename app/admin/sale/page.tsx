"use client";
import Loader from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Axios from "@/lib/axios";

interface Instru {
  id: number;
  client: string;
  instrumental: string;
  licence: "FREE" | "STANDARD" | "PREMIUM";
  prix: string;
}

export default function Sale() {
  const [instru, setInstru] = useState<Instru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await Axios.get(`/api/Paiement`);
        console.log(res.data);
        setInstru(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstruments();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (instru.length === 0) {
    return <p className="text-center text-red-500">Aucun paiement trouvé</p>;
  }

  return (
    <div>
      <CardContent>
        <Table>
          <TableCaption>Historique de paiement</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'artiste</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Type de licence</TableHead>
              <TableHead>Prix</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {instru.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.instrumental}</TableCell>
                <TableCell>{item.licence}</TableCell>
                <TableCell>{item.prix}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
