import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GeneralSectionProps {
  form: UseFormReturn<any>;
}

export function GeneralSection({ form }: GeneralSectionProps) {
  const { data: parentClients } = useQuery({
    queryKey: ['parent-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('client_account_id, display_name')
        .eq('location_type', 'HEADQUARTERS');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Display Name</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
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
            <FormLabel className="text-xs">Client Code</FormLabel>
            <FormControl>
              <Input {...field} className="h-8" />
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
            <FormLabel className="text-xs">Location Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-8">
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
        name="has_parent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
            <FormLabel className="text-xs">Has Parent Client</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch('has_parent') && (
        <FormField
          control={form.control}
          name="parent_client_account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Parent Client</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select parent client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentClients?.map((client) => (
                    <SelectItem key={client.client_account_id} value={client.client_account_id}>
                      {client.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}