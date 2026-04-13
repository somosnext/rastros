"use client";

import { useState, useRef, useEffect } from "react";

interface CandidaturaModalProps {
  tituloVaga: string;
  empresaVaga: string;
  emailEmpregador: string;
  onClose: () => void;
}

export default function CandidaturaModal({
  tituloVaga,
  empresaVaga,
  emailEmpregador,
  onClose,
}: CandidaturaModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
    setSending(true);

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("mensagem", mensagem);
    formData.append("emailEmpregador", emailEmpregador);
    formData.append("tituloVaga", tituloVaga);
    formData.append("empresaVaga", empresaVaga);

    const file = fileRef.current?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("O arquivo deve ter no máximo 5MB.");
        setSending(false);
        return;
      }
      formData.append("curriculo", file);
    }

    try {
      const res = await fetch("/api/candidatura", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao enviar candidatura.");
        setSending(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p className="er-title font-serif" style={{ marginBottom: 12 }}>Candidatura enviada</p>
            <p style={{ color: "var(--g4)", fontSize: 13, marginBottom: 24 }}>
              O empregador receberá seu email com o currículo em anexo. Boa sorte!
            </p>
            <button className="btn-pri" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p className="ndnum">Candidatura</p>
            <p className="ndtitle font-serif" style={{ fontSize: 24 }}>{tituloVaga}</p>
            {empresaVaga && <p style={{ color: "var(--g4)", fontSize: 12, marginTop: 4 }}>{empresaVaga}</p>}
          </div>
          <button className="vcard-x" onClick={onClose} style={{ position: "static", fontSize: 18 }}>&#10005;</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Seu nome</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Seu e-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Mensagem (opcional)</label>
            <textarea
              className="pin"
              rows={4}
              placeholder="Apresente-se brevemente, fale da sua experiência..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Currículo (PDF, máx. 5MB)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{
                width: "100%",
                background: "var(--g8)",
                border: "1px solid var(--g7)",
                color: "var(--g3)",
                fontSize: 13,
                padding: "12px 14px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-pri" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar candidatura"}
            </button>
            <button className="btn-sec" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
