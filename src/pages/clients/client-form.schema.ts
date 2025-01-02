import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];
export type LocationType = Database["public"]["Enums"]["client_location_type"];
export type RelationType = Database["public"]["Enums"]["company_relationship_type"];

export const clientFormSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  registered_name: z.string().min(1, "Registered name is required"),
  client_code: z.string().optional(),
  location_type: z.enum(["HEADQUARTERS", "BRANCH"]).default("BRANCH"),
  is_client: z.boolean().default(true),
  is_active: z.boolean().default(true),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  parent_client_account_id: z.string().optional(),
  parent_company_id: z.string().min(1, "Parent company selection is required"),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;