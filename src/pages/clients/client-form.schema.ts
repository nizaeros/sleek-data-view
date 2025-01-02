import { z } from "zod";

export const clientFormSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  registered_name: z.string().optional(),
  client_code: z.string().optional(),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]),
  is_client: z.boolean().default(true),
  is_active: z.boolean().default(true),
  relationship_type: z.enum(["PROSPECT", "CLIENT", "PARTNER", "AFFILIATE"]).default("PROSPECT"),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  parent_client_account_id: z.string().optional(),
  parent_company_id: z.string().min(1, "Parent company is required"),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  registration_number: z.string().optional(),
  gstin: z.string().optional(),
  tan: z.string().optional(),
  icn: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export type ClientAccount = ClientFormValues & {
  client_account_id: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
};