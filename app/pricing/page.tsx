import { TopNav } from "@/components/kingdom/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  { name: "Free", price: "$0", feature: "Basic workspace", cta: "Current", paid: false },
  { name: "Pro", price: "$29", feature: "Protected dashboard + premium automations", cta: "Upgrade to Pro", paid: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen"><TopNav />
      <main className="mx-auto max-w-7xl px-8 py-16 lg:px-16">
        <h1 className="font-heading text-5xl">Pricing</h1>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.name} className="rounded-3xl"><CardHeader><div className="flex items-center justify-between"><CardTitle className="font-heading text-3xl">{plan.name}</CardTitle>{plan.name==="Pro" ? <Badge data-testid="pricing-pro-badge">Recommended</Badge> : null}</div></CardHeader>
              <CardContent className="space-y-6"><p className="text-4xl">{plan.price}<span className="text-base text-muted-foreground">/month</span></p><p className="text-muted-foreground">{plan.feature}</p>
                {plan.paid ? <form action="/api/stripe/checkout" method="POST"><Button className="w-full" data-testid="pricing-pro-cta">{plan.cta}</Button></form> : <Button className="w-full" variant="outline" data-testid="pricing-free-cta">{plan.cta}</Button>}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
