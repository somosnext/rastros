import Link from "next/link";
import ExportContatos from "@/components/ExportContatos";

export default function AdminPage() {
  return (
    <>
      <div className="sh">
        <p className="sl">Painel Administrativo</p>
        <h2 className="st font-serif">Admin</h2>
      </div>

      <div className="psteps">
        <ExportContatos />
        <Link href="/admin/vagas" style={{ textDecoration: "none" }}>
          <div className="pstep" style={{ cursor: "pointer" }}>
            <div className="psth">
              <span className="pstn">Moderação</span>
              <h3 className="pstt font-serif">Vagas</h3>
            </div>
            <p style={{ color: "var(--g4)", fontSize: 13 }}>
              Aprovar, rejeitar ou excluir vagas publicadas pela comunidade.
            </p>
          </div>
        </Link>

        <Link href="/admin/videos" style={{ textDecoration: "none" }}>
          <div className="pstep" style={{ cursor: "pointer" }}>
            <div className="psth">
              <span className="pstn">Conteúdo</span>
              <h3 className="pstt font-serif">Vídeos</h3>
            </div>
            <p style={{ color: "var(--g4)", fontSize: 13 }}>
              Adicionar, editar ou remover vídeos da biblioteca.
            </p>
          </div>
        </Link>

        <Link href="/admin/exame" style={{ textDecoration: "none" }}>
          <div className="pstep" style={{ cursor: "pointer" }}>
            <div className="psth">
              <span className="pstn">Conteúdo</span>
              <h3 className="pstt font-serif">Exame de Consciência</h3>
            </div>
            <p style={{ color: "var(--g4)", fontSize: 13 }}>
              Editar os itens do exame de consciência.
            </p>
          </div>
        </Link>

        <Link href="/admin/novena" style={{ textDecoration: "none" }}>
          <div className="pstep" style={{ cursor: "pointer" }}>
            <div className="psth">
              <span className="pstn">Conteúdo</span>
              <h3 className="pstt font-serif">Novena do Trabalho</h3>
            </div>
            <p style={{ color: "var(--g4)", fontSize: 13 }}>
              Editar os textos dos 9 dias da novena.
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
