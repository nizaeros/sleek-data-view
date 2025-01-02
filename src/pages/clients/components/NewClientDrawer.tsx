import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { GeneralSection } from "./form-sections/GeneralSection";
import { ClientStatusSection } from "./form-sections/ClientStatusSection";
import { AddressSection } from "./form-sections/AddressSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { clientFormSchema, type ClientFormValues } from "../client-form.schema";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";

interface NewClientDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewClientDrawer({ open, onOpenChange }: NewClientDrawerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sectionProgress, setSectionProgress] = useState({
    general: 0,
    status: 0,
    address: 0
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      display_name: "",
      registered_name: "",
      client_code: "",
      location_type: "BRANCH",
      is_client: true,
      is_active: true,
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      parent_client_account_id: "",
      parent_company_id: "",
      website: "",
      linkedin: "",
      registration_number: "",
    },
  });

  const formValues = form.watch();
  
  useEffect(() => {
    const generalFields = ['display_name', 'registered_name', 'client_code', 'location_type'];
    const generalProgress = calculateSectionProgress(generalFields, formValues);
    
    const statusFields = ['parent_company_id'];
    const statusProgress = calculateSectionProgress(statusFields, formValues);
    
    const addressFields = ['address_line1', 'city', 'country', 'postal_code'];
    const addressProgress = calculateSectionProgress(addressFields, formValues);
    
    setSectionProgress({
      general: generalProgress,
      status: statusProgress,
      address: addressProgress
    });
  }, [formValues]);

  function calculateSectionProgress(fields: string[], values: any) {
    const filledFields = fields.filter(field => {
      const value = values[field];
      return value !== null && value !== undefined && value !== '';
    });
    return (filledFields.length / fields.length) * 100;
  }

  const handleLogoUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(data.path);
        setLogoUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ClientFormValues) => {
    try {
      // Generate slug from display name
      const slug = values.display_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Generate client code if not provided
      const clientCode = values.client_code || values.display_name.substring(0, 3).toUpperCase();
      
      // Insert into client_accounts
      const { data: clientData, error: clientError } = await supabase
        .from('client_accounts')
        .insert({
          display_name: values.display_name,
          registered_name: values.registered_name || values.display_name,
          client_code: clientCode,
          slug,
          location_type: values.location_type,
          is_client: true,
          is_active: values.is_active,
          address_line1: values.address_line1 || null,
          address_line2: values.address_line2 || null,
          city: values.city || null,
          state: values.state || null,
          country: values.country || null,
          postal_code: values.postal_code || null,
          parent_client_account_id: values.parent_client_account_id || null,
          logo_url: logoUrl,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Insert parent company association
      const { error: associationError } = await supabase
        .from('parent_client_association')
        .insert({
          client_account_id: clientData.client_account_id,
          parent_company_id: values.parent_company_id,
        });

      if (associationError) throw associationError;

      // Invalidate queries to refresh the client list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-counts'] });

      toast({
        title: "Success",
        description: "Client created successfully",
      });

      // Reset form and close drawer
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create client",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[800px] sm:w-[900px] overflow-y-auto">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl font-semibold text-[#1034A6]">Add New Client</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-4">
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Company Logo</Label>
            <ImageUpload
              value={logoUrl}
              onChange={handleLogoUpload}
              className="w-32 h-32"
            />
          </div>
          <Form {...form}>
            <form className="space-y-4">
              <Accordion type="single" defaultValue="general" className="w-full space-y-4">
                <AccordionItem value="general" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="hover:no-underline py-3 px-4 bg-slate-50">
                    <div className="flex flex-col items-start">
                      <span className="text-[#1034A6] font-medium">General Information</span>
                      <Progress value={sectionProgress.general} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-white">
                    <GeneralSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="hover:no-underline py-3 px-4 bg-slate-50">
                    <div className="flex flex-col items-start">
                      <span className="text-[#1034A6] font-medium">Client Status</span>
                      <Progress value={sectionProgress.status} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-white">
                    <ClientStatusSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="address" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="hover:no-underline py-3 px-4 bg-slate-50">
                    <div className="flex flex-col items-start">
                      <span className="text-[#1034A6] font-medium">Address Information</span>
                      <Progress value={sectionProgress.address} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-white">
                    <AddressSection form={form} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </div>
        <div className="border-t p-6 mt-auto">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              Save Client
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
