"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Video {
  id: number;
  titulo: string;
  subtitulo: string;
  youtube_id: string;
  url: string;
  categoria: string;
  ordem: number;
  ativo: boolean;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Video> | null>(null);

  async function fetchVideos() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("categoria")
      .order("ordem");
    setVideos((data as Video[]) || []);
    setLoading(false);
  }

  useEffect(() => { fetchVideos(); }, []);

  async function saveVideo() {
    if (!editing) return;
    const supabase = createClient();
    const { titulo, subtitulo, youtube_id, categoria, ordem, ativo } = editing;
    const url = `https://www.youtube.com/watch?v=${youtube_id}`;

    if (editing.id) {
      await supabase.from("videos").update({ titulo, subtitulo, youtube_id, url, categoria, ordem, ativo }).eq("id", editing.id);
    } else {
      await supabase.from("videos").insert({ titulo, subtitulo, youtube_id, url, categoria, ordem: ordem || 0, ativo: ativo ?? true });
    }
    setEditing(null);
    fetchVideos();
  }

  async function deleteVideo(id: number) {
    if (!confirm("Excluir este vídeo?")) return;
    const supabase = createClient();
    await supabase.from("videos").delete().eq("id", id);
    fetchVideos();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="sl">Conteúdo</p>
          <h2 className="st font-serif">Vídeos</h2>
        </div>
        <button className="btn-pri" onClick={() => setEditing({ titulo: "", subtitulo: "", youtube_id: "", categoria: "encontros", ordem: 0, ativo: true })}>
          Adicionar vídeo
        </button>
      </div>

      {editing && (
        <div className="pstep" style={{ marginBottom: 32 }}>
          <div className="psth">
            <span className="pstn">{editing.id ? "Editar" : "Novo"}</span>
            <h3 className="pstt font-serif">Vídeo</h3>
          </div>
          <div className="pr">
            <div className="pf">
              <label className="pl">Título</label>
              <input className="pin" value={editing.titulo || ""} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })} />
            </div>
            <div className="pf">
              <label className="pl">Subtítulo</label>
              <input className="pin" value={editing.subtitulo || ""} onChange={(e) => setEditing({ ...editing, subtitulo: e.target.value })} />
            </div>
            <div className="pf">
              <label className="pl">YouTube ID</label>
              <input className="pin" value={editing.youtube_id || ""} onChange={(e) => setEditing({ ...editing, youtube_id: e.target.value })} />
            </div>
            <div className="pf">
              <label className="pl">Categoria</label>
              <select className="pin" value={editing.categoria || "encontros"} onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}>
                <option value="encontros">Encontros</option>
                <option value="ensinamentos">Ensinamentos</option>
                <option value="terceiros">Terceiros</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-pri" onClick={saveVideo}>Salvar</button>
            <button className="btn-sec" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--g5)", fontSize: 13 }}>Carregando...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>YouTube ID</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td>
                  <strong style={{ color: "var(--w)" }}>{v.titulo}</strong>
                  <span style={{ color: "var(--g5)", marginLeft: 8, fontSize: 12 }}>{v.subtitulo}</span>
                </td>
                <td>{v.categoria}</td>
                <td style={{ fontSize: 11 }}>{v.youtube_id}</td>
                <td>{v.ativo ? "Sim" : "Não"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sec" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => setEditing(v)}>Editar</button>
                    <button className="btn-sec" style={{ padding: "6px 12px", fontSize: 9, borderColor: "rgba(239,68,68,.3)", color: "#f87171" }} onClick={() => deleteVideo(v.id)}>Excluir</button>
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
