import { useEffect, useRef, useState } from "react";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { MessageBubble } from "./message-bubble";

const STICK_THRESHOLD_PX = 80;

/**
 * Scrollable message area.
 *
 * It follows new text only while the student is reading the bottom. If they
 * scroll up to re-read something, it stops following and shows a
 * "Latest" button instead.
 */
export function ChatThread({
  messages,
  activeId,
  isLoading,
  isSending,
  emptyState,
}) {
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  function scrollToBottom(behavior = "auto") {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTo({ top: element.scrollHeight, behavior });
  }

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;

    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    const atBottom = distance < STICK_THRESHOLD_PX;

    stickToBottomRef.current = atBottom;
    setShowJump(!atBottom);
  }

  // Opening another conversation always starts at the bottom.
  useEffect(() => {
    stickToBottomRef.current = true;
  }, [activeId]);

  // Sending a message always brings the student to the bottom.
  useEffect(() => {
    if (isSending) {
      stickToBottomRef.current = true;
    }
  }, [isSending]);

  useEffect(() => {
    if (stickToBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Conversation"
        className="h-full overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
          {isLoading ? (
            <div
              role="status"
              className="flex flex-1 items-center justify-center py-20"
            >
              <span className="inline-flex items-center gap-2.5 rounded-full bg-muted px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-muted-foreground">
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                Loading conversation…
              </span>
            </div>
          ) : hasMessages ? (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            emptyState
          )}
        </div>
      </div>

      {showJump ? (
        <button
          type="button"
          onClick={() => {
            stickToBottomRef.current = true;
            scrollToBottom("smooth");
          }}
          className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-[0_12px_32px_-12px] shadow-foreground/50 outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-95 motion-reduce:animate-none"
        >
          <ArrowDown aria-hidden="true" className="size-4" />
          Latest
        </button>
      ) : null}
    </div>
  );
}