"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "var(--g6)", marginBottom: 16 }}>
        Erro
      </p>
      <h1 className="font-serif" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 300, color: "var(--w)", marginBottom: 16 }}>
        Algo deu errado
      </h1>
      <p style={{ color: "var(--g5)", fontSize: 14, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <button className="btn-pri" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
