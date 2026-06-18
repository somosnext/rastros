"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { novenaDias, novenaInicio, novenaFesta } from "@/lib/data/novena";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const SITE_URL = "https://www.deixerastros.com.br/";

function startDate() {
  return new Date(`${novenaInicio}T00:00:00`);
}

// Dia padrão de acordo com a data de hoje dentro do período da novena (1 a 9).
function getDefaultDay() {
  const start = startDate();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const first = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diff = Math.floor((today.getTime() - first.getTime()) / 86400000);
  return Math.min(Math.max(diff + 1, 1), 9);
}

function dateForDay(day: number) {
  const d = startDate();
  d.setDate(d.getDate() + day - 1);
  return d;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}

function toCalendarDate(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const inicioLabel = shortDate(novenaInicio);
const festaLabel = shortDate(novenaFesta);

export default function NovenaContent() {
  const [diaAtual, setDiaAtual] = useState(1);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [intencoes, setIntencoes] = useState<Record<number, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completouNovena = feitos.length === 9;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        loadFromDb(data.user.id);
      } else {
        setDiaAtual(getDefaultDay());
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
      setDiaAtual(data.dia_atual || getDefaultDay());
      setFeitos((data.dias_feitos as number[]) || []);
      setIntencoes((data.intencoes as Record<number, string>) || {});
    } else {
      setDiaAtual(getDefaultDay());
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

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }, []);

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
    const newFeitos = feitos.includes(n) ? feitos : [...feitos, n].sort((a, b) => a - b);
    setFeitos(newFeitos);

    if (newFeitos.length === 9) {
      setShowCompletion(true);
      if (user) saveToDb(diaAtual, newFeitos, intencoes);
      showToast("Você concluiu a novena. São Josemaria, intercede por nós!");
    } else if (n < 9) {
      const nextDia = n + 1;
      setDiaAtual(nextDia);
      if (user) saveToDb(nextDia, newFeitos, intencoes);
      showToast(`Dia ${n} marcado. Amanhã o convite continua aqui.`);
    } else {
      if (user) saveToDb(diaAtual, newFeitos, intencoes);
      showToast(`Dia ${n} marcado.`);
    }
  }

  function recomecar() {
    setDiaAtual(1);
    setFeitos([]);
    setShowCompletion(false);
    if (user) saveToDb(1, [], intencoes);
  }

  function downloadIcs() {
    const start = startDate();
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pontos de Encontro//Novena Sao Josemaria//PT-BR",
      "BEGIN:VEVENT",
      "UID:novena-sao-josemaria-2026@deixerastros.com.br",
      `DTSTAMP:${toCalendarDate(new Date(), reminderTime)}`,
      `DTSTART:${toCalendarDate(start, reminderTime)}`,
      `DTEND:${toCalendarDate(new Date(start.getTime() + 30 * 60000), reminderTime)}`,
      "RRULE:FREQ=DAILY;COUNT=10",
      "SUMMARY:Rezar a Novena de São Josemaria",
      "DESCRIPTION:Voltar ao site Pontos de Encontro para rezar o dia da novena.",
      `URL:${SITE_URL}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "novena-sao-josemaria.ics";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Lembrete criado. O arquivo de calendário foi baixado.");
  }

  function openGoogleCalendar() {
    const start = startDate();
    const details = "Voltar ao site Pontos de Encontro para rezar a Novena de São Josemaria.";
    const dates = `${toCalendarDate(start, reminderTime)}/${toCalendarDate(new Date(start.getTime() + 30 * 60000), reminderTime)}`;
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", "Rezar a Novena de São Josemaria");
    url.searchParams.set("dates", dates);
    url.searchParams.set("recur", "RRULE:FREQ=DAILY;COUNT=10");
    url.searchParams.set("details", details);
    url.searchParams.set("location", SITE_URL);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
    showToast("Abrindo o Google Calendar com o lembrete diário já configurado.");
  }

  async function convidar() {
    const message = `Estou rezando a Novena de São Josemaria até ${festaLabel}. Reze comigo o dia ${diaAtual}: ${SITE_URL}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Novena de São Josemaria", text: message });
      } else {
        await navigator.clipboard.writeText(message);
        showToast("Mensagem copiada para você enviar pelo WhatsApp.");
      }
    } catch {
      /* compartilhamento cancelado pelo usuário */
    }
  }

  if (loading) {
    return (
      <>
        <div className="sh">
          <p className="sl">{inicioLabel} a {festaLabel} · Padre Faus</p>
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

  const data = novenaDias[diaAtual - 1];
  const int = intencoes[diaAtual] || "A";
  const jaRezou = feitos.includes(diaAtual);

  return (
    <>
      <div className="sh">
        <p className="sl">{inicioLabel} a {festaLabel} · Padre Faus</p>
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

      <div className="novena-feature">
        <article className="novena-main">
          <div className="today-strip">
            <div>
              <p className="today-kicker">Rezar hoje</p>
              <p className="today-date">{formatDate(dateForDay(diaAtual))}</p>
            </div>
            <div className="day-number">
              <strong>{diaAtual}</strong>
              <span>dia</span>
            </div>
          </div>

          <h3 className="ndtitle font-serif">{data.titulo}</h3>

          <div className="reflection font-serif">
            {data.reflexao.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <p className="source-note">
            Novena do Trabalho, do Pe. Francisco Faus, com reflexões de São Josemaria
            Escrivá. A intenção A é para quem busca trabalho; a intenção B é para quem
            deseja fazer melhor o próprio trabalho.
          </p>

          <p className="int-lbl">Escolha sua intenção</p>
          <div className="int-toggle">
            <button
              className={`int-btn${int === "A" ? " active" : ""}`}
              onClick={() => setIntencao(diaAtual, "A")}
            >
              A · Busco trabalho
            </button>
            <button
              className={`int-btn${int === "B" ? " active" : ""}`}
              onClick={() => setIntencao(diaAtual, "B")}
            >
              B · Fazer melhor
            </button>
          </div>
          <div className="intention-box">
            <p>{int === "A" ? data.intencaoA : data.intencaoB}</p>
          </div>

          <div className="prayer-box">
            <p className="box-label">Oração a São Josemaria</p>
            <p>{data.oracao}</p>
            <p className="small-note">Pai Nosso &middot; Ave-Maria &middot; Glória</p>
          </div>

          <div className="day-actions">
            <button className="btn-pri" onClick={() => marcarDia(diaAtual)}>
              {jaRezou ? "Rezado hoje" : "Já rezei hoje"}
            </button>
            <button className="btn-sec" onClick={convidar}>
              Convidar alguém
            </button>
          </div>
        </article>

        <aside className="novena-side">
          <div className="progress-card">
            <p className="box-label">Seu caminho</p>
            <div className="progress-line">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className={`dot${feitos.includes(i + 1) ? " done" : ""}`} />
              ))}
            </div>
            <div className="progress-meta">
              <span>{feitos.length} de 9 dias</span>
              <span>até {festaLabel}</span>
            </div>
          </div>

          <p className="box-label">Escolher dia</p>
          <div className="day-tabs">
            {novenaDias.map((d) => {
              let cls = "day-tab";
              if (d.dia === diaAtual) cls += " active";
              else if (feitos.includes(d.dia)) cls += " done";
              return (
                <button key={d.dia} className={cls} onClick={() => setDia(d.dia)}>
                  Dia {d.dia}
                </button>
              );
            })}
          </div>

          <div className="reminder">
            <h3 className="font-serif">Lembrete diário</h3>
            <p>Crie um compromisso no calendário para voltar todos os dias e rezar a novena até {festaLabel}.</p>
            <div className="reminder-row">
              <input
                className="time-input"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value || "08:00")}
                aria-label="Horário do lembrete"
              />
              <button className="btn-pri" onClick={downloadIcs}>
                Calendário
              </button>
            </div>
            <button className="btn-sec" onClick={openGoogleCalendar}>
              Google Calendar
            </button>
            <p className="small-note">
              O botão &ldquo;Calendário&rdquo; baixa um arquivo (.ics) para Apple/Outlook;
              o outro abre o evento no Google Calendar.
            </p>
          </div>
        </aside>
      </div>

      {(showCompletion || completouNovena) && (
        <div style={{ marginTop: 16 }}>
          <div className="nref" style={{ borderLeft: "3px solid var(--w)" }}>
            <p className="nref-lbl">Novena Concluída</p>
            <p className="font-serif">
              Parabéns! Você completou a Novena do Trabalho. São Josemaria, intercede por nós!
            </p>
            <p className="font-serif" style={{ marginTop: 12 }}>
              Continue confiando na providência de Deus. Que o trabalho que você busca ou
              realiza seja sempre um caminho de santificação.
            </p>
            <div className="nact">
              <button className="btn-sec" onClick={recomecar}>
                Recomeçar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
