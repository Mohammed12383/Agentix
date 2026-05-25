import Link from "next/link";
import { TopNav } from "@/components/kingdom/top-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginWithEmail, signInWithGoogle } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen"><TopNav />
      <main className="mx-auto flex max-w-xl items-center px-8 py-20">
        <Card className="w-full rounded-3xl"><CardHeader><CardTitle className="font-heading text-3xl">Welcome back</CardTitle><CardDescription>Login with email or continue with Google.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <form action={loginWithEmail} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required data-testid="login-email" /></div><Button className="w-full" data-testid="login-email-submit">Continue with email</Button></form>
            <form action={signInWithGoogle}><Button variant="outline" className="w-full" data-testid="login-google">Continue with Google</Button></form>
            <p className="text-sm text-muted-foreground">No account? <Link href="/signup" className="underline" data-testid="login-to-signup">Create one</Link></p>
          </CardContent></Card>
      </main>
    </div>
  );
}
