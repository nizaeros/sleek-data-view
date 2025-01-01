import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowRightCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];

interface ClientTableProps {
  clients: ClientAccount[];
  onEdit: (client: ClientAccount) => void;
  formatLocation: (client: ClientAccount) => string;
  isFetchingNextPage: boolean;
}

export const ClientTable = ({ 
  clients, 
  onEdit, 
  formatLocation,
  isFetchingNextPage 
}: ClientTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="py-1.5">Display Name</TableHead>
            <TableHead className="py-1.5">Client Code</TableHead>
            <TableHead className="py-1.5">Location</TableHead>
            <TableHead className="py-1.5">Location Type</TableHead>
            <TableHead className="py-1.5">Status</TableHead>
            <TableHead className="py-1.5 w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.client_account_id} className="hover:bg-muted/50">
              <TableCell className="py-1.5">{client.display_name}</TableCell>
              <TableCell className="py-1.5">{client.client_code}</TableCell>
              <TableCell className="py-1.5">{formatLocation(client)}</TableCell>
              <TableCell className="py-1.5">{client.location_type}</TableCell>
              <TableCell className="py-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(client)}
                    className="h-7 w-7 text-gray-400 hover:text-[#1034A6] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-[#1034A6] transition-colors"
                    onClick={() => console.log('Navigate to dashboard', client.client_account_id)}
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loading more...
        </div>
      )}
    </>
  );
};