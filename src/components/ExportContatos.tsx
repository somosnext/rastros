"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Escapa um campo para CSV (aspas quando há vírgula, aspas ou quebra de linha).
function csvEscape(value: string) {
  const v = value ?? "";
  if (/[",\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export default function ExportContatos() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [count, setCount] = useState<number | null>(null);

  async function baixar() {
    setLoading(true);
    setErro("");
    setCount(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("email, nome")
      .not("email", "is", null)
      .order("nome")
      .limit(10000);

    if (error) {
      setErro("Não foi possível carregar os contatos: " + error.message);
      setLoading(false);
      return;
    }

    const rows = (data || []).filter((p) => p.email);
    const linhas = [["email", "first_name", "last_name", "unsubscribed"].join(",")];
    for (const p of rows) {
      linhas.push(
        [csvEscape(p.email), csvEscape(p.nome || ""), "", "false"].join(",")
      );
    }

    const csv = linhas.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const hoje = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contatos-${hoje}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setCount(rows.length);
    setLoading(false);
  }

  return (
    <div className="pstep">
      <div className="psth">
        <span className="pstn">Resend</span>
        <h3 className="pstt font-serif">Exportar Contatos</h3>
      </div>
      <p style={{ color: "var(--g4)", fontSize: 13, marginBottom: 20 }}>
        Baixar a lista de contatos cadastrados (nome e e-mail) em CSV, já no formato
        pronto para importar no Resend.
      </p>
      <button className="btn-pri" onClick={baixar} disabled={loading}>
        {loading ? "Gerando..." : "Baixar planilha (.csv)"}
      </button>
      {count !== null && !erro && (
        <p style={{ color: "var(--g5)", fontSize: 12, marginTop: 12 }}>
          {count} contato{count === 1 ? "" : "s"} exportado{count === 1 ? "" : "s"}.
        </p>
      )}
      {erro && (
        <p style={{ color: "#f87171", fontSize: 12, marginTop: 12 }}>{erro}</p>
      )}
    </div>
  );
}
