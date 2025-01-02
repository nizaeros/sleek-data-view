import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ParentCompanySection } from "../ParentCompanySection";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "../../client-form.schema";

interface ClientStatusSectionProps {
  form: UseFormReturn<ClientFormValues>;
  clientId?: string;
}

export const ClientStatusSection = ({ form, clientId }: ClientStatusSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="parent_company_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent Company</FormLabel>
            <ParentCompanySection
              selectedCompanyId={field.value}
              clientAccountId={clientId}
              onSelect={(companyId) => field.onChange(companyId)}
            />
          </FormItem>
        )}
      />
    </div>
  );
};