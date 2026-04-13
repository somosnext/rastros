"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";
import type { User } from "@supabase/supabase-js";

export default function ProtectedContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (!data.user) setShowAuth(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuth(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--g5)" }}>
          <h2 className="font-serif" style={{ marginBottom: 12 }}>Conteúdo exclusivo</h2>
          <p>Faça login para acessar esta seção.</p>
          <button
            className="btn-pri"
            style={{ marginTop: 24 }}
            onClick={() => setShowAuth(true)}
          >
            Entrar
          </button>
        </div>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
