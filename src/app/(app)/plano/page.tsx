import PlanoContent from "@/components/PlanoContent";
import ProtectedContent from "@/components/ProtectedContent";

export default function PlanoPage() {
  return (
    <ProtectedContent>
      <PlanoContent />
    </ProtectedContent>
  );
}
