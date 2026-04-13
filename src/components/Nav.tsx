"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type TabId = "videos" | "exame" | "plano" | "novena" | "vagas";

export const tabs: { id: TabId; label: string }[] = [
  { id: "videos", label: "Vídeos" },
  { id: "exame", label: "Exame de Consciência" },
  { id: "plano", label: "Plano de Vida" },
  { id: "novena", label: "Novena do Trabalho" },
  { id: "vagas", label: "Vagas" },
];

interface NavProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  onAuthClick?: () => void;
}

export default function Nav({ activeTab, onTabChange, onAuthClick }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === "admin");
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  const userName = user?.user_metadata?.nome || user?.email?.split("@")[0] || "";

  return (
    <nav className="nav">
      <div className="nav-in">
        {tabs.map((tab) =>
          isHomePage && onTabChange ? (
            <button
              key={tab.id}
              className={`np${activeTab === tab.id ? " active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ) : (
            <Link
              key={tab.id}
              href={`/${tab.id}`}
              className={`np${pathname === `/${tab.id}` ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          )
        )}
        {user ? (
          <>
            {isAdmin && (
              <Link href="/admin" className={`np${pathname?.startsWith("/admin") ? " active" : ""}`}>
                Admin
              </Link>
            )}
            <span className="np" style={{ color: "var(--g4)", cursor: "default" }}>
              {userName}
            </span>
            <button className="np" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : isHomePage && onAuthClick ? (
          <button className="np" onClick={onAuthClick}>
            Entrar
          </button>
        ) : (
          <Link
            href="/auth/login"
            className={`np${pathname?.startsWith("/auth") ? " active" : ""}`}
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
