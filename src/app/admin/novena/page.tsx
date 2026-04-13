"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NovenaDia {
  dia: number;
  titulo: string;
  reflexao: string;
  intencao_a: string;
  intencao_b: string;
  oracao: string;
}

export default function AdminNovenaPage() {
  const [dias, setDias] = useState<NovenaDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NovenaDia | null>(null);

  async function fetchDias() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("novena_dias").select("*").order("dia");
    setDias((data as NovenaDia[]) || []);
    setLoading(false);
  }

  useEffect(() => { fetchDias(); }, []);

  async function saveDia() {
    if (!editing) return;
    const supabase = createClient();
    await supabase.from("novena_dias").upsert(editing);
    setEditing(null);
    fetchDias();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="sl">Conteúdo</p>
          <h2 className="st font-serif">Novena do Trabalho</h2>
        </div>
      </div>

      {editing && (
        <div className="pstep" style={{ marginBottom: 32 }}>
          <div className="psth">
            <span className="pstn">{editing.dia}º Dia</span>
            <h3 className="pstt font-serif">{editing.titulo}</h3>
          </div>
          <div className="pf">
            <label className="pl">Título</label>
            <input className="pin" value={editing.titulo} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })} />
          </div>
          <div className="pf">
            <label className="pl">Reflexão (parágrafos separados por linha)</label>
            <textarea className="pin" rows={6} value={editing.reflexao} onChange={(e) => setEditing({ ...editing, reflexao: e.target.value })} />
          </div>
          <div className="pr">
            <div className="pf">
              <label className="pl">Intenção A (busca trabalho)</label>
              <textarea className="pin" rows={4} value={editing.intencao_a} onChange={(e) => setEditing({ ...editing, intencao_a: e.target.value })} />
            </div>
            <div className="pf">
              <label className="pl">Intenção B (quer fazer melhor)</label>
              <textarea className="pin" rows={4} value={editing.intencao_b} onChange={(e) => setEditing({ ...editing, intencao_b: e.target.value })} />
            </div>
          </div>
          <div className="pf">
            <label className="pl">Oração</label>
            <textarea className="pin" rows={4} value={editing.oracao} onChange={(e) => setEditing({ ...editing, oracao: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-pri" onClick={saveDia}>Salvar</button>
            <button className="btn-sec" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--g5)", fontSize: 13 }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dias.map((d) => (
            <div key={d.dia} className="vcard" onClick={() => setEditing(d)} style={{ cursor: "pointer" }}>
              <p className="vcard-t">{d.dia}º Dia — {d.titulo}</p>
              <p className="vcard-d" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {d.reflexao.substring(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
