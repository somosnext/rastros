"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { exameItems } from "@/lib/data/exame";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ExameContent() {
  const [checked, setChecked] = useState<boolean[]>(new Array(exameItems.length).fill(false));
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = exameItems.length;
  const checkedCount = checked.filter(Boolean).length;
  const pct = Math.round((checkedCount / total) * 100);

  // Carregar dados do Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        loadFromDb(data.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadFromDb(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadFromDb(userId: string) {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("exame_respostas")
      .select("item_ids")
      .eq("user_id", userId)
      .eq("data", today)
      .single();

    if (data?.item_ids) {
      const next = new Array(exameItems.length).fill(false);
      (data.item_ids as number[]).forEach((idx) => {
        if (idx >= 0 && idx < next.length) next[idx] = true;
      });
      setChecked(next);
    }
    setLoading(false);
  }

  const saveToDb = useCallback(async (newChecked: boolean[]) => {
    if (!user) return;
    const supabase = createClient();
    const item_ids = newChecked.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    const today = new Date().toISOString().split("T")[0];

    await supabase
      .from("exame_respostas")
      .upsert(
        { user_id: user.id, item_ids, data: today },
        { onConflict: "user_id,data" }
      );
  }, [user]);

  function toggle(index: number) {
    const next = [...checked];
    next[index] = !next[index];
    setChecked(next);

    if (user) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveToDb(next), 500);
    }
  }

  function gerarLista() {
    if (checkedCount === 0) {
      alert("Marque ao menos um item.");
      return;
    }
    setShowResults(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function limpar() {
    const empty = new Array(total).fill(false);
    setChecked(empty);
    setShowResults(false);
    if (user) saveToDb(empty);
  }

  const checkedItems = exameItems.filter((_, i) => checked[i]);
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <>
        <div className="sh">
          <p className="sl">Opus Dei · Preparação para a confissão</p>
          <h2 className="st font-serif">Exame de Consciência</h2>
        </div>
        <div className="skeleton-group">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "80%" }} />
          <div className="skeleton skeleton-bar" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-item" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <p className="sl">Opus Dei · Preparação para a confissão</p>
        <h2 className="st font-serif">Exame de Consciência</h2>
      </div>

      <div className="ei">
        <p className="font-serif">
          A confissão é a oportunidade de pedir perdão a Deus e de receber a sua
          misericórdia. Antes de se confessar, reserve uns momentos de silêncio
          para refletir no que você fez de errado e no que pode fazer para se
          tornar um cristão melhor.
        </p>
      </div>

      <div className="ep">
        <div className="epb">
          <div className="epf" style={{ width: `${pct}%` }} />
        </div>
        <span className="epc">
          {checkedCount} / {total} examinados
        </span>
      </div>

      <div>
        {exameItems.map((item, i) => (
          <div
            key={i}
            className={`eitem${checked[i] ? " checked" : ""}`}
            onClick={() => toggle(i)}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(i); } }}
          >
            <div className="ebox" />
            <span className="etxt">{item}</span>
          </div>
        ))}
      </div>

      <div className="eact">
        <button className="btn-pri" onClick={gerarLista}>
          Gerar lista para a confissão
        </button>
        <button className="btn-sec" onClick={limpar}>
          Limpar seleção
        </button>
      </div>

      <div ref={resultsRef} className={`eres${showResults ? " visible" : ""}`}>
        <p className="er-title font-serif">Para a confissão</p>
        <p className="er-sub">
          {dateStr} · {checkedCount} item(ns)
        </p>
        <ul className="er-list">
          {checkedItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="er-note font-serif">
          Leve este exame ao confessor. A graça do sacramento depende da
          sinceridade e da contrição do coração.
        </p>
        <div style={{ marginTop: 32 }}>
          <button className="btn-pri" onClick={() => window.print()}>
            Baixar PDF
          </button>
        </div>
      </div>
    </>
  );
}
