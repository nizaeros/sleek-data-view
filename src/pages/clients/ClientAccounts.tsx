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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Client Accounts</h1>
        <Button onClick={handleCreate}>Add Client</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Client Code</TableHead>
              <TableHead>Location Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.client_account_id}>
                <TableCell>{client.display_name}</TableCell>
                <TableCell>{client.client_code}</TableCell>
                <TableCell>{client.location_type}</TableCell>
                <TableCell>{client.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(client)}>
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