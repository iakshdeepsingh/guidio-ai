import { ArrowUpRight, Sparkles } from "lucide-react";
import { SUGGESTED_PROMPTS } from "./assistant-utils";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

export function ChatEmptyState({ onPick, disabled }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
      <span
        aria-hidden="true"
        style={reveal(0)}
        className="animate-in fade-in zoom-in-95 flex size-14 items-center justify-center rounded-full bg-foreground text-background duration-700 motion-reduce:animate-none"
      >
        <Sparkles className="size-6" />
      </span>

      <h2
        style={reveal(80)}
        className="animate-in fade-in slide-in-from-bottom-3 mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] duration-700 motion-reduce:animate-none sm:text-5xl"
      >
        What can I{" "}
        <span className="text-muted-foreground">help you with?</span>
      </h2>

      <p
        style={reveal(160)}
        className="animate-in fade-in slide-in-from-bottom-3 mt-4 max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground duration-700 motion-reduce:animate-none sm:text-lg"
      >
        Ask about your studies, a concept you are stuck on, career choices,
        resumes, interviews or learning roadmaps. Pick a suggestion or type your
        own question.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-2 text-left sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            disabled={disabled}
            style={reveal(240 + index * 60)}
            className="group animate-in fade-in slide-in-from-bottom-2 flex items-start justify-between gap-3 rounded-2xl bg-muted p-4 text-sm font-medium leading-6 tracking-[-0.01em] text-foreground/80 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 motion-reduce:animate-none"
          >
            <span>{prompt}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </button>
        ))}
      </div>
    </div>
  );
}