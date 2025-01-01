import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientFormFields } from "./ClientFormFields";
import { clientFormSchema, type ClientFormValues, type ClientAccount } from "./client-form.schema";

interface ClientAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientAccount | null;
}

export const ClientAccountDialog = ({
  open,
  onOpenChange,
  client,
}: ClientAccountDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      display_name: "",
      registered_name: "",
      client_code: "",
      slug: "",
      location_type: "BRANCH",
      is_active: true,
      is_client: false,
      relationship_type: "PROSPECT",
      relationship_notes: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      gstin: "",
      tan: "",
      icn: "",
      parent_client_account_id: "",
      headquarters_id: "",
      industry_id: "",
      entity_type_id: "",
      contact_info: null,
      logo_url: "",
    },
  });

  // Fetch parent accounts
  const { data: parentAccounts } = useQuery({
    queryKey: ["parent-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_accounts")
        .select("client_account_id, display_name")
        .eq("location_type", "HEADQUARTERS");
      
      if (error) throw error;
      return data.map(account => ({
        value: account.client_account_id,
        label: account.display_name,
      }));
    },
  });

  // Fetch industries
  const { data: industries } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industries")
        .select("industry_id, industry_name");
      
      if (error) throw error;
      return data.map(industry => ({
        value: industry.industry_id,
        label: industry.industry_name,
      }));
    },
  });

  // Fetch entity types
  const { data: entityTypes } = useQuery({
    queryKey: ["entity-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entity_types")
        .select("entity_type_id, type_name");
      
      if (error) throw error;
      return data.map(type => ({
        value: type.entity_type_id,
        label: type.type_name,
      }));
    },
  });

  useEffect(() => {
    if (client) {
      form.reset(client);
    }
  }, [client, form]);

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      const { data: clientData, error: clientError } = client
        ? await supabase
            .from("client_accounts")
            .update(values)
            .eq("client_account_id", client.client_account_id)
            .select()
            .single()
        : await supabase
            .from("client_accounts")
            .insert(values)
            .select()
            .single();

      if (clientError) throw clientError;

      // Handle parent_client_association if parent_client_account_id is provided
      if (values.parent_client_account_id) {
        const { error: associationError } = await supabase
          .from("parent_client_association")
          .upsert(
            {
              client_account_id: clientData.client_account_id,
              parent_company_id: values.parent_client_account_id,
            },
            { onConflict: "client_account_id" }
          );

        if (associationError) throw associationError;
      }

      return clientData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: `Client ${client ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? "Edit" : "Create"} Client Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <ClientFormFields
              form={form}
              parentAccounts={parentAccounts || []}
              industries={industries || []}
              entityTypes={entityTypes || []}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {client ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};