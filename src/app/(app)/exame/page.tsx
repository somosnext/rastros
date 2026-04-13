import ExameContent from "@/components/ExameContent";
import ProtectedContent from "@/components/ProtectedContent";

export default function ExamePage() {
  return (
    <ProtectedContent>
      <ExameContent />
    </ProtectedContent>
  );
}
