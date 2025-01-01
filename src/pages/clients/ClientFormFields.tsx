import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormValues } from "./client-form.schema";
import { Upload } from "lucide-react";
import { GeneralSection } from "./components/form-sections/GeneralSection";
import { CompanyStatusSection } from "./components/form-sections/CompanyStatusSection";
import { ContactSection } from "./components/form-sections/ContactSection";
import { AddressSection } from "./components/form-sections/AddressSection";

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormValues>;
  parentAccounts: { value: string; label: string; }[];
  industries: { value: string; label: string; }[];
  entityTypes: { value: string; label: string; }[];
  onLogoUpload: (file: File) => Promise<void>;
  client?: { client_account_id: string } | null;
}

export const ClientFormFields = ({
  form,
  parentAccounts,
  industries,
  entityTypes,
  onLogoUpload,
  client,
}: ClientFormFieldsProps) => {
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onLogoUpload(file);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <GeneralSection form={form} parentAccounts={parentAccounts} />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <CompanyStatusSection form={form} client={client} />
            <ContactSection form={form} />
          </div>
          <AddressSection form={form} />
        </div>

        {/* Registration & Tax Information */}
        <div className="space-y-3 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-medium border-b pb-2">Registration & Tax Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="registered_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gstin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICN</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="p-4 border rounded-lg bg-white">
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </label>
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Company logo"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};