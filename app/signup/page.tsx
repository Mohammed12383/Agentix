import Link from "next/link";
import { TopNav } from "@/components/kingdom/top-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupWithEmail, signInWithGoogle } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <div className="min-h-screen"><TopNav />
      <main className="mx-auto flex max-w-xl items-center px-8 py-20">
        <Card className="w-full rounded-3xl"><CardHeader><CardTitle className="font-heading text-3xl">Create your account</CardTitle><CardDescription>Sign up with email or Google to begin.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <form action={signupWithEmail} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required data-testid="signup-email" /></div><Button className="w-full" data-testid="signup-email-submit">Sign up with email</Button></form>
            <form action={signInWithGoogle}><Button variant="outline" className="w-full" data-testid="signup-google">Continue with Google</Button></form>
            <p className="text-sm text-muted-foreground">Already registered? <Link href="/login" className="underline" data-testid="signup-to-login">Log in</Link></p>
          </CardContent></Card>
      </main>
    </div>
  );
}
