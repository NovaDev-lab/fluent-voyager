import { useMemo, useState } from "react";
import { LANGUAGES, Language, MorphologyType } from "@/data/languages";
import { Sparkles } from "lucide-react";

type ClusterDim = "morphology" | "script" | "transfer" | "family";

const DIMENSIONS: { id: ClusterDim; label: string; desc: string }[] = [
  { id: "morphology", label: "Morphology", desc: "Isolating · Fusional · Agglutinative · Polysynthetic" },
  { id: "script", label: "Script", desc: "Writing-system family" },
  { id: "transfer", label: "Transfer difficulty", desc: "Distance from English" },
  { id: "family", label: "Language family", desc: "Genetic phylogeny" },
];

const MORPH_ORDER: MorphologyType[] = ["isolating", "fusional", "agglutinative", "polysynthetic", "mixed"];

function groupBy<T, K extends string>(arr: T[], key: (x: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function ClusteringMode({ onPick }: { onPick: (id: string) => void }) {
  const [dim, setDim] = useState<ClusterDim>("morphology");
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set(["es"]));

  const groups = useMemo(() => {
    const keyFn: Record<ClusterDim, (l: Language) => string> = {
      morphology: (l) => l.morphology,
      script: (l) => l.script,
      transfer: (l) => `Tier ${l.transferFromEnglish} (${transferLabel(l.transferFromEnglish)})`,
      family: (l) => l.family,
    };
    const grouped = groupBy(LANGUAGES, keyFn[dim]);
    // Sort groups for morphology
    const keys = Object.keys(grouped);
    if (dim === "morphology") {
      keys.sort((a, b) => MORPH_ORDER.indexOf(a as MorphologyType) - MORPH_ORDER.indexOf(b as MorphologyType));
    } else if (dim === "transfer") {
      keys.sort();
    } else {
      keys.sort((a, b) => grouped[b].length - grouped[a].length);
    }
    return keys.map((k) => ({ key: k, items: grouped[k] }));
  }, [dim]);

  const recommendations = useMemo(() => {
    if (knownIds.size === 0) return [];
    const known = LANGUAGES.filter((l) => knownIds.has(l.id));
    return LANGUAGES
      .filter((l) => !knownIds.has(l.id))
      .map((l) => ({ lang: l, score: transferScore(known, l) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 6);
  }, [knownIds]);

  const toggleKnown = (id: string) => {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-spectral" />
          <span className="font-mono text-[10px] uppercase tracking-widest-xl text-spectral">
            Linguistics Nerd Mode
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight glow-text text-stardust mb-3">
          Cluster the catalog, choose your next language.
        </h1>
        <p className="text-sm text-dust leading-relaxed">
          Group Duolingo's languages by the dimension that matters to you, then tell us what you
          already speak — we'll rank the smartest next language by morphological and lexical
          transfer distance.
        </p>
      </header>

      {/* Dimension selector */}
      <div className="flex flex-wrap gap-2">
        {DIMENSIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDim(d.id)}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all ${
              dim === d.id
                ? "border-pulsar bg-pulsar/10 text-pulsar shadow-pulsar-soft"
                : "border-border bg-nebula/30 text-dust hover:border-pulsar/40 hover:text-stardust"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <p className="font-mono text-[10px] text-dust/70 -mt-6 uppercase tracking-widest">
        {DIMENSIONS.find((d) => d.id === dim)?.desc}
      </p>

      {/* Clusters */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map(({ key, items }) => (
          <div
            key={key}
            className="border border-border bg-nebula/30 p-5 hover:border-pulsar/30 transition-colors"
          >
            <div className="flex items-baseline justify-between mb-4 border-b border-border pb-3">
              <h3 className="text-base font-medium text-stardust capitalize">{key}</h3>
              <span className="font-mono text-[10px] text-dust">
                {items.length} language{items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onPick(l.id)}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border bg-muted/40 hover:border-pulsar hover:bg-pulsar/10 text-stardust transition-colors"
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Smart next language */}
      <section className="border border-spectral/30 bg-gradient-to-br from-spectral/5 via-transparent to-pulsar/5 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-spectral" />
          <span className="font-mono text-[10px] uppercase tracking-widest-xl text-spectral">
            Smart Next Language
          </span>
        </div>
        <h2 className="text-2xl font-light text-stardust tracking-tight mb-4">
          I already speak…
        </h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {LANGUAGES.map((l) => {
            const on = knownIds.has(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggleKnown(l.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors ${
                  on
                    ? "border-pulsar bg-pulsar/15 text-pulsar"
                    : "border-border bg-muted/30 text-dust hover:border-pulsar/40 hover:text-stardust"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            );
          })}
        </div>

        {recommendations.length > 0 && (
          <>
            <h3 className="font-mono text-[10px] uppercase tracking-widest-xl text-dust mb-4">
              Ranked by total transfer distance (lower = easier jump)
            </h3>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((r, i) => (
                <li key={r.lang.id}>
                  <button
                    onClick={() => onPick(r.lang.id)}
                    className="w-full text-left flex items-center gap-4 p-4 border border-border bg-nebula/40 hover:border-pulsar hover:bg-pulsar/10 transition-colors group"
                  >
                    <div className="font-mono text-3xl font-light text-pulsar w-10 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span>{r.lang.flag}</span>
                        <span className="text-stardust text-base">{r.lang.name}</span>
                      </div>
                      <p className="font-mono text-[10px] text-dust truncate">
                        {r.lang.branch} · {r.lang.script} · {r.lang.morphology}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-[10px] text-dust uppercase">Distance</p>
                      <p className="font-mono text-sm text-spectral">{r.score.toFixed(2)}σ</p>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}

function transferLabel(tier: number) {
  return ["", "very close", "close", "moderate", "far", "alien"][tier] ?? "";
}

function transferScore(known: Language[], target: Language) {
  // Min distance across known languages
  let best = Infinity;
  for (const k of known) {
    let d = 0;
    if (k.family !== target.family) d += 2;
    if (k.branch !== target.branch) d += 1;
    if (k.script !== target.script) d += 1.2;
    if (k.morphology !== target.morphology) d += 1.1;
    if (k.wordOrder !== target.wordOrder) d += 0.6;
    if (k.tonal !== target.tonal) d += 0.8;
    d += Math.abs(k.cases - target.cases) * 0.15;
    d += Math.abs(k.grammarDensity - target.grammarDensity) * 0.1;
    if (k.nearestNeighbors.includes(target.id) || target.nearestNeighbors.includes(k.id)) {
      d -= 1.5;
    }
    best = Math.min(best, Math.max(0, d));
  }
  return best;
}
