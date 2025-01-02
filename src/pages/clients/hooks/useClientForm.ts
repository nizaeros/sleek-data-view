import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clientFormSchema, type ClientFormValues, type ClientAccount } from "../client-form.schema";
import { useEffect } from "react";

export const useClientForm = (client: ClientAccount | null, onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      display_name: client?.display_name || "",
      registered_name: client?.registered_name || "",
      client_code: client?.client_code || "",
      location_type: client?.location_type || "BRANCH",
      is_active: client?.is_active ?? true,
      is_client: client?.is_client ?? true,
      relationship_type: client?.relationship_type || "PROSPECT",
      address_line1: client?.address_line1 || "",
      address_line2: client?.address_line2 || "",
      city: client?.city || "",
      state: client?.state || "",
      country: client?.country || "",
      postal_code: client?.postal_code || "",
      parent_client_account_id: client?.parent_client_account_id || "",
      parent_company_id: "",
      website: client?.website || "",
      linkedin: client?.linkedin || "",
      registration_number: client?.registration_number || "",
      gstin: client?.gstin || "",
      tan: client?.tan || "",
      icn: client?.icn || "",
    },
  });

  useEffect(() => {
    const fetchParentCompanyAssociation = async () => {
      if (client?.client_account_id) {
        console.log("Fetching parent company association for client:", client.client_account_id);
        const { data, error } = await supabase
          .from("parent_client_association")
          .select("parent_company_id")
          .eq("client_account_id", client.client_account_id)
          .single();

        if (error) {
          console.error("Error fetching parent company association:", error);
          return;
        }

        if (data) {
          console.log("Found parent company association:", data);
          form.setValue("parent_company_id", data.parent_company_id);
        }
      }
    };

    fetchParentCompanyAssociation();
  }, [client, form]);

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      console.log("Starting mutation with values:", values);
      const { parent_company_id, ...clientData } = values;

      if (!parent_company_id) {
        throw new Error("Parent company selection is required");
      }

      let savedClient;
      
      if (client) {
        // Update existing client
        console.log("Updating existing client:", client.client_account_id);
        const { data, error: clientError } = await supabase
          .from("client_accounts")
          .update({
            ...clientData,
            display_name: values.display_name,
            registered_name: values.registered_name || values.display_name,
            location_type: values.location_type,
            is_client: values.is_client,
            is_active: values.is_active,
            relationship_type: values.relationship_type,
          })
          .eq("client_account_id", client.client_account_id)
          .select()
          .single();

        if (clientError) {
          console.error("Error updating client:", clientError);
          throw clientError;
        }
        savedClient = data;

        // Update parent client association
        const { error: associationError } = await supabase
          .from("parent_client_association")
          .upsert(
            {
              client_account_id: client.client_account_id,
              parent_company_id: parent_company_id,
            },
            {
              onConflict: "client_account_id",
            }
          );

        if (associationError) {
          console.error("Error updating association:", associationError);
          throw associationError;
        }
      } else {
        // Create new client
        console.log("Creating new client");
        const { data, error: clientError } = await supabase
          .from("client_accounts")
          .insert({
            ...clientData,
            display_name: values.display_name,
            registered_name: values.registered_name || values.display_name,
            location_type: values.location_type,
            is_client: values.is_client,
            is_active: values.is_active,
            relationship_type: values.relationship_type,
          })
          .select()
          .single();

        if (clientError) {
          console.error("Error creating client:", clientError);
          throw clientError;
        }
        savedClient = data;

        // Create parent client association
        const { error: associationError } = await supabase
          .from("parent_client_association")
          .insert({
            client_account_id: savedClient.client_account_id,
            parent_company_id: parent_company_id,
          });

        if (associationError) {
          console.error("Error creating association:", associationError);
          throw associationError;
        }
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