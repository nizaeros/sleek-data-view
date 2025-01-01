import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ClientFormFields } from "./ClientFormFields";
import type { ClientAccount } from "./client-form.schema";
import { useClientForm } from "./hooks/useClientForm";
import { useClientData } from "./hooks/useClientData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientAccount | null;
}

export const ClientAccountDialog = ({
  open,
  onOpenChange,
  client,
}: ClientAccountDialogProps) => {
  const { form, mutation } = useClientForm(client, () => {
    onOpenChange(false);
    form.reset();
  });

  const { toast } = useToast();
  const { parentAccounts, industries, entityTypes } = useClientData();

  useEffect(() => {
    if (client) {
      form.reset(client);
    } else {
      // Reset form with default values when opening for a new client
      form.reset({
        display_name: "",
        registered_name: "",
        registration_number: null,
        client_code: "",
        slug: "",
        location_type: "BRANCH",
        is_active: true,
        is_client: false,
        relationship_type: "PROSPECT",
        relationship_notes: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        country: null,
        postal_code: null,
        gstin: null,
        tan: null,
        icn: null,
        parent_client_account_id: null,
        headquarters_id: null,
        industry_id: null,
        entity_type_id: null,
        contact_info: null,
        logo_url: null,
        parent_company_id: "",
        website: null,
        linkedin: null,
      });
    }
  }, [client, form, open]);

  const handleLogoUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error uploading logo",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);

    form.setValue("logo_url", publicUrl);
  };

  const onSubmit = async (data: any) => {
    if (!form.formState.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!data.parent_company_id) {
      toast({
        title: "Error",
        description: "Please select a parent company",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? "Edit" : "Create"} Client Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ClientFormFields
              form={form}
              parentAccounts={parentAccounts}
              industries={industries}
              entityTypes={entityTypes}
              onLogoUpload={handleLogoUpload}
              client={client}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending || !form.formState.isValid}
              >
                {client ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};