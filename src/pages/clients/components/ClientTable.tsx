import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowRightCircle, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ClientExpandedView } from "./ClientExpandedView";

interface ClientTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  formatLocation: (client: any) => string;
  isFetchingNextPage: boolean;
}

export const ClientTable = ({ 
  clients, 
  onEdit, 
  formatLocation,
  isFetchingNextPage 
}: ClientTableProps) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRow = (clientId: string) => {
    setExpandedRowId(expandedRowId === clientId ? null : clientId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-[20%] py-1.5">Display Name</TableHead>
            <TableHead className="w-20 py-1.5">Actions</TableHead>
            <TableHead className="py-1.5">Client Code</TableHead>
            <TableHead className="py-1.5">Industry</TableHead>
            <TableHead className="py-1.5">Location</TableHead>
            <TableHead className="py-1.5">Location Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <>
              <TableRow 
                key={client.client_account_id} 
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  expandedRowId === client.client_account_id && "bg-muted/30"
                )}
                onClick={() => toggleRow(client.client_account_id)}
              >
                <TableCell className="py-1.5 w-8">
                  {expandedRowId === client.client_account_id ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-2">
                    <Circle 
                      className={`h-2 w-2 ${
                        client.is_active ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'
                      }`}
                    />
                    {client.display_name}
                  </div>
                </TableCell>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-1 opacity-30 hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(client);
                      }}
                      className="h-7 w-7 text-gray-500 hover:text-[#1034A6] transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-[#1034A6] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Navigate to dashboard', client.client_account_id);
                      }}
                    >
                      <ArrowRightCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="py-1.5">{client.client_code}</TableCell>
                <TableCell className="py-1.5">
                  {client.industry?.industry_name || "-"}
                </TableCell>
                <TableCell className="py-1.5">{formatLocation(client)}</TableCell>
                <TableCell className="py-1.5">{client.location_type}</TableCell>
              </TableRow>
              {expandedRowId === client.client_account_id && (
                <tr>
                  <td colSpan={7} className="p-0">
                    <ClientExpandedView client={client} />
                  </td>
                </tr>
              )}
            </>
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