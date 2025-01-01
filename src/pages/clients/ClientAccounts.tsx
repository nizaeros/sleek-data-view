import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientAccountDialog } from "./ClientAccountDialog";
import type { Database } from "@/integrations/supabase/types";

type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];

export const ClientAccounts = () => {
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (client: ClientAccount) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1034A6]">Client Accounts</h1>
        <Button onClick={handleCreate} size="sm">Add Client</Button>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-2">Display Name</TableHead>
              <TableHead className="py-2">Client Code</TableHead>
              <TableHead className="py-2 hidden md:table-cell">Location Type</TableHead>
              <TableHead className="py-2 hidden sm:table-cell">Status</TableHead>
              <TableHead className="py-2 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.client_account_id} className="hover:bg-muted/50">
                <TableCell className="py-2">{client.display_name}</TableCell>
                <TableCell className="py-2">{client.client_code}</TableCell>
                <TableCell className="py-2 hidden md:table-cell">{client.location_type}</TableCell>
                <TableCell className="py-2 hidden sm:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {client.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(client)}
                    className="h-8 px-2"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ClientAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
      />
    </div>
  );
};