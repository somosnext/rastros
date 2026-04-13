import NovenaContent from "@/components/NovenaContent";
import ProtectedContent from "@/components/ProtectedContent";

export default function NovenaPage() {
  return (
    <ProtectedContent>
      <NovenaContent />
    </ProtectedContent>
  );
}
