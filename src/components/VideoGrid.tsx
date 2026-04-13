import type { Video } from "@/lib/data/videos";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  label: string;
  title: string;
  videos: Video[];
}

export default function VideoGrid({ label, title, videos }: VideoGridProps) {
  return (
    <div className="cb">
      <div className="sh">
        <p className="sl">{label}</p>
        <h2 className="st font-serif">{title}</h2>
      </div>
      <div className="vg">
        {videos.map((v) => (
          <VideoCard key={v.youtubeId} video={v} />
        ))}
      </div>
    </div>
  );
}
