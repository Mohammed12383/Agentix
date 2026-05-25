import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const { data: profile } = user ? await supabase.from("profiles").select("subscription_status").eq("id", user.id).single() : { data: null };
  return (
    <main className="mx-auto max-w-4xl px-8 py-16 lg:px-16">
      <h1 className="font-heading text-5xl">Account</h1>
      <div className="mt-10 rounded-3xl border bg-card p-8 space-y-4">
        <p data-testid="account-email">Email: {user?.email ?? "Unknown"}</p>
        <p data-testid="account-subscription">Subscription: {profile?.subscription_status ?? "free"}</p>
        <form action="/api/stripe/checkout" method="POST"><Button type="submit" data-testid="account-manage-subscription">Manage subscription</Button></form>
      </div>
    </main>
  );
}
