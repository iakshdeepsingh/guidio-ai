import { memo } from "react";
import { Sparkles } from "lucide-react";
import { CopyButton } from "@/components/common/copy-button";
import MarkdownRenderer from "@/components/markdown-renderer";
import { formatMessageTime } from "./assistant-utils";

function ThinkingDots() {
  return (
    <div
      role="status"
      aria-label="Guidio AI is thinking"
      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-3"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-pulse rounded-full bg-foreground/50"
          style={{ animationDelay: `${index * 180}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubbleBase({ message }) {
  const time = formatMessageTime(message.createdAt);

  if (message.role === "user") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-end duration-300 motion-reduce:animate-none">
        <div className="min-w-0 max-w-[88%] sm:max-w-[75%]">
          <div className="rounded-[1.5rem] rounded-br-md bg-foreground px-4 py-3 text-sm leading-7 tracking-[-0.01em] text-background sm:text-[15px]">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {time ? (
            <p className="mt-1.5 px-1 text-right text-xs text-muted-foreground">
              {time}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const isWaiting = message.isStreaming && !message.content;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex gap-3 duration-300 motion-reduce:animate-none">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
      >
        <Sparkles className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        {isWaiting ? (
          <ThinkingDots />
        ) : (
          <MarkdownRenderer content={message.content || ""} />
        )}

        {!message.isStreaming && message.content ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <CopyButton
              text={message.content}
              label="Copy"
              ariaLabel="Copy response"
              className="-ml-2"
            />
            {time ? <span>{time}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleBase);