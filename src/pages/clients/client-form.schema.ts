import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];
export type LocationType = Database["public"]["Enums"]["client_location_type"];
export type RelationType = Database["public"]["Enums"]["company_relationship_type"];

export const clientFormSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  registered_name: z.string().min(1, "Registered name is required"),
  gstin: z.string().optional().nullable(),
  tan: z.string().optional().nullable(),
  icn: z.string().optional().nullable(),
  entity_type_id: z.string().optional().nullable(),
  industry_id: z.string().optional().nullable(),
  client_code: z.string().min(1, "Client code is required"),
  slug: z.string().min(1, "Slug is required"),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]),
  is_active: z.boolean().default(true),
  is_client: z.boolean().default(false),
  relationship_type: z.enum(["PROSPECT", "CLIENT", "PARTNER", "AFFILIATE"]),
  relationship_notes: z.string().optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  parent_client_account_id: z.string().optional().nullable(),
  headquarters_id: z.string().optional().nullable(),
  contact_info: z.any().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  parent_company_id: z.string({
    required_error: "Parent company selection is required",
  }),
  website: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;