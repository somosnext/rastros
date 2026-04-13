"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  nome: string;
  email: string;
}

interface Vaga {
  id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  contato: string;
  status: string;
  created_at: string;
}

export default function AdminVagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [filter, setFilter] = useState("pendente");
  const [loading, setLoading] = useState(true);

  async function fetchVagas() {
    setLoading(true);
    const supabase = createClient();
    const query = supabase
      .from("vagas")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "todos") {
      query.eq("status", filter);
    }

    const { data } = await query;
    const vagasList = (data as Vaga[]) || [];
    setVagas(vagasList);

    // Buscar profiles dos autores
    const userIds = [...new Set(vagasList.map((v) => v.user_id))];
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .in("id", userIds);

      const map: Record<string, Profile> = {};
      (profilesData || []).forEach((p: { id: string; nome: string; email: string }) => {
        map[p.id] = { nome: p.nome, email: p.email };
      });
      setProfiles(map);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchVagas();
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("vagas").update({ status }).eq("id", id);
    fetchVagas();
  }

  async function deleteVaga(id: string) {
    if (!confirm("Excluir esta vaga permanentemente?")) return;
    const supabase = createClient();
    await supabase.from("vagas").delete().eq("id", id);
    fetchVagas();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="sl">Moderação</p>
          <h2 className="st font-serif">Vagas</h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {["pendente", "aprovado", "rejeitado", "todos"].map((f) => (
          <button
            key={f}
            className={filter === f ? "btn-pri" : "btn-sec"}
            onClick={() => setFilter(f)}
            style={{ padding: "10px 20px" }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--g5)", fontSize: 13 }}>Carregando...</p>
      ) : vagas.length === 0 ? (
        <p style={{ color: "var(--g5)", fontSize: 13, fontStyle: "italic" }}>
          Nenhuma vaga encontrada.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map((v) => (
              <tr key={v.id}>
                <td>{v.tipo === "empregador" ? "Vaga" : "Busca"}</td>
                <td>
                  <strong style={{ color: "var(--w)" }}>{v.titulo}</strong>
                  {v.subtitulo && (
                    <span style={{ color: "var(--g5)", marginLeft: 8, fontSize: 12 }}>
                      {v.subtitulo}
                    </span>
                  )}
                  {v.descricao && (
                    <p style={{ color: "var(--g5)", fontSize: 12, marginTop: 4 }}>
                      {v.descricao}
                    </p>
                  )}
                </td>
                <td>
                  <span style={{ color: "var(--w)" }}>
                    {profiles[v.user_id]?.nome || "—"}
                  </span>
                  {profiles[v.user_id]?.email && (
                    <p style={{ color: "var(--g5)", fontSize: 11, marginTop: 2 }}>
                      {profiles[v.user_id].email}
                    </p>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${v.status === "aprovado" ? "approved" : v.status === "rejeitado" ? "rejected" : "pending"}`}>
                    {v.status}
                  </span>
                </td>
                <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                  {new Date(v.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {v.status !== "aprovado" && (
                      <button
                        className="btn-pri"
                        style={{ padding: "6px 12px", fontSize: 9 }}
                        onClick={() => updateStatus(v.id, "aprovado")}
                      >
                        Aprovar
                      </button>
                    )}
                    {v.status !== "rejeitado" && (
                      <button
                        className="btn-sec"
                        style={{ padding: "6px 12px", fontSize: 9 }}
                        onClick={() => updateStatus(v.id, "rejeitado")}
                      >
                        Rejeitar
                      </button>
                    )}
                    <button
                      className="btn-sec"
                      style={{ padding: "6px 12px", fontSize: 9, borderColor: "rgba(239,68,68,.3)", color: "#f87171" }}
                      onClick={() => deleteVaga(v.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
