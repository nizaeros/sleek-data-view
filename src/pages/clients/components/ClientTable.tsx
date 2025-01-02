import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

interface ClientTableProps {
  clients: any[];
  formatLocation: (client: any) => string;
  isFetchingNextPage: boolean;
}

export const ClientTable = ({ clients, formatLocation, isFetchingNextPage }: ClientTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#F3F3F3]">
        <TableRow className="border-none hover:bg-[#F3F3F3]">
          <TableHead className="h-9 text-xs font-medium text-[#333333]">Client Name</TableHead>
          <TableHead className="h-9 text-xs font-medium text-[#333333]">Client Code</TableHead>
          <TableHead className="h-9 text-xs font-medium text-[#333333]">Location Type</TableHead>
          <TableHead className="h-9 text-xs font-medium text-[#333333]">Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow 
            key={client.client_account_id}
            className="h-10 border-b border-[#F1F1F1] hover:bg-gray-50/50"
          >
            <TableCell className="py-2 text-sm">
              <div className="flex items-center gap-2">
                {client.is_active ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#ea384c]" />
                )}
                <span className="font-medium text-[#333333]">
                  {client.display_name}
                </span>
              </div>
            </TableCell>
            <TableCell className="py-2 text-sm text-[#555555]">
              {client.client_code}
            </TableCell>
            <TableCell className="py-2 text-sm text-[#555555]">
              {client.location_type}
            </TableCell>
            <TableCell className="py-2 text-sm text-[#555555]">
              {formatLocation(client)}
            </TableCell>
          </TableRow>
        ))}
        {isFetchingNextPage && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-sm text-[#555555]">
              Loading more...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};