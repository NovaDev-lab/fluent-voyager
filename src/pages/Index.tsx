import { useMemo, useState } from "react";
import { LANGUAGES, Language } from "@/data/languages";
import { LanguageCard } from "@/components/LanguageCard";
import { LanguageDetail } from "@/components/LanguageDetail";
import { ClusteringMode } from "@/components/ClusteringMode";
import { Search, Radio, Telescope, Mic, BookOpen } from "lucide-react";

type View = "explorer" | "clustering";
type FilterKey = "all" | "ai" | "stories" | "deep" | "easy";

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI Speaking" },
  { id: "stories", label: "Stories" },
  { id: "deep", label: "B1+ Depth" },
  { id: "easy", label: "FSI I–II" },
];

const Index = () => {
  const [view, setView] = useState<View>("explorer");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeId, setActiveId] = useState<string>("es");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LANGUAGES.filter((l) => {
      if (q && !`${l.name} ${l.endonym} ${l.family} ${l.branch}`.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === "ai" && !l.hasAiSpeaking) return false;
      if (filter === "stories" && !l.hasStories) return false;
      if (filter === "deep" && l.cefrDepth < 3) return false;
      if (filter === "easy" && !["I", "II"].includes(l.fsiCategory)) return false;
      return true;
    });
  }, [query, filter]);

  const active =
    filtered.find((l) => l.id === activeId) ??
    LANGUAGES.find((l) => l.id === activeId) ??
    LANGUAGES[0];

  const pick = (id: string) => {
    setActiveId(id);
    if (view !== "explorer") setView("explorer");
  };

  return (
    <div className="min-h-dvh flex flex-col star-field">
      {/* Header */}
      <header className="glass-panel border-b sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full border border-pulsar flex items-center justify-center relative">
              <div className="size-2 rounded-full bg-pulsar animate-pulse-glow" />
              <div className="absolute inset-0 rounded-full border border-pulsar/30 animate-orbit" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-widest text-pulsar uppercase">
                Glossa Observatory
              </span>
              <span className="font-mono text-[9px] text-dust/70 tracking-tighter uppercase mt-0.5">
                Duolingo catalog · v4.0.2
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 font-mono text-[10px] uppercase tracking-widest-xl border border-border bg-nebula/40 p-1">
            <button
              onClick={() => setView("explorer")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                view === "explorer"
                  ? "bg-pulsar/15 text-pulsar"
                  : "text-dust hover:text-stardust"
              }`}
            >
              <Telescope className="size-3" /> Explorer
            </button>
            <button
              onClick={() => setView("clustering")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                view === "clustering"
                  ? "bg-pulsar/15 text-pulsar"
                  : "text-dust hover:text-stardust"
              }`}
            >
              <Radio className="size-3" /> Clustering
            </button>
          </nav>

          <div className="hidden sm:block px-3 py-1 rounded-full border border-border font-mono text-[9px] text-dust tracking-widest uppercase">
            {LANGUAGES.length} languages indexed
          </div>
        </div>

        {/* Mobile view switch */}
        <div className="md:hidden px-5 pb-3 flex gap-2">
          <button
            onClick={() => setView("explorer")}
            className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest border ${
              view === "explorer" ? "border-pulsar text-pulsar bg-pulsar/10" : "border-border text-dust"
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => setView("clustering")}
            className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest border ${
              view === "clustering" ? "border-pulsar text-pulsar bg-pulsar/10" : "border-border text-dust"
            }`}
          >
            Clustering
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-5 md:px-8 py-8 md:py-12">
        {view === "explorer" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
            {/* Left column: intro + list */}
            <section className="flex flex-col gap-6 min-w-0">
              <div>
                <h1 className="text-3xl md:text-5xl font-light tracking-tight text-stardust glow-text mb-3">
                  From streaks to <span className="text-aurora">real fluency</span>.
                </h1>
                <p className="text-sm text-dust leading-relaxed max-w-prose">
                  Every Duolingo course mapped by CEFR depth, writing-system difficulty, AI speaking
                  availability, grammar density — and what you'll need outside the app to actually
                  get conversational.
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-dust">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-pulsar shadow-pulsar-soft" /> AI speaking
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-spectral" /> Stories
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-stardust/70" /> Podcast
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="size-4 text-dust absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search language, family, branch…"
                  className="w-full bg-nebula/50 border border-border rounded-none pl-10 pr-4 py-3 text-sm font-mono placeholder:text-dust/50 focus:outline-none focus:border-pulsar transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                      filter === f.id
                        ? "border-pulsar bg-pulsar/10 text-pulsar"
                        : "border-border bg-nebula/30 text-dust hover:text-stardust hover:border-pulsar/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-px bg-border border border-border">
                <Stat label="Shown" value={filtered.length.toString()} icon={<Telescope className="size-3" />} />
                <Stat
                  label="With AI"
                  value={filtered.filter((l) => l.hasAiSpeaking).length.toString()}
                  icon={<Mic className="size-3" />}
                />
                <Stat
                  label="With Stories"
                  value={filtered.filter((l) => l.hasStories).length.toString()}
                  icon={<BookOpen className="size-3" />}
                />
              </div>

              {/* Card list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((l) => (
                  <LanguageCard
                    key={l.id}
                    language={l}
                    active={l.id === activeId}
                    onClick={() => setActiveId(l.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-12 border border-dashed border-border text-dust font-mono text-xs">
                    No results in this sector
                  </div>
                )}
              </div>
            </section>

            {/* Right column: detail */}
            <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto glass-panel p-6 md:p-8 min-w-0">
              <LanguageDetail language={active as Language} onPick={pick} />
            </aside>
          </div>
        ) : (
          <ClusteringMode onPick={pick} />
        )}
      </main>

      {/* Footer / status bar */}
      <footer className="border-t border-border glass-panel mt-12">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-5 items-center font-mono text-[9px] text-dust/80 tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-pulsar shadow-pulsar-soft" />
              Core online
            </span>
            <span className="hidden sm:inline">Nodes: {LANGUAGES.length}</span>
            <span className="hidden md:inline">Dataset: Duolingo_2025_Q1</span>
          </div>
          <div className="font-mono text-[9px] text-dust/50 uppercase tracking-widest">
            Built for learners who suspect the streak isn't enough
          </div>
        </div>
      </footer>
    </div>
  );
};

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-nebula/40 p-3">
      <div className="flex items-center gap-1.5 text-dust mb-1">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-light text-stardust">{value}</p>
    </div>
  );
}

export default Index;
