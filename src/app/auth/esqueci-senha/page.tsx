"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/redefinir-senha`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="auth-wrap">
        <div className="auth-box" style={{ textAlign: "center" }}>
          <h1 className="auth-title font-serif">E-mail enviado</h1>
          <p style={{ color: "var(--g4)", fontSize: 14, marginTop: 16, marginBottom: 8 }}>
            Enviamos um link de redefinição para:
          </p>
          <p style={{ color: "var(--w)", fontSize: 15, fontWeight: 600, marginBottom: 24 }}>
            {email}
          </p>
          <p style={{ color: "var(--g5)", fontSize: 13, marginBottom: 32 }}>
            Verifique sua caixa de entrada e clique no link para criar uma nova senha.
            Não esqueça de verificar a pasta de spam.
          </p>
          <Link
            href="/auth/login"
            className="btn-pri"
            style={{ display: "inline-block", padding: "14px 32px", textDecoration: "none" }}
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1 className="auth-title font-serif">Esqueci minha senha</h1>
        <p className="auth-sub">Informe seu e-mail para receber o link de redefinição</p>

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

        <div className="auth-actions">
          <button className="btn-pri" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </div>

        <p className="auth-link">
          Lembrou a senha? <Link href="/auth/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
