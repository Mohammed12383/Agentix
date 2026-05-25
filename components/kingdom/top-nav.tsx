import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/landing", label: "Landing" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 lg:px-16">
        <Link href="/landing" className="font-heading text-xl" data-testid="nav-brand">Kingdom Architect</Link>
        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground motion-lift" data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild className="rounded-full" data-testid="nav-go-pro"><Link href="/pricing">Upgrade</Link></Button>
      </div>
    </header>
  );
}
