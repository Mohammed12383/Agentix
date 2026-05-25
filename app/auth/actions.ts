"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account` } });
  redirect("/account?magic-link=sent");
}

export async function signupWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account` } });
  redirect("/signup?magic-link=sent");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account` } });
  if (data.url) redirect(data.url);
  redirect("/login");
}
