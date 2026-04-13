"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/videos");
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1 className="auth-title font-serif">Entrar</h1>
        <p className="auth-sub">Acesse sua conta para salvar seu progresso</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p style={{ textAlign: "right", marginTop: 4 }}>
          <Link
            href="/auth/esqueci-senha"
            style={{ fontSize: 11, color: "var(--g5)", borderBottom: "1px solid var(--g7)", transition: "color .2s" }}
          >
            Esqueci minha senha
          </Link>
        </p>

        <div className="auth-actions">
          <button className="btn-pri" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <p className="auth-link">
          Ainda não tem conta? <Link href="/auth/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}
