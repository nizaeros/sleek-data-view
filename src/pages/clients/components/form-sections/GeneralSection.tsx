import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormValues } from "../../client-form.schema";

interface GeneralSectionProps {
  form: UseFormReturn<ClientFormValues>;
  parentAccounts: { value: string; label: string; }[];
}

export const GeneralSection = ({ form, parentAccounts }: GeneralSectionProps) => {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium border-b pb-2">General Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Code</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HEADQUARTERS">Headquarters</SelectItem>
                  <SelectItem value="BRANCH">Branch</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="PARTNER">Partner</SelectItem>
                  <SelectItem value="AFFILIATE">Affiliate</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parent_client_account_id"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Parent Client</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select parent client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentAccounts.map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      {account.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};