import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormValues } from "../../client-form.schema";
import { Link, Linkedin, Building2 } from "lucide-react";

interface ContactSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ContactSection = ({ form }: ContactSectionProps) => {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-9 pl-9" />
                  <Link className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-9 pl-9" />
                  <Linkedin className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-9 pl-9" />
                  <Building2 className="absolute left-2.5 top-2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};