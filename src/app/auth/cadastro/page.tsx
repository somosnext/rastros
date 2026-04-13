"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEmailEnviado(true);
  }

  if (emailEnviado) {
    return (
      <div className="auth-wrap">
        <div className="auth-box" style={{ textAlign: "center" }}>
          <h1 className="auth-title font-serif">Confirme seu e-mail</h1>
          <p style={{ color: "var(--g4)", fontSize: 14, marginBottom: 8 }}>
            Enviamos um link de confirmação para:
          </p>
          <p style={{ color: "var(--w)", fontSize: 15, fontWeight: 600, marginBottom: 24 }}>
            {email}
          </p>
          <p style={{ color: "var(--g5)", fontSize: 13, marginBottom: 32 }}>
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
            Não esqueça de verificar a pasta de spam.
          </p>
          <Link href="/auth/login" className="btn-pri" style={{ display: "inline-block", padding: "14px 32px", textDecoration: "none" }}>
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1 className="auth-title font-serif">Criar Conta</h1>
        <p className="auth-sub">Cadastre-se para salvar seu progresso e publicar vagas</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="auth-actions">
          <button className="btn-pri" type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </div>

        <p className="auth-link">
          Já tem conta? <Link href="/auth/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
