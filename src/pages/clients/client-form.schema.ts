import { z } from "zod";

export const clientFormSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  registered_name: z.string().nullable().optional(),
  client_code: z.string().nullable().optional(),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]).optional(),
  is_client: z.boolean().default(true),
  is_active: z.boolean().default(true),
  relationship_type: z.enum(["PROSPECT", "CLIENT", "PARTNER", "AFFILIATE"]).default("PROSPECT"),
  address_line1: z.string().nullable().optional(),
  address_line2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  parent_client_account_id: z.string().nullable().optional(),
  parent_company_id: z.string().min(1, "Parent company is required"),
  website: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  registration_number: z.string().nullable().optional(),
  gstin: z.string().nullable().optional(),
  tan: z.string().nullable().optional(),
  icn: z.string().nullable().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export type ClientAccount = ClientFormValues & {
  client_account_id: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
};