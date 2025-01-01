import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormValues } from "../../client-form.schema";
import { ParentCompanySection } from "../ParentCompanySection";

interface CompanyStatusSectionProps {
  form: UseFormReturn<ClientFormValues>;
  client?: { client_account_id: string } | null;
}

export const CompanyStatusSection = ({ form, client }: CompanyStatusSectionProps) => {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium border-b pb-2">Company Status</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel className="font-medium">Active Status</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_client"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel className="font-medium">Is Client</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="parent_company_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ParentCompanySection
                selectedCompanyId={field.value}
                clientAccountId={client?.client_account_id}
                onSelect={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};