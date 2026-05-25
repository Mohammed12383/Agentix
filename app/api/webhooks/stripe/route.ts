import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  if (!stripe) {
    return new Response("Stripe is not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return new Response("Missing webhook signature", { status: 400 });

  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (error) { return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      const supabase = await createClient();
      await supabase.from("profiles").upsert({ id: userId, subscription_status: "pro" });
    }
  }

  return new Response("ok", { status: 200 });
}
