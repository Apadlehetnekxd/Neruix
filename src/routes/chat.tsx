import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/site-header";
import { Reveal, RevealText } from "@/components/reveal";
import { Send, Sparkles, Loader2, ArrowDown, Trash2 } from "lucide-react";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Neurix AI Chat — Free conversational AI" },
      {
        name: "description",
        content:
          "Have natural conversations with Neurix AI. Free, fast, and unlimited — no signup required.",
      },
    ],
  }),
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

/** Editorial markdown renderer for assistant replies. */
function MarkdownReply({ text }: { text: string }) {
  return (
    <div className="tf-prose text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showJump, setShowJump] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJump(dist > 200);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setError(null);
      const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
      const assistantId = crypto.randomUUID();
      setMessages((p) => [...p, userMsg, { id: assistantId, role: "assistant", content: "" }]);
      setIsLoading(true);

      try {
        const resp = await fetch("/api/public/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || `Request failed (${resp.status})`);
        }
        if (!resp.body) throw new Error("No response stream");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";
        let done = false;
        while (!done) {
          const { value, done: d } = await reader.read();
          if (d) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line || line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (delta) {
                full += delta;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m))
                );
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages((p) => p.filter((m) => m.id !== assistantId || m.content));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  const suggestions = [
    "Explain quantum computing simply",
    "Write a short poem about the ocean",
    "Plan a 3-day trip to Lisbon",
    "Brainstorm 5 startup ideas",
  ];

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col relative">
      {/* (No ambient orbs — clean canvas) */}
      <SiteHeader />

      <main className="relative flex-1 flex flex-col min-h-0">
        {/* Empty state — full-screen editorial hero */}
        {!hasMessages ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-20">
              <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
                <div className="lg:col-span-8">
                  <Reveal variant="up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground text-sm mb-8">
                      <Sparkles className="size-3.5" />
                      <span className="tf-eyebrow !tracking-[0.18em] !text-foreground">
                        AI Chat · Live
                      </span>
                    </div>
                  </Reveal>
                  <h1 className="tf-display text-foreground text-[clamp(3.5rem,11vw,11rem)]">
                    <Reveal variant="up" delay={0}>
                      <span className="block">Talk to</span>
                    </Reveal>
                    <Reveal variant="up" delay={140}>
                      <span className="block">
                        Neurix<span className="text-highlight">.</span>
                      </span>
                    </Reveal>
                  </h1>
                </div>
                <div className="lg:col-span-4">
                  <RevealText
                    level={3}
                    text="Ask anything. Get clear, considered answers — no fluff, no sign-up."
                    className="tf-display text-2xl md:text-3xl"
                    step={35}
                  />
                </div>
              </div>

              <Reveal variant="up" delay={300}>
                <div className="border-t border-foreground" />
              </Reveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 mt-0">
                {suggestions.map((s, i) => (
                  <Reveal key={s} variant="up" delay={400 + i * 110}>
                    <button
                      onClick={() => send(s)}
                      className="tf-card group relative w-full text-left p-8 lg:p-10 border-r last:border-r-0 border-b md:border-b-0 border-foreground tf-invert-hover"
                    >
                      <div className="tf-eyebrow mb-6">0{i + 1} · Try</div>
                      <div className="tf-display text-2xl md:text-3xl leading-tight">{s}</div>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                        Ask
                        <span
                          className="inline-block transition-transform group-hover:translate-x-1.5"
                          aria-hidden
                        >
                          →
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation — no bubbles, editorial type, one column */
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 lg:px-10 py-14 lg:py-20 space-y-16">
              {messages.map((m, idx) =>
                m.role === "user" ? (
                  <article
                    key={m.id}
                    className="tf-tilt-in"
                    style={{ animationDelay: `${Math.min(idx * 60, 240)}ms` }}
                  >
                    <div className="tf-eyebrow mb-4">You · #{String(idx + 1).padStart(2, "0")}</div>
                    <h2 className="tf-display text-3xl md:text-5xl text-foreground leading-[1.05]">
                      {m.content}
                    </h2>
                  </article>
                ) : (
                  <article
                    key={m.id}
                    className="tf-tilt-in"
                    style={{ animationDelay: `${Math.min(idx * 60, 240)}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="size-2 rounded-full bg-highlight" />
                      <span className="tf-eyebrow">Neurix · Reply</span>
                    </div>
                    {!m.content && isLoading ? (
                      <div className="flex items-center gap-3 text-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        <span className="tf-display text-2xl md:text-3xl">Thinking…</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <MarkdownReply text={m.content} />
                        {isLoading && idx === messages.length - 1 && (
                          <span className="tf-caret inline-block w-[0.55ch] h-[1em] align-[-0.15em] ml-1 bg-foreground" />
                        )}
                      </div>
                    )}
                    <div className="mt-8 border-t border-foreground/20" />
                  </article>
                )
              )}
              {error && (
                <div className="text-base border border-foreground bg-highlight text-foreground px-5 py-4">
                  {error}
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        )}

        {/* Jump-to-bottom */}
        {showJump && hasMessages && (
          <button
            onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="absolute right-6 bottom-32 size-11 rounded-full border border-foreground bg-background tf-invert-hover flex items-center justify-center shadow-md"
            aria-label="Scroll to latest"
          >
            <ArrowDown className="size-4" />
          </button>
        )}

        {/* Composer */}
        <div className="relative border-t border-foreground bg-background/85 backdrop-blur-md">
          <form
            onSubmit={onSubmit}
            className="max-w-4xl mx-auto px-6 lg:px-10 py-5 flex items-end gap-4"
          >
            <div className="flex-1 relative">
              <div className="tf-eyebrow mb-2">Message</div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask anything…"
                className="w-full resize-none bg-transparent border-0 border-b border-foreground px-0 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-highlight transition-colors text-lg md:text-xl tf-display max-h-40"
              />
            </div>
            {hasMessages && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="hidden sm:inline-flex items-center gap-2 px-5 h-12 rounded-full border border-foreground tf-invert-hover text-sm font-medium"
                aria-label="Clear conversation"
              >
                <Trash2 className="size-4" /> Clear
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="tf-cta inline-flex items-center justify-center rounded-full bg-foreground text-background h-12 px-6 shrink-0 disabled:opacity-30 font-medium gap-2"
              aria-label="Send"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
