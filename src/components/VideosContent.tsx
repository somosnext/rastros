import { videos } from "@/lib/data/videos";
import VideoGrid from "./VideoGrid";

export default function VideosContent() {
  const encontros = videos.filter((v) => v.categoria === "encontros");
  const ensinamentos = videos.filter((v) => v.categoria === "ensinamentos");
  const terceiros = videos.filter((v) => v.categoria === "terceiros");

  return (
    <>
      <VideoGrid
        label="São Josemaria em tertúlias e encontros"
        title="Encontros"
        videos={encontros}
      />

      <VideoGrid
        label="São Josemaria falando diretamente"
        title="Ensinamentos"
        videos={ensinamentos}
      />

      <VideoGrid
        label="Documentários, depoimentos e análises"
        title="Vídeos de Terceiros"
        videos={terceiros}
      />

      <div className="cb">
        <div className="sh">
          <p className="sl">Playlist</p>
          <h2 className="st font-serif">Séries</h2>
        </div>
        <a
          className="pc"
          href="https://www.youtube.com/playlist?list=PL0sf-Xf0cTijBpBn-FrWFx6zwUVr9Xq2H"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="pi-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <div className="pinfo">
            <p className="ptitle font-serif">Série Preguntas y Respuestas</p>
            <p className="pdesc">Playlist completa no YouTube</p>
          </div>
          <span className="parrow">&rarr;</span>
        </a>
      </div>
    </>
  );
}
