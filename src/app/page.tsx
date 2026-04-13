"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Nav, { type TabId } from "@/components/Nav";
import AuthModal from "@/components/AuthModal";
import VideosContent from "@/components/VideosContent";
import ExameContent from "@/components/ExameContent";
import PlanoContent from "@/components/PlanoContent";
import NovenaContent from "@/components/NovenaContent";
import VagasContent from "@/components/VagasContent";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const publicTabs: TabId[] = ["videos"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("videos");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleTabChange(tab: TabId) {
    if (!publicTabs.includes(tab) && !user) {
      setShowAuth(true);
      return;
    }
    setActiveTab(tab);
  }

  return (
    <>
      <Hero />
      <Nav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAuthClick={() => setShowAuth(true)}
      />
      <main className="page-enter" key={activeTab}>
        {activeTab === "videos" && <VideosContent />}
        {activeTab === "exame" && <ExameContent />}
        {activeTab === "plano" && <PlanoContent />}
        {activeTab === "novena" && <NovenaContent />}
        {activeTab === "vagas" && <VagasContent />}
      </main>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}
