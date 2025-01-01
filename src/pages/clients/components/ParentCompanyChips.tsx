import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ParentCompanyChipsProps {
  selectedCompanyId: string | null;
  clientAccountId?: string;
  onSelect: (companyId: string | null) => void;
}

export const ParentCompanyChips = ({
  selectedCompanyId,
  clientAccountId,
  onSelect,
}: ParentCompanyChipsProps) => {
  const { toast } = useToast();
  const [currentAssociation, setCurrentAssociation] = useState<string | null>(null);

  // Fetch parent companies
  const { data: parentCompanies } = useQuery({
    queryKey: ["parent-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_companies")
        .select("parent_company_id, display_name")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch existing association if editing
  useEffect(() => {
    const fetchAssociation = async () => {
      if (!clientAccountId) return;

      const { data, error } = await supabase
        .from("parent_client_association")
        .select("parent_company_id")
        .eq("client_account_id", clientAccountId)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error fetching association",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setCurrentAssociation(data.parent_company_id);
        onSelect(data.parent_company_id);
      }
    };

    fetchAssociation();
  }, [clientAccountId]);

  return (
    <div className="flex flex-wrap gap-2">
      {parentCompanies?.map((company) => (
        <button
          key={company.parent_company_id}
          type="button"
          onClick={() => onSelect(
            selectedCompanyId === company.parent_company_id ? null : company.parent_company_id
          )}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            selectedCompanyId === company.parent_company_id
              ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
              : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
          }`}
        >
          {selectedCompanyId === company.parent_company_id ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          {company.display_name}
          {currentAssociation === company.parent_company_id && (
            <span className="ml-1 text-xs text-blue-600">(Current)</span>
          )}
        </button>
      ))}
    </div>
  );
};