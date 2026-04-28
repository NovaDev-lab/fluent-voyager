import { Language } from "@/data/languages";

interface Props {
  language: Language;
  active?: boolean;
  onClick?: () => void;
}

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function LanguageCard({ language, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left p-5 border transition-all duration-300 relative overflow-hidden ${
        active
          ? "border-pulsar bg-nebula/80 shadow-pulsar-soft"
          : "border-border bg-nebula/30 hover:border-pulsar/40 hover:bg-nebula/60"
      }`}
    >
      {active && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-pulsar/5 to-transparent" />
      )}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl leading-none">{language.flag}</span>
            <span className="font-mono text-[10px] text-dust uppercase tracking-widest truncate">
              {language.branch}
            </span>
          </div>
          <h3
            className={`text-xl font-light tracking-tight truncate ${
              active ? "glow-text text-pulsar" : "text-stardust"
            }`}
          >
            {language.name}
          </h3>
          <p className="font-mono text-[10px] text-dust/70 mt-0.5 truncate">
            {language.endonym}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-mono text-[9px] text-dust uppercase">Depth</span>
          <span
            className={`font-mono text-sm font-semibold ${
              active ? "text-pulsar" : "text-stardust"
            }`}
          >
            {language.cefrMax}
          </span>
        </div>
      </div>

      {/* CEFR pips */}
      <div className="flex gap-1 mb-3">
        {CEFR_LEVELS.map((lvl, i) => {
          const filled = i < language.cefrDepth;
          return (
            <div
              key={lvl}
              className={`flex-1 h-1.5 rounded-sm transition-colors ${
                filled
                  ? i === language.cefrDepth - 1
                    ? "bg-pulsar shadow-pulsar-soft"
                    : "bg-pulsar/70"
                  : "bg-muted"
              }`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex gap-3 text-dust">
          <span>{language.script}</span>
          <span className="text-dust/40">·</span>
          <span>FSI {language.fsiCategory}</span>
        </div>
        <div className="flex gap-1.5">
          {language.hasAiSpeaking && (
            <span
              title="AI speaking"
              className="size-1.5 rounded-full bg-pulsar shadow-pulsar-soft"
            />
          )}
          {language.hasStories && (
            <span title="Stories" className="size-1.5 rounded-full bg-spectral" />
          )}
          {language.hasPodcast && (
            <span
              title="Podcast"
              className="size-1.5 rounded-full bg-stardust/70"
            />
          )}
        </div>
      </div>
    </button>
  );
}
