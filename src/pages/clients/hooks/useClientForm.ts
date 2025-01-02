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

  const generateUniqueSlug = async (displayName: string, currentSlug?: string): Promise<string> => {
    // Generate base slug
    let baseSlug = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // If we're updating and the slug hasn't changed, return the current slug
    if (currentSlug && baseSlug === currentSlug) {
      return currentSlug;
    }

    // Add timestamp to make the slug unique
    const timestamp = Date.now().toString(36);
    baseSlug = `${baseSlug}-${timestamp}`;

    // Double check if the slug exists (just in case)
    const { data: existingClients } = await supabase
      .from("client_accounts")
      .select("slug")
      .eq("slug", baseSlug)
      .single();

    if (existingClients) {
      // In the unlikely case of a collision, add a random string
      const randomString = Math.random().toString(36).substring(2, 7);
      baseSlug = `${baseSlug}-${randomString}`;
    }

    return baseSlug;
  };

  const mutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      console.log("Starting mutation with values:", values);
      const { parent_company_id, ...clientData } = values;

      if (!parent_company_id) {
        throw new Error("Parent company selection is required");
      }

      // Generate unique slug based on whether we're updating or creating
      const slug = await generateUniqueSlug(values.display_name, client?.slug);

      // Generate client code if not provided
      const clientCode = values.client_code || values.display_name.substring(0, 3).toUpperCase();

      // Prepare data for insert/update
      const data = {
        ...clientData,
        slug,
        client_code: clientCode,
        display_name: values.display_name,
        registered_name: values.registered_name || values.display_name,
        location_type: values.location_type,
        is_client: values.is_client,
        is_active: values.is_active,
        relationship_type: values.relationship_type,
      };

      console.log("Inserting/updating client account");
      const { data: savedClient, error: clientError } = client
        ? await supabase
            .from("client_accounts")
            .update(data)
            .eq("client_account_id", client.client_account_id)
            .select()
            .single()
        : await supabase
            .from("client_accounts")
            .insert(data)
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