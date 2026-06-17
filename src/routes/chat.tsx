import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { PageHeader, ToolShell } from "@/components/tool-shell";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — ThriveDesk" },
      { name: "description", content: "Chat with ThriveDesk's AI assistant in real time." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [input, setInput] = useState("");
  const initial: UIMessage[] = [];
  const { messages, sendMessage, status } = useChat({
    id: "thrivedesk-chat",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error(err);
      toast.error("Chat error. Please try again.");
    },
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <ToolShell>
      <PageHeader
        title="AI Chatbot"
        description="A friendly assistant for quick questions, brainstorming, and drafting."
        icon={MessageSquare}
        accent="rose"
      />

      <div className="flex h-[60vh] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pastel-rose to-pastel-peach text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <p className="font-medium text-foreground">Say hello 👋</p>
                <p className="mt-1">Ask anything — drafts, ideas, explanations.</p>
              </div>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] text-sm text-foreground"
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <article className="prose prose-sm max-w-none">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </article>
                  )}
                </div>
              </div>
            );
          })}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="flex items-end gap-2 border-t bg-background/60 p-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Message ThriveDesk..."
            rows={1}
            className="min-h-[44px] resize-none"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <ResponsibleAi />
    </ToolShell>
  );
}
