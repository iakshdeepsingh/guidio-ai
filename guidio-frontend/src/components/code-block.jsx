import { lazy, memo, Suspense } from "react";
import { CopyButton } from "@/components/common/copy-button";

// The syntax highlighter is loaded only when an answer contains code.
const CodeHighlighter = lazy(() => import("@/components/code-highlighter"));

function PlainCode({ code }) {
  return (
    <pre className="m-0 px-5 py-4 font-mono text-[13px] leading-[1.7] text-neutral-200">
      <code>{code}</code>
    </pre>
  );
}

function CodeBlockBase({ code, language }) {
  return (
    <div className="my-5 overflow-hidden rounded-[1.25rem] bg-[#0a0a0a] text-neutral-200 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-3 bg-[#161616] px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          {/* Window dots, like the dashboard preview */}
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>

          <span className="truncate font-mono text-xs text-neutral-400">
            {language || "text"}
          </span>
        </div>

        <CopyButton
          text={code}
          tone="dark"
          ariaLabel="Copy code"
          label="Copy code"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        {language ? (
          <Suspense fallback={<PlainCode code={code} />}>
            <CodeHighlighter code={code} language={language} />
          </Suspense>
        ) : (
          <PlainCode code={code} />
        )}
      </div>
    </div>
  );
}

export const CodeBlock = memo(CodeBlockBase);