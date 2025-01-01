import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      registration_number: null,
      client_code: "",
      slug: "",
      location_type: "BRANCH",
      is_active: true,
      is_client: false,
      relationship_type: "PROSPECT",
      relationship_notes: null,
      address_line1: null,
      address_line2: null,
      city: null,
      state: null,
      country: null,
      postal_code: null,
      gstin: null,
      tan: null,
      icn: null,
      parent_client_account_id: null,
      headquarters_id: null,
      industry_id: null,
      entity_type_id: null,
      contact_info: null,
      logo_url: null,
      parent_company_id: "",
      website: null,
      linkedin: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      const { parent_company_id, ...clientData } = values;

      if (!parent_company_id) {
        throw new Error("Parent company selection is required");
      }

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

      if (clientError) throw clientError;

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

      if (associationError) throw associationError;

      return savedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: `Client ${client ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  return { form, mutation };
};