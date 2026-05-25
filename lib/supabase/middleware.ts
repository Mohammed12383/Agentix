import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/account"))) return NextResponse.redirect(new URL("/login", request.url));
  if (user && isAuthPage) return NextResponse.redirect(new URL("/pricing", request.url));
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase.from("profiles").select("subscription_status").eq("id", user.id).single();
    if (profile?.subscription_status !== "pro") return NextResponse.redirect(new URL("/pricing", request.url));
  }
  return response;
}
