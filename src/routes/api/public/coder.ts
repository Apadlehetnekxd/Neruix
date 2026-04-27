import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/coder")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages, language } = await request.json();
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const lang = typeof language === "string" && language ? language : "the requested language";
          const systemPrompt = `You are an expert ${lang} developer. Generate clean, well-commented, production-ready code. Respond ONLY with a single fenced code block (\`\`\`${lang}\\n...\\n\`\`\`) and nothing else.`;

          const response = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                messages: [
                  { role: "system", content: systemPrompt },
                  ...messages,
                ],
                stream: true,
              }),
            }
          );

          if (!response.ok) {
            if (response.status === 429) {
              return new Response(
                JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
                { status: 429, headers: { "Content-Type": "application/json" } }
              );
            }
            if (response.status === 402) {
              return new Response(
                JSON.stringify({ error: "Out of AI credits. Please top up your Lovable AI workspace." }),
                { status: 402, headers: { "Content-Type": "application/json" } }
              );
            }
            const errText = await response.text();
            console.error("Coder AI error:", response.status, errText);
            return new Response(
              JSON.stringify({ error: "AI gateway error" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
          });
        } catch (e) {
          console.error("coder handler error", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
} as any);
