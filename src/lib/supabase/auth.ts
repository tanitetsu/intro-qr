import { getSupabase } from "@/lib/supabase/client";

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  return supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = getSupabase();
  return supabase.auth.signOut();
}

export async function getSessionUser() {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
