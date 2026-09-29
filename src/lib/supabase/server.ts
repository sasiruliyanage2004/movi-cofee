import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseServerConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseServiceRoleKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseServiceRoleKey.includes("placeholder")
  );
}

/**
 * Server-only Supabase Admin Client.
 * Uses the Service Role Key to bypass RLS for trusted server operations.
 * NEVER EXPOSE TO CLIENT/BROWSER.
 */
export function getSupabaseServerClient() {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: getSupabaseServerClient() called in browser environment!");
  }

  if (!isSupabaseServerConfigured()) {
    return null;
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
