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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Axios from "@/lib/axios";

interface Instru {
  id: number;
  client: string;
  instrumental: string;
  licence: "FREE" | "STANDARD" | "PREMIUM";
  prix: string;
}

function Sale() {
  const [instru, setInstru] = useState<Instru[]>([]);
  const [loading, setLoading] = useState(true);

  // get Instru requête
  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await Axios.get(`api/Paiement`);
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
      return (
        <>
          <Loader />
        </>
      );
    } else if (!instru) {
      return (
        <p className="text-center text-red-500">Instrumental non disponible</p>
      );
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
              {/* <TableHead>Date</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {instru.map((instru, index) => (
                <TableRow
                  key={instru.id}>
                  <TableCell>{instru.client}</TableCell>
                  <TableCell>{instru.instrumental}</TableCell>
                  <TableCell>{instru.licence}</TableCell>
                  <TableCell>{instru.prix}</TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}

export default Sale;
