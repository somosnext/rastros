import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "var(--g6)", marginBottom: 16 }}>
        Erro 404
      </p>
      <h1 className="font-serif" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 300, color: "var(--w)", marginBottom: 16 }}>
        Página não encontrada
      </h1>
      <p style={{ color: "var(--g5)", fontSize: 14, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="btn-pri"
        style={{ display: "inline-block", padding: "14px 32px", textDecoration: "none" }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
