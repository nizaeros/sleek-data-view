import { ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ParentCompanySectionProps {
  selectedCompanyId: string | null;
  clientAccountId?: string;
  onSelect: (companyId: string | null) => void;
}

export const ParentCompanySection = ({
  selectedCompanyId,
  clientAccountId,
  onSelect,
}: ParentCompanySectionProps) => {
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
      if (!clientAccountId) {
        setCurrentAssociations([]);
        return;
      }

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
        // If there's at least one association and no selection, select the first one
        if (associatedIds.length > 0 && !selectedCompanyId) {
          onSelect(associatedIds[0]);
        }
      }
    };

    fetchAssociations();
  }, [clientAccountId, toast]);

  const handleToggle = (companyId: string) => {
    // For new clients, just update the selection state
    if (!clientAccountId) {
      onSelect(selectedCompanyId === companyId ? null : companyId);
      return;
    }

    // For existing clients, update the database
    if (currentAssociations.includes(companyId)) {
      setCurrentAssociations(prev => prev.filter(id => id !== companyId));
      if (selectedCompanyId === companyId) {
        onSelect(null);
      }
    } else {
      setCurrentAssociations(prev => [...prev, companyId]);
      onSelect(companyId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Duru Business Association</h3>
      <div className="space-y-2">
        {parentCompanies?.map((company) => {
          const isAssociated = clientAccountId 
            ? currentAssociations.includes(company.parent_company_id)
            : selectedCompanyId === company.parent_company_id;
          
          return (
            <div 
              key={company.parent_company_id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{company.display_name}</span>
              <button
                type="button"
                onClick={() => handleToggle(company.parent_company_id)}
                className="flex items-center gap-2 text-sm"
              >
                {isAssociated ? (
                  <ToggleRight className="w-6 h-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
                <span className={isAssociated ? "text-blue-600" : "text-gray-500"}>
                  {isAssociated ? "Associated" : "Not Associated"}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};