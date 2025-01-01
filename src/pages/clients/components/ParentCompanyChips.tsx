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
  const [currentAssociations, setCurrentAssociations] = useState<string[]>([]);

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

  // Fetch existing associations if editing
  useEffect(() => {
    const fetchAssociations = async () => {
      if (!clientAccountId) return;

      const { data, error } = await supabase
        .from("parent_client_association")
        .select("parent_company_id")
        .eq("client_account_id", clientAccountId);

      if (error) {
        toast({
          title: "Error fetching associations",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const associatedIds = data.map(assoc => assoc.parent_company_id);
        setCurrentAssociations(associatedIds);
        // If there's at least one association, select the first one
        if (associatedIds.length > 0 && !selectedCompanyId) {
          onSelect(associatedIds[0]);
        }
      }
    };

    fetchAssociations();
  }, [clientAccountId]);

  return (
    <div className="flex flex-wrap gap-2">
      {parentCompanies?.map((company) => {
        const isSelected = selectedCompanyId === company.parent_company_id;
        const isCurrentlyAssociated = currentAssociations.includes(company.parent_company_id);
        
        return (
          <button
            key={company.parent_company_id}
            type="button"
            onClick={() => onSelect(
              isSelected ? null : company.parent_company_id
            )}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              isSelected
                ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
            }`}
          >
            {isSelected ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            {company.display_name}
            {isCurrentlyAssociated && !isSelected && (
              <span className="ml-1 text-xs text-blue-600">(Current)</span>
            )}
          </button>
        );
      })}
    </div>
  );
};