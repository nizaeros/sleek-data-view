import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClientData = () => {
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

  return {
    parentAccounts: parentAccounts || [],
    industries: industries || [],
    entityTypes: entityTypes || [],
  };
};