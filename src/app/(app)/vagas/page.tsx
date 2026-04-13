import VagasContent from "@/components/VagasContent";
import ProtectedContent from "@/components/ProtectedContent";

export default function VagasPage() {
  return (
    <ProtectedContent>
      <VagasContent />
    </ProtectedContent>
  );
}
