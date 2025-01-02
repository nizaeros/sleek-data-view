import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { GeneralSection } from "./form-sections/GeneralSection";
import { ClientStatusSection } from "./form-sections/ClientStatusSection";
import { AddressSection } from "./form-sections/AddressSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  logo_url: z.string().optional().nullable(),
  display_name: z.string().min(1, "Display name is required"),
  client_code: z.string().optional().nullable(),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]),
  has_parent: z.boolean().default(false),
  parent_client_account_id: z.string().optional().nullable(),
  parent_company_id: z.string().min(1, "Parent company selection is required"),
  is_active: z.boolean().default(true),
  is_client: z.boolean().default(true),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewClientDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewClientDrawer({ open, onOpenChange }: NewClientDrawerProps) {
  const { toast } = useToast();
  const [sectionProgress, setSectionProgress] = useState({
    general: 0,
    status: 0,
    address: 0
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo_url: null,
      display_name: "",
      client_code: null,
      location_type: "BRANCH",
      has_parent: false,
      parent_client_account_id: null,
      parent_company_id: "",
      is_active: true,
      is_client: true,
      address_line1: null,
      address_line2: null,
      city: null,
      state: null,
      country: null,
      postal_code: null,
      website: null,
      linkedin: null,
    },
  });

  const formValues = form.watch();
  
  useEffect(() => {
    const generalFields = ['display_name', 'client_code', 'location_type'];
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

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Form values:", values);
      
      // Insert into client_accounts
      const { data: clientData, error: clientError } = await supabase
        .from('client_accounts')
        .insert({
          display_name: values.display_name,
          client_code: values.client_code || values.display_name.substring(0, 3).toUpperCase(),
          location_type: values.location_type,
          is_client: true,
          is_active: values.is_active,
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          country: values.country,
          postal_code: values.postal_code,
          parent_client_account_id: values.parent_client_account_id,
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

      toast({
        title: "Success",
        description: "Client created successfully",
      });

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 h-full w-[500px] mt-0 border-l">
        <DrawerHeader className="px-4 py-2">
          <DrawerTitle>Add New Client</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 overflow-y-auto h-[calc(100vh-140px)]">
          <Form {...form}>
            <form className="space-y-2">
              <Accordion type="single" defaultValue="general" className="w-full space-y-2">
                <AccordionItem value="general" className="border px-2 py-1">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex flex-col items-start">
                      <span>General Information</span>
                      <Progress value={sectionProgress.general} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <GeneralSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status" className="border px-2 py-1">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex flex-col items-start">
                      <span>Client Status</span>
                      <Progress value={sectionProgress.status} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ClientStatusSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="address" className="border px-2 py-1">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex flex-col items-start">
                      <span>Address Information</span>
                      <Progress value={sectionProgress.address} className="w-[200px] h-1.5 mt-1" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <AddressSection form={form} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </div>
        <div className="border-t p-4 mt-auto">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              Save Client
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}