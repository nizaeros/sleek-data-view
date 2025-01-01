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
import { Plus, Pencil, ArrowRightCircle } from "lucide-react";

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

  const formatLocation = (client: ClientAccount) => {
    const parts = [client.city, client.state, client.country]
      .filter(Boolean)
      .join(", ");
    return parts || "-";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-6 py-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-base font-semibold text-[#1034A6]">Client Accounts</h1>
        <Button onClick={handleCreate} size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="border rounded-md overflow-x-auto">
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
            {clients?.map((client) => (
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
                      onClick={() => handleEdit(client)}
                      className="h-7 w-7"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7"
                      // TODO: Implement dashboard navigation
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
      </div>
      <ClientAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
      />
    </div>
  );
};