"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ExameItem {
  id: number;
  texto: string;
  ordem: number;
  ativo: boolean;
}

export default function AdminExamePage() {
  const [items, setItems] = useState<ExameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ExameItem> | null>(null);

  async function fetchItems() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("exame_items").select("*").order("ordem");
    setItems((data as ExameItem[]) || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function saveItem() {
    if (!editing) return;
    const supabase = createClient();
    if (editing.id) {
      await supabase.from("exame_items").update({ texto: editing.texto, ordem: editing.ordem, ativo: editing.ativo }).eq("id", editing.id);
    } else {
      await supabase.from("exame_items").insert({ texto: editing.texto, ordem: editing.ordem || 0, ativo: editing.ativo ?? true });
    }
    setEditing(null);
    fetchItems();
  }

  async function deleteItem(id: number) {
    if (!confirm("Excluir este item?")) return;
    const supabase = createClient();
    await supabase.from("exame_items").delete().eq("id", id);
    fetchItems();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="sl">Conteúdo</p>
          <h2 className="st font-serif">Exame de Consciência</h2>
        </div>
        <button className="btn-pri" onClick={() => setEditing({ texto: "", ordem: items.length, ativo: true })}>
          Adicionar item
        </button>
      </div>

      {editing && (
        <div className="pstep" style={{ marginBottom: 32 }}>
          <div className="pf">
            <label className="pl">Texto do item</label>
            <textarea className="pin" rows={4} value={editing.texto || ""} onChange={(e) => setEditing({ ...editing, texto: e.target.value })} />
          </div>
          <div className="pr" style={{ marginTop: 16 }}>
            <div className="pf">
              <label className="pl">Ordem</label>
              <input className="pin" type="number" value={editing.ordem ?? 0} onChange={(e) => setEditing({ ...editing, ordem: parseInt(e.target.value) })} />
            </div>
            <div className="pf">
              <label className="pl">Ativo</label>
              <select className="pin" value={editing.ativo ? "sim" : "nao"} onChange={(e) => setEditing({ ...editing, ativo: e.target.value === "sim" })}>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-pri" onClick={saveItem}>Salvar</button>
            <button className="btn-sec" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--g5)", fontSize: 13 }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item.id} className="vcard" style={{ opacity: item.ativo ? 1 : 0.5 }}>
              <p className="vcard-t" style={{ fontSize: 14 }}>{item.texto}</p>
              <p className="vcard-d">Ordem: {item.ordem} · {item.ativo ? "Ativo" : "Inativo"}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button className="btn-sec" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => setEditing(item)}>Editar</button>
                <button className="btn-sec" style={{ padding: "6px 12px", fontSize: 9, borderColor: "rgba(239,68,68,.3)", color: "#f87171" }} onClick={() => deleteItem(item.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
