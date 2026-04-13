"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CandidaturaModal from "./CandidaturaModal";
import type { User } from "@supabase/supabase-js";

interface Vaga {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  contato: string;
  status: string;
  user_id: string;
  created_at: string;
}

export default function VagasContent() {
  const [vagasAprovadas, setVagasAprovadas] = useState<Vaga[]>([]);
  const [minhasVagas, setMinhasVagas] = useState<Vaga[]>([]);
  const [candidatura, setCandidatura] = useState<Vaga | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      fetchVagas(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchVagas(currentUser: User | null) {
    const supabase = createClient();

    // Buscar vagas aprovadas (visíveis para todos)
    const { data: aprovadas } = await supabase
      .from("vagas")
      .select("*")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false });

    setVagasAprovadas((aprovadas as Vaga[]) || []);

    // Buscar vagas do próprio usuário (pendentes/rejeitadas)
    if (currentUser) {
      const { data: minhas } = await supabase
        .from("vagas")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      setMinhasVagas((minhas as Vaga[]) || []);
    }

    setLoading(false);
  }

  async function addVaga() {
    if (!titulo.trim()) { alert("Preencha ao menos o cargo ou função."); return; }
    if (!contato.trim()) { alert("Preencha o e-mail para receber candidaturas."); return; }
    if (!user) return;

    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("vagas").insert({
      titulo: titulo.trim(),
      subtitulo: empresa.trim(),
      descricao: descricao.trim(),
      contato: contato.trim(),
      tipo: "empregador",
      status: "pendente",
      user_id: user.id,
    });

    if (error) {
      alert("Erro ao enviar vaga. Tente novamente.");
      setSubmitting(false);
      return;
    }

    setTitulo("");
    setEmpresa("");
    setDescricao("");
    setContato("");
    setSubmitting(false);
    setSubmitted(true);
    fetchVagas(user);
  }

  async function deleteMinhaVaga(id: string) {
    if (!confirm("Deseja remover esta vaga?")) return;
    const supabase = createClient();
    await supabase.from("vagas").delete().eq("id", id).eq("user_id", user!.id);
    fetchVagas(user);
  }

  const statusLabel: Record<string, string> = {
    pendente: "Em análise",
    aprovado: "Aprovada",
    rejeitado: "Rejeitada",
  };

  const statusColor: Record<string, string> = {
    pendente: "var(--g4)",
    aprovado: "#4ade80",
    rejeitado: "#f87171",
  };

  return (
    <>
      <div className="sh">
        <p className="sl">Comunidade</p>
        <h2 className="st font-serif">Vagas</h2>
      </div>

      {/* Formulário para publicar vaga */}
      {submitted ? (
        <div style={{ maxWidth: 520, marginBottom: 48 }}>
          <div className="vcol">
            <div className="vcolh" style={{ textAlign: "center", padding: "32px 0" }}>
              <h3 className="vcolt font-serif" style={{ marginBottom: 12 }}>Vaga enviada para análise</h3>
              <p className="vcold" style={{ marginBottom: 24 }}>
                Sua vaga será revisada pela nossa equipe antes de ser publicada.
                Esse processo pode levar algum tempo. Obrigado pela paciência!
              </p>
              <button className="btn-pri" onClick={() => setSubmitted(false)}>
                Publicar outra vaga
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 520, marginBottom: 48 }}>
          <div className="vcol">
            <div className="vcolh">
              <h3 className="vcolt font-serif">Publicar uma vaga</h3>
              <p className="vcold">Publique uma oportunidade para a comunidade. A vaga será revisada antes de aparecer para todos.</p>
            </div>
            <div className="vform">
              <input className="vinput" type="text" placeholder="Cargo ou função" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <input className="vinput" type="text" placeholder="Empresa ou área (opcional)" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              <textarea className="vinput" rows={2} placeholder="Breve descrição da vaga..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              <input className="vinput" type="email" placeholder="E-mail para candidaturas" value={contato} onChange={(e) => setContato(e.target.value)} />
              <button className="btn-pri" onClick={addVaga} disabled={submitting}>
                {submitting ? "Enviando..." : "Publicar vaga"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minhas vagas (só aparece se o usuário tiver vagas) */}
      {user && minhasVagas.length > 0 && (
        <>
          <div className="sh">
            <p className="sl">Suas publicações</p>
            <h2 className="st font-serif">Minhas Vagas</h2>
          </div>
          <div className="vlist" style={{ maxHeight: "none", marginBottom: 48 }}>
            {minhasVagas.map((v) => (
              <div className="vcard" key={v.id} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p className="vcard-t" style={{ fontSize: 15, marginBottom: 6 }}>{v.titulo}</p>
                    {v.subtitulo && <p className="vcard-d" style={{ color: "var(--g3)" }}>{v.subtitulo}</p>}
                    {v.descricao && <p className="vcard-d">{v.descricao}</p>}
                  </div>
                  <span style={{ fontSize: 11, color: statusColor[v.status] || "var(--g5)", whiteSpace: "nowrap", marginLeft: 12 }}>
                    {statusLabel[v.status] || v.status}
                  </span>
                </div>
                {v.status === "pendente" && (
                  <div style={{ marginTop: 12 }}>
                    <button className="vcard-x" onClick={() => deleteMinhaVaga(v.id)} style={{ position: "static", padding: "10px 12px" }}>&#10005;</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vagas aprovadas (visíveis para todos) */}
      {!loading && vagasAprovadas.length > 0 && (
        <div className="sh">
          <p className="sl">Oportunidades disponíveis</p>
          <h2 className="st font-serif">Vagas Abertas</h2>
        </div>
      )}

      <div className="vlist" style={{ maxHeight: "none" }}>
        {loading ? (
          <p style={{ color: "var(--g5)", fontSize: 13 }}>Carregando...</p>
        ) : vagasAprovadas.length > 0 ? (
          vagasAprovadas.map((v) => (
            <div className="vcard" key={v.id} style={{ marginBottom: 8 }}>
              <p className="vcard-t" style={{ fontSize: 15, marginBottom: 6 }}>{v.titulo}</p>
              {v.subtitulo && <p className="vcard-d" style={{ color: "var(--g3)" }}>{v.subtitulo}</p>}
              {v.descricao && <p className="vcard-d">{v.descricao}</p>}
              {/* Não mostra botão de candidatura na própria vaga do usuário */}
              {(!user || v.user_id !== user.id) && (
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn-pri"
                    style={{ padding: "10px 20px" }}
                    onClick={() => setCandidatura(v)}
                  >
                    Candidatar-se
                  </button>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>

      {candidatura && (
        <CandidaturaModal
          tituloVaga={candidatura.titulo}
          empresaVaga={candidatura.subtitulo}
          emailEmpregador={candidatura.contato}
          onClose={() => setCandidatura(null)}
        />
      )}
    </>
  );
}
