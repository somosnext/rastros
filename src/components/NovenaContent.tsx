"use client";

import { useState, useEffect, useCallback } from "react";
import { novenaDias } from "@/lib/data/novena";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function NovenaContent() {
  const [diaAtual, setDiaAtual] = useState(1);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [intencoes, setIntencoes] = useState<Record<number, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  const completouNovena = feitos.length === 9;

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
      .from("novena_progresso")
      .select("dia_atual, dias_feitos, intencoes")
      .eq("user_id", userId)
      .single();

    if (data) {
      setDiaAtual(data.dia_atual || 1);
      setFeitos((data.dias_feitos as number[]) || []);
      setIntencoes((data.intencoes as Record<number, string>) || {});
    }
    setLoading(false);
  }

  const saveToDb = useCallback(async (
    newDia: number,
    newFeitos: number[],
    newIntencoes: Record<number, string>
  ) => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("novena_progresso")
      .upsert(
        {
          user_id: user.id,
          dia_atual: newDia,
          dias_feitos: newFeitos,
          intencoes: newIntencoes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
  }, [user]);

  function setDia(n: number) {
    if (n < 1 || n > 9) return;
    setDiaAtual(n);
    if (user) saveToDb(n, feitos, intencoes);
  }

  function setIntencao(dia: number, letra: string) {
    const next = { ...intencoes, [dia]: letra };
    setIntencoes(next);
    if (user) saveToDb(diaAtual, feitos, next);
  }

  function marcarDia(n: number) {
    const newFeitos = feitos.includes(n) ? feitos : [...feitos, n];
    setFeitos(newFeitos);

    if (n >= 9) {
      setShowCompletion(true);
      if (user) saveToDb(diaAtual, newFeitos, intencoes);
    } else {
      const nextDia = n + 1;
      setDiaAtual(nextDia);
      if (user) saveToDb(nextDia, newFeitos, intencoes);
    }
  }

  function recomecar() {
    setDiaAtual(1);
    setFeitos([]);
    setShowCompletion(false);
    if (user) saveToDb(1, [], intencoes);
  }

  if (loading) {
    return (
      <>
        <div className="sh">
          <p className="sl">Padre Faus · São Josemaria Escrivá</p>
          <h2 className="st font-serif">Novena do Trabalho</h2>
        </div>
        <div className="skeleton-group">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "70%" }} />
          <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ width: 44, height: 40 }} />
            ))}
          </div>
          <div className="skeleton skeleton-block" style={{ marginTop: 24 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <p className="sl">Padre Faus · São Josemaria Escrivá</p>
        <h2 className="st font-serif">Novena do Trabalho</h2>
      </div>

      <div className="nav2">
        <p>
          <strong>Para empresários:</strong> Se você tem uma vaga em aberto e quer
          ajudar alguém que está fazendo esta novena, publique sua oportunidade na
          área de Vagas.
        </p>
        <p>
          <strong>Para quem busca trabalho:</strong> Escreva a vaga que você está
          buscando conquistar como uma intenção concreta — e continue rezando.
        </p>
      </div>

      <div className="nnav">
        {novenaDias.map((d) => {
          let cls = "dia-btn";
          if (d.dia === diaAtual) cls += " active";
          else if (feitos.includes(d.dia)) cls += " done";
          return (
            <button key={d.dia} className={cls} onClick={() => setDia(d.dia)}>
              {d.dia}o
            </button>
          );
        })}
      </div>

      {novenaDias.map((d) => {
        const isActive = d.dia === diaAtual;
        const int = intencoes[d.dia] || "A";

        return (
          <div key={d.dia} className={`ndia${isActive ? " active" : ""}`}>
            <div className="ndh">
              <p className="ndnum">{d.dia}o Dia</p>
              <h3 className="ndtitle font-serif">{d.titulo}</h3>
            </div>

            <div className="nref">
              <p className="nref-lbl">Reflexão · São Josemaria Escrivá</p>
              {d.reflexao.map((p, i) => (
                <p key={i} className="font-serif">{p}</p>
              ))}
            </div>

            <p className="int-lbl">Escolha sua intenção</p>
            <div className="int-toggle">
              <button
                className={`int-btn${int === "A" ? " active" : ""}`}
                onClick={() => setIntencao(d.dia, "A")}
              >
                A · Busco um trabalho
              </button>
              <button
                className={`int-btn${int === "B" ? " active" : ""}`}
                onClick={() => setIntencao(d.dia, "B")}
              >
                B · Quero fazer melhor
              </button>
            </div>

            <div className={`nint${int === "A" ? " active" : ""}`}>
              <p>{d.intencaoA}</p>
            </div>
            <div className={`nint${int === "B" ? " active" : ""}`}>
              <p>{d.intencaoB}</p>
            </div>

            <div className="norac">
              <p className="norac-lbl">Oração a São Josemaria</p>
              <p>{d.oracao}</p>
              <p className="orac-final">
                Pai Nosso &nbsp;&middot;&nbsp; Ave-Maria &nbsp;&middot;&nbsp; Glória
              </p>
            </div>

            <div className="nact">
              <button className="btn-pri" onClick={() => marcarDia(d.dia)}>
                Marcar como rezado
              </button>
              {d.dia < 9 ? (
                <button className="btn-sec" onClick={() => setDia(d.dia + 1)}>
                  Próximo dia &rarr;
                </button>
              ) : (
                <button className="btn-sec" onClick={recomecar}>
                  Recomeçar
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Mensagem de conclusão */}
      {(showCompletion || completouNovena) && (
        <div style={{ marginTop: 64 }}>
          <div className="nref" style={{ borderLeft: "3px solid var(--w)" }}>
            <p className="nref-lbl">Novena Concluída</p>
            <p className="font-serif">
              Parabéns! Você completou a Novena do Trabalho. São Josemaria, intercede por nós!
            </p>
            <p className="font-serif" style={{ marginTop: 12 }}>
              Continue confiando na providência de Deus. Que o trabalho que você busca ou realiza seja sempre um caminho de santificação.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
