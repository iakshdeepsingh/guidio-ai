import { useEffect, useRef } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH } from "./assistant-utils";

const MAX_HEIGHT_PX = 176;

export function ChatComposer({
  value,
  onChange,
  onSend,
  isSending,
  cooldownSeconds,
}) {
  const textAreaRef = useRef(null);

  const isCoolingDown = cooldownSeconds > 0;
  const canSend = value.trim().length > 0 && !isSending && !isCoolingDown;

  // Grow with the text, up to a maximum height.
  useEffect(() => {
    const element = textAreaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  // Return focus to the box after an answer, on devices with a mouse.
  // On phones this is skipped so the keyboard does not pop up by itself.
  useEffect(() => {
    if (isSending) return;

    if (window.matchMedia?.("(pointer: fine)").matches) {
      textAreaRef.current?.focus();
    }
  }, [isSending]);

  function handleSubmit(event) {
    event.preventDefault();
    if (canSend) onSend();
  }

  function handleKeyDown(event) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    // On phones and tablets the Enter key adds a new line.
    // The Send button sends the message.
    if (window.matchMedia?.("(pointer: coarse)").matches) {
      return;
    }

    event.preventDefault();
    if (canSend) onSend();
  }

  return (
    <div className="border-t border-foreground/10 bg-background/72 px-3 pb-3 pt-3 backdrop-blur-[20px] backdrop-saturate-[1.8] sm:px-4">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
        <div className="flex items-end gap-2 rounded-[1.75rem] bg-muted p-2 ring-1 ring-transparent transition-shadow duration-200 focus-within:ring-foreground/25">
          <label htmlFor="assistant-message" className="sr-only">
            Your message
          </label>

          <textarea
            id="assistant-message"
            ref={textAreaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={isSending}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Ask a question or paste your doubt…"
            className="max-h-44 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-base leading-6 tracking-[-0.01em] outline-none placeholder:text-muted-foreground sm:text-[15px]"
          />

          <Button
            type="submit"
            size="icon-lg"
            disabled={!canSend}
            aria-label={
              isCoolingDown
                ? `Send is paused for ${cooldownSeconds} seconds`
                : "Send message"
            }
            className="size-10 shrink-0 rounded-full transition-transform duration-200 enabled:active:scale-90"
          >
            {isSending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : isCoolingDown ? (
              <span className="text-xs tabular-nums">{cooldownSeconds}s</span>
            ) : (
              <ArrowUp aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="mt-2 flex items-start justify-between gap-3 px-2">
          <AiUsageNotice variant="inline" />

          {value.length > MAX_MESSAGE_LENGTH - 1000 ? (
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {value.length}/{MAX_MESSAGE_LENGTH}
            </span>
          ) : (
            <span className="hidden shrink-0 text-xs text-muted-foreground md:pointer-fine:block">
              Enter to send · Shift+Enter for a new line
            </span>
          )}
        </div>
      </form>
    </div>
  );
}