import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    return (
      <>
        <Nav />
        <main className="page-enter">
          <div className="sh">
            <p className="sl">Acesso Restrito</p>
            <h2 className="st font-serif">Sem permissão</h2>
          </div>
          <p style={{ color: "var(--g4)", fontSize: 14 }}>
            Você não tem permissão de administrador. Peça a um admin para alterar seu role no banco de dados.
          </p>
          {error && (
            <p style={{ color: "var(--g6)", fontSize: 12, marginTop: 16 }}>
              Erro: {error.message}
            </p>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="page-enter">{children}</main>
    </>
  );
}
