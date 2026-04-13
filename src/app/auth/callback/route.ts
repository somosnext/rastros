import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_PATHS = ["/", "/videos", "/exame", "/plano", "/novena", "/vagas", "/auth/redefinir-senha"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/videos";

  // Validar que o redirecionamento é interno
  const safePath = ALLOWED_PATHS.includes(next) ? next : "/videos";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
