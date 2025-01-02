import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ParentCompanySection } from "../ParentCompanySection";

interface ClientStatusSectionProps {
  form: UseFormReturn<any>;
}

export function ClientStatusSection({ form }: ClientStatusSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="parent_company_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ParentCompanySection
                selectedCompanyId={field.value}
                onSelect={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel className="font-normal">Active Status</FormLabel>
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
            <FormLabel className="font-normal">Is Client</FormLabel>
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
  );
}