import Image from "next/image";
import type { Video } from "@/lib/data/videos";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <a
      className="vc"
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="vt">
        <Image
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.titulo}
          width={320}
          height={180}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="pb">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="vb">{video.subtitulo}</span>
      </div>
      <div className="vi">
        <p className="vtitle font-serif">{video.titulo}</p>
        <p className="vmeta">YouTube · São Josemaria</p>
      </div>
    </a>
  );
}
