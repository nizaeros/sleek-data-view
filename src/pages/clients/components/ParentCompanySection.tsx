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

  // Fetch existing associations
  useEffect(() => {
    const fetchAssociations = async () => {
      if (!clientAccountId) {
        setCurrentAssociations([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("parent_client_association")
          .select("parent_company_id")
          .eq("client_account_id", clientAccountId);

        if (error) throw error;

        if (data && data.length > 0) {
          const associatedIds = data.map(assoc => assoc.parent_company_id);
          setCurrentAssociations(associatedIds);
          if (!selectedCompanyId && associatedIds.length > 0) {
            onSelect(associatedIds[0]);
          }
        } else {
          setCurrentAssociations([]);
        }
      } catch (error) {
        console.error("Error fetching associations:", error);
        toast({
          title: "Error",
          description: "Failed to fetch company associations",
          variant: "destructive",
        });
      }
    };

    fetchAssociations();
  }, [clientAccountId, selectedCompanyId, onSelect, toast]);

  const handleToggle = async (companyId: string) => {
    try {
      if (currentAssociations.includes(companyId)) {
        // Remove association
        const { error } = await supabase
          .from("parent_client_association")
          .delete()
          .eq("client_account_id", clientAccountId)
          .eq("parent_company_id", companyId);

        if (error) throw error;

        setCurrentAssociations(prev => prev.filter(id => id !== companyId));
        onSelect(null);
      } else {
        // Add association
        const { error } = await supabase
          .from("parent_client_association")
          .insert({
            client_account_id: clientAccountId,
            parent_company_id: companyId,
          });

        if (error) throw error;

        setCurrentAssociations(prev => [...prev, companyId]);
        onSelect(companyId);
      }

      toast({
        title: "Success",
        description: currentAssociations.includes(companyId) 
          ? "Company association removed" 
          : "Company associated successfully",
      });
    } catch (error) {
      console.error("Error toggling association:", error);
      toast({
        title: "Error",
        description: "Failed to update company association",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Parent Company Association</h3>
      <div className="space-y-2">
        {parentCompanies?.map((company) => {
          const isAssociated = currentAssociations.includes(company.parent_company_id);
          
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