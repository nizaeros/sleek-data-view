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

  const { parentAccounts, industries, entityTypes } = useClientData();

  useEffect(() => {
    if (client) {
      form.reset(client);
    }
  }, [client, form]);

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

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? "Edit" : "Create"} Client Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
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
              <Button type="submit">
                {client ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};