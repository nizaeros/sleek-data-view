import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ClientTableProps {
  clients: any[];
  formatLocation: (client: any) => string;
  isFetchingNextPage: boolean;
}

export const ClientTable = ({ clients, formatLocation, isFetchingNextPage }: ClientTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Client Code</TableHead>
          <TableHead>Location Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.client_account_id}>
            <TableCell className="font-medium">{client.display_name}</TableCell>
            <TableCell>{client.client_code}</TableCell>
            <TableCell>{client.location_type}</TableCell>
            <TableCell>{formatLocation(client)}</TableCell>
            <TableCell>
              <Badge variant={client.is_active ? "default" : "secondary"}>
                {client.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {isFetchingNextPage && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading more...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};