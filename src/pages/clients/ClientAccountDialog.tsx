import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      display_name: client?.display_name || "",
      registered_name: client?.registered_name || "",
      client_code: client?.client_code || "",
      slug: client?.slug || "",
      location_type: client?.location_type || "BRANCH",
      address_line1: client?.address_line1 || "",
      address_line2: client?.address_line2 || "",
      city: client?.city || "",
      state: client?.state || "",
      country: client?.country || "",
      postal_code: client?.postal_code || "",
      gstin: client?.gstin || "",
      tan: client?.tan || "",
      icn: client?.icn || "",
      parent_client_account_id: client?.parent_client_account_id || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.getValues()) => {
      const { data: clientData, error: clientError } = client
        ? await supabase
            .from("client_accounts")
            .update(values)
            .eq("client_account_id", client.client_account_id)
            .select()
            .single()
        : await supabase.from("client_accounts").insert(values).select().single();

      if (clientError) throw clientError;

      if (values.parent_client_account_id) {
        const { error: associationError } = await supabase
          .from("parent_client_association")
          .upsert(
            {
              client_account_id: clientData.client_account_id,
              parent_company_id: values.parent_client_account_id,
            },
            { onConflict: "client_account_id" }
          );

        if (associationError) throw associationError;
      }

      return clientData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: `Client ${client ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {client ? "Edit" : "Create"} Client Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registered_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more form fields for other client account properties */}
            </div>
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