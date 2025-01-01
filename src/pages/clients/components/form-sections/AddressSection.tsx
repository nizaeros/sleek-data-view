import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormValues } from "../../client-form.schema";

interface AddressSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export const AddressSection = ({ form }: AddressSectionProps) => {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium border-b pb-2">Address Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address_line1"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_line2"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};