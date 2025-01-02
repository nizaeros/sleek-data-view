import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clientFormSchema, type ClientFormValues, type ClientAccount } from "../client-form.schema";

export const useClientForm = (client: ClientAccount | null, onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      display_name: "",
      registered_name: "",
      client_code: "",
      location_type: "BRANCH",
      is_active: true,
      is_client: true,
      relationship_type: "PROSPECT",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      parent_client_account_id: "",
      parent_company_id: "",
      website: "",
      linkedin: "",
      registration_number: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      console.log("Starting mutation with values:", values);
      const { parent_company_id, ...clientData } = values;

      if (!parent_company_id) {
        throw new Error("Parent company selection is required");
      }

      console.log("Inserting/updating client account");
      const { data: savedClient, error: clientError } = client
        ? await supabase
            .from("client_accounts")
            .update(clientData as ClientAccount)
            .eq("client_account_id", client.client_account_id)
            .select()
            .single()
        : await supabase
            .from("client_accounts")
            .insert(clientData as ClientAccount)
            .select()
            .single();

      if (clientError) {
        console.error("Error saving client:", clientError);
        throw clientError;
      }

      console.log("Saved client:", savedClient);

      console.log("Upserting parent client association");
      const { error: associationError } = await supabase
        .from("parent_client_association")
        .upsert(
          {
            client_account_id: savedClient.client_account_id,
            parent_company_id: parent_company_id,
          },
          {
            onConflict: "client_account_id,parent_company_id",
          }
        );

      if (associationError) {
        console.error("Error saving association:", associationError);
        throw associationError;
      }

      return savedClient;
    },
    onSuccess: () => {
      console.log("Mutation completed successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: `Client ${client ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  return { form, mutation };
};