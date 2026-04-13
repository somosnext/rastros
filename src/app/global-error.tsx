"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0a0a0a", color: "#f5f5f5", fontFamily: "sans-serif", textAlign: "center", padding: "120px 24px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "#444", marginBottom: 16 }}>
          Erro
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 300, marginBottom: 16 }}>
          Algo deu errado
        </h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 40 }}>
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <button
          onClick={reset}
          style={{ padding: "14px 28px", fontSize: 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", border: "none", background: "#f5f5f5", color: "#0a0a0a" }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
