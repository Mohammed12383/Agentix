import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    <main className="mx-auto max-w-7xl px-8 py-16 lg:px-16">
      <h1 className="font-heading text-5xl">Pro Dashboard</h1>
      <p className="mt-4 text-muted-foreground">Protected area for paid members.</p>
      <section className="mt-10 rounded-3xl border bg-card p-8"><p data-testid="dashboard-user-email">Signed in as: {data.user?.email ?? "unknown"}</p></section>
    </main>
  );
}
