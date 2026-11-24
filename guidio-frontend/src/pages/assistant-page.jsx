import { useState } from "react";
import { History, Plus, X } from "lucide-react";
import { AiErrorNotice } from "@/components/common/ai-error-notice";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatComposer } from "@/features/assistant/chat-composer";
import { ChatEmptyState } from "@/features/assistant/chat-empty-state";
import { ChatThread } from "@/features/assistant/chat-thread";
import { ConversationList } from "@/features/assistant/conversation-list";
import { useAssistant } from "@/features/assistant/use-assistant";

function AssistantPage() {
  const assistant = useAssistant();
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    conversations,
    listStatus,
    activeId,
    activeTitle,
    messages,
    isLoadingMessages,
    isSending,
    draft,
    sendError,
    pageError,
    cooldown,
  } = assistant;

  function handleSelect(id) {
    setHistoryOpen(false);
    assistant.selectConversation(id);
  }

  function handleNewChat() {
    setHistoryOpen(false);
    assistant.startNewChat();
  }

  const listProps = {
    conversations,
    status: listStatus,
    activeId,
    disabled: isSending,
    onSelect: handleSelect,
    onDelete: assistant.deleteConversation,
    onNewChat: handleNewChat,
    onRetry: assistant.retryConversationList,
  };

  return (
    /* Framed like the landing preview. The height leaves room for the
       header and the page padding from AppLayout. */
    <div className="h-[calc(100dvh-6.5rem)] min-h-[26rem] rounded-[1.5rem] border border-foreground/10 bg-muted/40 p-1.5 sm:h-[calc(100dvh-7.5rem)] sm:rounded-[2rem] sm:p-2 lg:h-[calc(100dvh-8.5rem)]">
      <div className="flex h-full overflow-hidden rounded-[1.1rem] border border-foreground/10 bg-background sm:rounded-[1.5rem]">
        {/* Chat history: fixed column on large screens */}
        <aside className="hidden w-72 shrink-0 border-r border-foreground/10 bg-muted/50 lg:block">
          <ConversationList {...listProps} />
        </aside>

        {/* Chat history: slide-in panel on smaller screens */}
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="gap-0 border-foreground/10 bg-muted/95 p-0 backdrop-blur-[20px] backdrop-saturate-[1.8] data-[side=left]:w-[85vw] lg:hidden"
          >
            <SheetTitle className="sr-only">Chat history</SheetTitle>
            <SheetDescription className="sr-only">
              Your previous conversations with the AI Student Assistant.
            </SheetDescription>

            <ConversationList
              {...listProps}
              onClose={() => setHistoryOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-foreground/10 px-3 py-2.5 sm:px-4">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={() => setHistoryOpen(true)}
              aria-label="Open chat history"
              className="rounded-full bg-muted lg:hidden"
            >
              <History aria-hidden="true" />
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold tracking-tight">
                AI Student Assistant
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {activeTitle || "New conversation"}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleNewChat}
              disabled={isSending}
              className="rounded-full bg-muted px-4 lg:hidden"
            >
              <Plus aria-hidden="true" />
              <span className="hidden sm:inline">New chat</span>
              <span className="sr-only sm:hidden">New chat</span>
            </Button>
          </div>

          <ChatThread
            messages={messages}
            activeId={activeId}
            isLoading={isLoadingMessages}
            isSending={isSending}
            emptyState={
              <ChatEmptyState
                onPick={(prompt) => assistant.sendMessage(prompt)}
                disabled={isSending || cooldown.isCoolingDown}
              />
            }
          />

          {pageError || sendError ? (
            <div className="mx-auto w-full max-w-3xl space-y-2 px-3 pb-3 sm:px-4">
              {pageError ? (
                <div
                  role="alert"
                  className="relative rounded-[1.5rem] bg-destructive/10 py-4 pl-5 pr-14 text-sm leading-6 text-destructive"
                >
                  {pageError}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={assistant.dismissPageError}
                    aria-label="Dismiss message"
                    className="absolute right-2.5 top-2.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
              ) : null}

              {sendError ? (
                <AiErrorNotice
                  error={sendError}
                  onRetry={draft.trim() ? () => assistant.sendMessage() : undefined}
                  cooldownSeconds={cooldown.remaining}
                />
              ) : null}
            </div>
          ) : null}

          <ChatComposer
            value={draft}
            onChange={assistant.setDraft}
            onSend={() => assistant.sendMessage()}
            isSending={isSending}
            cooldownSeconds={cooldown.remaining}
          />
        </section>
      </div>
    </div>
  );
}

export default AssistantPage;