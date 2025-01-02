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

const formSchema = z.object({
  // General Section
  logo_url: z.string().optional().nullable(),
  display_name: z.string().min(1, "Display name is required"),
  client_code: z.string().min(1, "Client code is required"),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]),
  has_parent: z.boolean().default(false),
  parent_client_account_id: z.string().optional().nullable(),
  
  // Client Status Section
  parent_company_id: z.string().min(1, "Parent company is required"),
  is_active: z.boolean().default(true),
  is_client: z.boolean().default(false),
  
  // Address Section
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
      client_code: "",
      location_type: "BRANCH",
      has_parent: false,
      parent_client_account_id: null,
      parent_company_id: "",
      is_active: true,
      is_client: false,
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

  // Watch form values to calculate progress
  const formValues = form.watch();
  
  useEffect(() => {
    // Calculate General section progress
    const generalFields = ['display_name', 'client_code', 'location_type'];
    const generalProgress = calculateSectionProgress(generalFields, formValues);
    
    // Calculate Status section progress
    const statusFields = ['parent_company_id'];
    const statusProgress = calculateSectionProgress(statusFields, formValues);
    
    // Calculate Address section progress
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 h-full w-[500px] mt-0">
        <DrawerHeader>
          <DrawerTitle>Add New Client</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-4 pb-10">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start">
                      <span>General Information</span>
                      <Progress value={sectionProgress.general} className="w-[200px] h-2 mt-2" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <GeneralSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start">
                      <span>Client Status</span>
                      <Progress value={sectionProgress.status} className="w-[200px] h-2 mt-2" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ClientStatusSection form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="address">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start">
                      <span>Address Information</span>
                      <Progress value={sectionProgress.address} className="w-[200px] h-2 mt-2" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <AddressSection form={form} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}