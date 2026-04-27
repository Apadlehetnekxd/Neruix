import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/image")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { prompt } = await request.json();
          if (!prompt || typeof prompt !== "string") {
            return new Response(
              JSON.stringify({ error: "Prompt is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const response = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-image",
                messages: [{ role: "user", content: prompt }],
                modalities: ["image", "text"],
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
            console.error("Image gen error:", response.status, errText);
            return new Response(
              JSON.stringify({ error: "Image generation failed" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const data = await response.json();
          // Lovable AI returns the image as a data URL in message.images[0].image_url.url
          const imageUrl: string | undefined =
            data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!imageUrl) {
            console.error("No image returned", JSON.stringify(data).slice(0, 500));
            return new Response(
              JSON.stringify({ error: "No image returned by model" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(JSON.stringify({ image: imageUrl }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("image handler error", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
} as any);
