"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSucesso(true);
  }

  if (sucesso) {
    return (
      <div className="auth-wrap">
        <div className="auth-box" style={{ textAlign: "center" }}>
          <h1 className="auth-title font-serif">Senha redefinida</h1>
          <p style={{ color: "var(--g4)", fontSize: 14, marginTop: 16, marginBottom: 32 }}>
            Sua senha foi alterada com sucesso.
          </p>
          <button
            className="btn-pri"
            onClick={() => { router.push("/"); router.refresh(); }}
          >
            Ir para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h1 className="auth-title font-serif">Nova senha</h1>
        <p className="auth-sub">Escolha uma nova senha para sua conta</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>Nova senha</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="auth-field">
          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Repita a nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="auth-actions">
          <button className="btn-pri" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </div>
      </form>
    </div>
  );
}
