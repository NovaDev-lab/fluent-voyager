import { Language, LANGUAGES } from "@/data/languages";
import { Mic, BookOpen, Headphones, Users, Globe2, Type, Layers, ArrowRight } from "lucide-react";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const CEFR_HEIGHTS = [20, 38, 58, 82, 100, 100];

interface Props {
  language: Language;
  onPick?: (id: string) => void;
}

export function LanguageDetail({ language, onPick }: Props) {
  const neighbors = language.nearestNeighbors
    .map((id) => LANGUAGES.find((l) => l.id === id))
    .filter(Boolean) as Language[];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="size-2 bg-pulsar rounded-full animate-pulse-glow" />
          <span className="font-mono text-[10px] text-pulsar tracking-widest-xl uppercase">
            Active scan · node_{language.id.toUpperCase()}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-4xl leading-none">{language.flag}</span>
              <h2 className="text-4xl font-light tracking-tight glow-text text-stardust">
                {language.name}
              </h2>
            </div>
            <p className="font-mono text-xs text-dust mt-1">
              {language.endonym} · {language.family} / {language.branch}
            </p>
          </div>
        </div>
        <p className="text-sm text-dust leading-relaxed mt-4 max-w-prose">
          {language.blurb}
        </p>
      </header>

      {/* CEFR chart */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h4 className="text-[10px] font-mono uppercase text-dust tracking-widest-xl">
            CEFR Acquisition Depth
          </h4>
          <span className="font-mono text-[10px] text-pulsar">
            Ceiling: {language.cefrMax}
          </span>
        </div>
        <div className="flex items-end gap-2 h-28 border-b border-border pb-1">
          {CEFR_LEVELS.map((lvl, i) => {
            const reached = i < language.cefrDepth;
            const height = reached ? CEFR_HEIGHTS[i] : Math.max(8, CEFR_HEIGHTS[i] * 0.15);
            const isCurrent = i === language.cefrDepth - 1;
            return (
              <div key={lvl} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-sm transition-all ${
                    reached
                      ? isCurrent
                        ? "bg-pulsar shadow-pulsar"
                        : "bg-pulsar/60"
                      : "bg-muted border border-border"
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span
                  className={`font-mono text-[10px] ${
                    isCurrent ? "text-pulsar font-bold" : reached ? "text-dust" : "text-dust/30"
                  }`}
                >
                  {lvl}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metric grid */}
      <section className="grid grid-cols-2 gap-3">
        <MetricTile
          label="Grammar Density"
          value={language.grammarDensity.toFixed(1)}
          ratio={language.grammarDensity / 10}
          color="spectral"
        />
        <MetricTile
          label="Script Difficulty"
          value={`${language.scriptDifficulty} / 5`}
          ratio={language.scriptDifficulty / 5}
          color="pulsar"
        />
        <MetricTile
          label="Transfer From English"
          value={`${language.transferFromEnglish} / 5`}
          ratio={language.transferFromEnglish / 5}
          color="pulsar"
        />
        <MetricTile
          label="Course Units"
          value={language.courseUnits?.toString() ?? "—"}
          ratio={Math.min(1, (language.courseUnits ?? 0) / 250)}
          color="spectral"
        />
      </section>

      {/* Feature badges */}
      <section>
        <h4 className="text-[10px] font-mono uppercase text-dust tracking-widest-xl mb-3">
          Duolingo Feature Availability
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <FeatureBadge
            icon={<Mic className="size-3.5" />}
            label="AI Speaking"
            active={language.hasAiSpeaking}
          />
          <FeatureBadge
            icon={<BookOpen className="size-3.5" />}
            label="Stories"
            active={language.hasStories}
          />
          <FeatureBadge
            icon={<Headphones className="size-3.5" />}
            label="Podcast"
            active={language.hasPodcast}
          />
        </div>
      </section>

      {/* Structural data */}
      <section>
        <h4 className="text-[10px] font-mono uppercase text-dust tracking-widest-xl mb-3">
          Structural Profile
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
          <DataRow icon={<Type className="size-3" />} label="Script" value={language.script} />
          <DataRow icon={<Layers className="size-3" />} label="Morphology" value={language.morphology} />
          <DataRow icon={<Globe2 className="size-3" />} label="Word order" value={language.wordOrder} />
          <DataRow icon={<Users className="size-3" />} label="Speakers" value={language.speakers} />
          <DataRow label="Cases" value={language.cases > 0 ? language.cases.toString() : "—"} />
          <DataRow label="Phonemes" value={language.phonemes.toString()} />
          <DataRow label="Tonal" value={language.tonal ? "yes" : "no"} />
          <DataRow label="FSI class" value={language.fsiCategory} />
        </div>
      </section>

      {/* Strong / weak */}
      <section className="grid grid-cols-1 gap-2">
        <div className="p-3 border-l-2 border-pulsar bg-pulsar/5">
          <p className="font-mono text-[10px] text-pulsar uppercase tracking-widest mb-1">
            What Duolingo does well
          </p>
          <p className="text-xs text-stardust">{language.strongPoint}</p>
        </div>
        <div className="p-3 border-l-2 border-spectral bg-spectral/5">
          <p className="font-mono text-[10px] text-spectral uppercase tracking-widest mb-1">
            Where it falls short
          </p>
          <p className="text-xs text-stardust">{language.weakPoint}</p>
        </div>
      </section>

      {/* Outside resources */}
      <section>
        <h4 className="text-[10px] font-mono uppercase text-dust tracking-widest-xl mb-3">
          Streaks → Fluency · Outside Resources
        </h4>
        <ul className="space-y-2">
          {language.outsideResources.map((r) => (
            <li
              key={r.name}
              className="p-3 border border-border bg-muted/40 hover:border-pulsar/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="text-sm font-medium text-stardust">{r.name}</span>
                <span className="font-mono text-[9px] text-pulsar uppercase tracking-widest shrink-0">
                  {r.type}
                </span>
              </div>
              <p className="text-xs text-dust leading-relaxed">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Neighbors */}
      {neighbors.length > 0 && (
        <section>
          <h4 className="text-[10px] font-mono uppercase text-dust tracking-widest-xl mb-3">
            Nearest Linguistic Neighbors
          </h4>
          <div className="flex flex-wrap gap-2">
            {neighbors.map((n) => (
              <button
                key={n.id}
                onClick={() => onPick?.(n.id)}
                className="group flex items-center gap-2 px-3 py-2 border border-border bg-muted/40 hover:border-pulsar hover:bg-pulsar/10 transition-colors"
              >
                <span>{n.flag}</span>
                <span className="text-xs text-stardust">{n.name}</span>
                <ArrowRight className="size-3 text-dust group-hover:text-pulsar" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MetricTile({
  label,
  value,
  ratio,
  color,
}: {
  label: string;
  value: string;
  ratio: number;
  color: "pulsar" | "spectral";
}) {
  const barClass = color === "pulsar" ? "bg-pulsar" : "bg-spectral";
  return (
    <div className="p-4 border border-border bg-muted/30 rounded-sm">
      <p className="font-mono text-[10px] text-dust uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-light text-stardust mt-1">{value}</p>
      <div className="w-full h-0.5 bg-border mt-3">
        <div
          className={`h-full ${barClass}`}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}

function FeatureBadge({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 p-3 border text-center ${
        active
          ? "border-pulsar/50 bg-pulsar/10 text-pulsar"
          : "border-border bg-muted/30 text-dust/40"
      }`}
    >
      {icon}
      <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      <span className="font-mono text-[9px]">{active ? "ACTIVE" : "—"}</span>
    </div>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/60">
      <span className="flex items-center gap-1.5 text-dust uppercase text-[10px] tracking-wider">
        {icon}
        {label}
      </span>
      <span className="text-stardust">{value}</span>
    </div>
  );
}
