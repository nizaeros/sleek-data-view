import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://apvwjmhseqbuxmjrqcfa.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdndqbWhzZXFidXhtanJxY2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTA5NzAsImV4cCI6MjA1MDg4Njk3MH0.rrNVwHLbnsXznjG7TQ9W1lTY6AAR09iUe-rAoDf6XKk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);