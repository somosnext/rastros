"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const FIELDS = [
  "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10",
  "p11","p12","p13","p14","p15","p16","p17","p18","p19","p20",
] as const;

type FieldId = (typeof FIELDS)[number];

function emptyFields(): Record<FieldId, string> {
  const data = {} as Record<FieldId, string>;
  FIELDS.forEach((f) => (data[f] = ""));
  return data;
}

export default function PlanoContent() {
  const [campos, setCampos] = useState<Record<FieldId, string>>(emptyFields);
  const [saveMsg, setSaveMsg] = useState("Seus dados são salvos automaticamente.");
  const [showSummary, setShowSummary] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const summaryRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filled = FIELDS.filter((f) => campos[f].trim().length > 2).length;
  const pct = Math.round((filled / FIELDS.length) * 100);

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
    const { data } = await supabase
      .from("plano_vida")
      .select("campos")
      .eq("user_id", userId)
      .single();

    if (data?.campos) {
      const saved = data.campos as Record<string, string>;
      const merged = emptyFields();
      FIELDS.forEach((f) => {
        if (saved[f]) merged[f] = saved[f];
      });
      setCampos(merged);
    }
    setLoading(false);
  }

  const saveToDb = useCallback(async (newCampos: Record<FieldId, string>) => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("plano_vida")
      .upsert(
        { user_id: user.id, campos: newCampos, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    const t = new Date();
    setSaveMsg(`Salvo às ${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}.`);
  }, [user]);

  function update(field: FieldId, value: string) {
    setCampos((prev) => {
      const next = { ...prev, [field]: value };

      if (user) {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveToDb(next), 800);
      }

      return next;
    });
  }

  function val(field: FieldId) {
    return campos[field].trim() || "\u2014";
  }

  function gerarResumo() {
    setShowSummary(true);
    setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function limpar() {
    if (!confirm("Limpar todo o plano?")) return;
    const empty = emptyFields();
    setCampos(empty);
    setShowSummary(false);
    if (user) saveToDb(empty);
  }

  const now = new Date();

  if (loading) {
    return (
      <>
        <div className="sh">
          <p className="sl">São Josemaria Escrivá · O Caminho</p>
          <h2 className="st font-serif">Plano de Vida</h2>
        </div>
        <div className="skeleton-group">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
          <div className="skeleton skeleton-bar" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-block" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <p className="sl">São Josemaria Escrivá · O Caminho</p>
        <h2 className="st font-serif">Plano de Vida</h2>
      </div>

      <div className="pi2">
        <p className="font-serif">
          &ldquo;Põe-te diante de Deus e pensa naquilo que te move, naquilo que queres, naquilo que te falta.&rdquo;
        </p>
        <p className="font-serif">
          Este plano é uma ferramenta pessoal para organizar sua vida espiritual, virtudes, vida pessoal e trabalho. Preencha com calma e sinceridade.
        </p>
      </div>

      <div className="ppl">
        <span>Progresso do plano</span>
        <span>{pct}%</span>
      </div>
      <div className="ppb">
        <div className="ppf" style={{ width: `${pct}%` }} />
      </div>

      <div className="psteps">
        {/* Etapa 01 */}
        <div className="pstep">
          <div className="psth">
            <span className="pstn">Etapa 01</span>
            <h3 className="pstt font-serif">Objetivo principal do ano</h3>
          </div>
          <div className="pf">
            <label className="pl">Principal objetivo espiritual deste ano</label>
            <textarea className="pin" rows={4} placeholder="Escreva com clareza e especificidade." value={campos.p1} onChange={(e) => update("p1", e.target.value)} />
          </div>
          <div className="pf">
            <label className="pl">O que preciso mudar de forma concreta</label>
            <textarea className="pin" rows={4} placeholder="Identifique hábitos, atitudes ou situações concretas." value={campos.p2} onChange={(e) => update("p2", e.target.value)} />
          </div>
        </div>

        {/* Etapa 02 */}
        <div className="pstep">
          <div className="psth">
            <span className="pstn">Etapa 02</span>
            <h3 className="pstt font-serif">Vida espiritual</h3>
          </div>
          <div className="pr">
            <div className="pf"><label className="pl">Oração diária</label><input type="text" className="pin" placeholder="Ex: 20 minutos pela manhã" value={campos.p3} onChange={(e) => update("p3", e.target.value)} /></div>
            <div className="pf"><label className="pl">Confissão</label><input type="text" className="pin" placeholder="Ex: Mensalmente" value={campos.p4} onChange={(e) => update("p4", e.target.value)} /></div>
            <div className="pf"><label className="pl">Santa Missa</label><input type="text" className="pin" placeholder="Ex: Domingos + uma vez na semana" value={campos.p5} onChange={(e) => update("p5", e.target.value)} /></div>
            <div className="pf"><label className="pl">Leitura espiritual</label><input type="text" className="pin" placeholder="Ex: 15 minutos ao dia" value={campos.p6} onChange={(e) => update("p6", e.target.value)} /></div>
            <div className="pf"><label className="pl">Exame de consciência</label><input type="text" className="pin" placeholder="Ex: Todo dia antes de dormir" value={campos.p7} onChange={(e) => update("p7", e.target.value)} /></div>
            <div className="pf"><label className="pl">Outra prática</label><input type="text" className="pin" placeholder="Ex: Terço, Via Sacra..." value={campos.p8} onChange={(e) => update("p8", e.target.value)} /></div>
          </div>
        </div>

        {/* Etapa 03 */}
        <div className="pstep">
          <div className="psth">
            <span className="pstn">Etapa 03</span>
            <h3 className="pstt font-serif">Virtudes que quero trabalhar</h3>
          </div>
          <div className="pr">
            <div className="vc2">
              <label className="pl">1a Virtude</label>
              <input type="text" className="pin" placeholder="Ex: Humildade" style={{ marginBottom: 12 }} value={campos.p9} onChange={(e) => update("p9", e.target.value)} />
              <label className="pl">Como praticar</label>
              <textarea className="pin" rows={3} placeholder="Ações específicas..." value={campos.p10} onChange={(e) => update("p10", e.target.value)} />
            </div>
            <div className="vc2">
              <label className="pl">2a Virtude</label>
              <input type="text" className="pin" placeholder="Ex: Mortificação" style={{ marginBottom: 12 }} value={campos.p11} onChange={(e) => update("p11", e.target.value)} />
              <label className="pl">Como praticar</label>
              <textarea className="pin" rows={3} placeholder="Ações específicas..." value={campos.p12} onChange={(e) => update("p12", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Etapa 04 */}
        <div className="pstep">
          <div className="psth">
            <span className="pstn">Etapa 04</span>
            <h3 className="pstt font-serif">Vida pessoal</h3>
          </div>
          <div className="pf"><label className="pl">Família</label><textarea className="pin" rows={3} placeholder="Presença, gestos concretos de caridade..." value={campos.p13} onChange={(e) => update("p13", e.target.value)} /></div>
          <div className="pf"><label className="pl">Disciplina pessoal</label><textarea className="pin" rows={3} placeholder="Horários, hábitos, vontade..." value={campos.p14} onChange={(e) => update("p14", e.target.value)} /></div>
          <div className="pr">
            <div className="pf"><label className="pl">Organização da rotina</label><textarea className="pin" rows={3} placeholder="Como estruturo meu dia?" value={campos.p15} onChange={(e) => update("p15", e.target.value)} /></div>
            <div className="pf"><label className="pl">Uso do tempo</label><textarea className="pin" rows={3} placeholder="Redes sociais, distrações..." value={campos.p16} onChange={(e) => update("p16", e.target.value)} /></div>
          </div>
          <div className="pf"><label className="pl">Pontos que preciso melhorar</label><textarea className="pin" rows={3} placeholder="Seja honesto." value={campos.p17} onChange={(e) => update("p17", e.target.value)} /></div>
        </div>

        {/* Etapa 05 */}
        <div className="pstep">
          <div className="psth">
            <span className="pstn">Etapa 05</span>
            <h3 className="pstt font-serif">Trabalho e estudos</h3>
          </div>
          <div className="pf"><label className="pl">Meta profissional para o ano</label><textarea className="pin" rows={3} placeholder="Concreta, mensurável, com prazo." value={campos.p18} onChange={(e) => update("p18", e.target.value)} /></div>
          <div className="pr">
            <div className="pf"><label className="pl">Hábito a melhorar</label><textarea className="pin" rows={3} placeholder="Pontualidade, foco, qualidade..." value={campos.p19} onChange={(e) => update("p19", e.target.value)} /></div>
            <div className="pf"><label className="pl">O que farei de diferente</label><textarea className="pin" rows={3} placeholder="Uma decisão concreta agora." value={campos.p20} onChange={(e) => update("p20", e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="pact">
        <button className="btn-pri" onClick={gerarResumo}>Gerar resumo</button>
        {showSummary && (
          <button className="btn-pri" onClick={() => window.print()}>
            Baixar PDF
          </button>
        )}
        <button className="btn-sec" onClick={limpar}>Limpar tudo</button>
      </div>
      <p className="psn">{saveMsg}</p>

      <div ref={summaryRef} className={`prsum${showSummary ? " visible" : ""}`}>
        <div className="prh">
          <h3 className="font-serif">Meu Plano de Vida</h3>
          <p>Ano {now.getFullYear()} · {now.toLocaleDateString("pt-BR")}</p>
        </div>
        <div className="prb">
          {[
            { t: "Objetivo do ano", ids: [["p1", "Objetivo espiritual"], ["p2", "O que preciso mudar"]] as const },
            { t: "Vida espiritual", ids: [["p3", "Oração"], ["p4", "Confissão"], ["p5", "Missa"], ["p6", "Leitura"], ["p7", "Exame"], ["p8", "Outra prática"]] as const },
            { t: "Virtudes", ids: [["p9", "1a Virtude"], ["p10", "Como praticar"], ["p11", "2a Virtude"], ["p12", "Como praticar"]] as const },
            { t: "Vida pessoal", ids: [["p13", "Família"], ["p14", "Disciplina"], ["p15", "Rotina"], ["p16", "Tempo"], ["p17", "Melhorar"]] as const },
            { t: "Trabalho", ids: [["p18", "Meta"], ["p19", "Hábito"], ["p20", "Diferente"]] as const },
          ].map((sec) => (
            <div className="prs" key={sec.t}>
              <p className="prst">{sec.t}</p>
              {sec.ids.map(([id, label]) => (
                <div className="pri-item" key={id}>
                  <p className="pril">{label}</p>
                  <p className="priv">{val(id)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
