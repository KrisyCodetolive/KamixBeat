import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formDate";
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


function Sale() {
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
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
              <TableRow>
                <TableCell>Didi b</TableCell>
                <TableCell>free himra type beat officiel...</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell className="text-green-500">20000cfa</TableCell>
                <TableCell>26 Aout,25</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}

export default Sale;
