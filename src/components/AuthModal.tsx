"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "cadastro" | "esqueci">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [resetEnviado, setResetEnviado] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      onSuccess();
    } else if (mode === "cadastro") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setEmailEnviado(true);
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/redefinir-senha`,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setResetEnviado(true);
    }
  }

  if (emailEnviado) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <h2 className="auth-title font-serif" style={{ marginBottom: 12 }}>Confirme seu e-mail</h2>
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
            <button className="btn-pri" onClick={onClose}>Entendi</button>
          </div>
        </div>
      </div>
    );
  }

  if (resetEnviado) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <h2 className="auth-title font-serif" style={{ marginBottom: 12 }}>E-mail enviado</h2>
            <p style={{ color: "var(--g4)", fontSize: 14, marginBottom: 8 }}>
              Enviamos um link de redefinição para:
            </p>
            <p style={{ color: "var(--w)", fontSize: 15, fontWeight: 600, marginBottom: 24 }}>
              {email}
            </p>
            <p style={{ color: "var(--g5)", fontSize: 13, marginBottom: 32 }}>
              Verifique sua caixa de entrada e clique no link para criar uma nova senha.
              Não esqueça de verificar a pasta de spam.
            </p>
            <button className="btn-pri" onClick={onClose}>Entendi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 className="auth-title font-serif" style={{ textAlign: "left", marginBottom: 0 }}>
            {mode === "login" ? "Entrar" : mode === "cadastro" ? "Criar Conta" : "Esqueci minha senha"}
          </h2>
          <button className="vcard-x" onClick={onClose} style={{ position: "static", fontSize: 18 }}>&#10005;</button>
        </div>

        <p className="auth-sub" style={{ textAlign: "left" }}>
          {mode === "login"
            ? "Acesse sua conta para salvar seu progresso"
            : mode === "cadastro"
            ? "Cadastre-se para salvar seu progresso e publicar vagas"
            : "Informe seu e-mail para receber o link de redefinição"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "cadastro" && (
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
          )}

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

          {mode !== "esqueci" && (
            <div className="auth-field">
              <label>Senha</label>
              <input
                type="password"
                placeholder={mode === "cadastro" ? "Mínimo 6 caracteres" : "Sua senha"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "cadastro" ? 6 : undefined}
              />
              {mode === "login" && (
                <p style={{ textAlign: "right", marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => { setMode("esqueci"); setError(""); }}
                    style={{ background: "none", border: "none", fontSize: 11, color: "var(--g5)", cursor: "pointer", borderBottom: "1px solid var(--g7)", padding: 0, font: "inherit" }}
                  >
                    Esqueci minha senha
                  </button>
                </p>
              )}
            </div>
          )}

          <div className="auth-actions">
            <button className="btn-pri" type="submit" disabled={loading}>
              {loading
                ? (mode === "login" ? "Entrando..." : mode === "cadastro" ? "Criando conta..." : "Enviando...")
                : (mode === "login" ? "Entrar" : mode === "cadastro" ? "Criar conta" : "Enviar link")}
            </button>
          </div>
        </form>

        <p className="auth-link">
          {mode === "login" ? (
            <>Ainda não tem conta?{" "}
              <button
                onClick={() => { setMode("cadastro"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--w)", cursor: "pointer", borderBottom: "1px solid var(--g6)", padding: 0, font: "inherit" }}
              >
                Criar conta
              </button>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--w)", cursor: "pointer", borderBottom: "1px solid var(--g6)", padding: 0, font: "inherit" }}
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
