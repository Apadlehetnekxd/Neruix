import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Reveal, RevealText } from "@/components/reveal";
import {
  ImageIcon,
  Sparkles,
  Download,
  Loader2,
  X,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/image")({
  component: ImagePage,
  head: () => ({
    meta: [
      { title: "Neurix Image Gen — Free AI image generator" },
      {
        name: "description",
        content:
          "Turn text into stunning images. Free AI image generation by Neurix.",
      },
    ],
  }),
});

const stylePresets = [
  { name: "Photoreal", desc: "photorealistic, ultra realistic, DSLR quality, 8k, sharp focus, natural lighting" },
  { name: "Cinematic", desc: "cinematic still, film grain, dramatic lighting, anamorphic, Roger Deakins" },
  { name: "Editorial", desc: "editorial photography, magazine spread, minimalist composition, fine art" },
  { name: "Digital", desc: "digital art, vibrant digital painting, trending on artstation" },
  { name: "Oil", desc: "oil painting, traditional art, expressive brush strokes, museum quality" },
  { name: "Anime", desc: "anime style, japanese animation, cel shaded, studio ghibli inspired" },
  { name: "Cyber", desc: "cyberpunk, neon lights, futuristic, dystopian, blade runner aesthetic" },
  { name: "Fantasy", desc: "fantasy art, magical, ethereal, epic, highly detailed" },
  { name: "Minimal", desc: "minimalist, clean, geometric, negative space, elegant" },
  { name: "Watercolor", desc: "watercolor painting, soft pigments, paper texture, flowing color" },
];

const inspirationPrompts = [
  "A lone astronaut walking through a field of glowing flowers at dusk",
  "Brutalist concrete cathedral with stained glass at golden hour",
  "Macro photo of a hummingbird mid-flight, droplets suspended in air",
  "Editorial portrait of a woman wearing translucent silk, soft window light",
];

type Generated = { id: string; image: string; prompt: string };

function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<Generated[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Generated | null>(null);
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  const generate = async (rawPrompt?: string) => {
    const seed = (rawPrompt ?? prompt).trim();
    if (!seed || isGenerating) return;
    setError(null);
    setIsGenerating(true);
    let full = seed;
    if (style) {
      const s = stylePresets.find((x) => x.name === style);
      if (s) full += `, ${s.desc}`;
    }
    try {
      const resp = await fetch("/api/public/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: full }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate image");
      }
      const data = await resp.json();
      const newImg = { id: crypto.randomUUID(), image: data.image, prompt: full };
      setImages((p) => [newImg, ...p]);
      setFeaturedId(newImg.id);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const download = (img: Generated) => {
    const a = document.createElement("a");
    a.href = img.image;
    a.download = `neurix-${img.id}.png`;
    a.click();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col">
        {/* Stats strip */}
        <div className="border-b border-border bg-cream">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <ImageIcon className="size-4" />
              <span className="tf-eyebrow">Neurix · Image studio</span>
            </div>
            <div className="text-ink-soft hidden sm:flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-foreground/40" />
              {images.length} {images.length === 1 ? "render" : "renders"} this session
            </div>
          </div>
        </div>

        {/* Gallery / Empty state */}
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 lg:py-16 pb-44">
            {images.length === 0 && !isGenerating ? (
              <div className="min-h-[68vh] flex flex-col">
                <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
                  <div className="lg:col-span-8">
                    <Reveal variant="up">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground text-sm mb-8">
                        <Sparkles className="size-3.5" />
                        <span className="tf-eyebrow !tracking-[0.18em] !text-foreground">
                          Image Studio · Live
                        </span>
                      </div>
                    </Reveal>
                    <h1 className="tf-display text-foreground text-[clamp(3.5rem,11vw,11rem)] leading-[0.95]">
                      <Reveal variant="up" delay={0}>
                        <span className="block">Imagine it</span>
                      </Reveal>
                      <Reveal variant="up" delay={140}>
                        <span className="block">
                          See it<span className="text-highlight">.</span>
                        </span>
                      </Reveal>
                    </h1>
                  </div>
                  <div className="lg:col-span-4">
                    <RevealText
                      level={3}
                      text="Describe anything you can picture. Neurix renders it in seconds — no signup, no watermark."
                      className="tf-display text-2xl md:text-3xl"
                      step={35}
                    />
                  </div>
                </div>

                <Reveal variant="up" delay={300}>
                  <div className="border-t border-foreground" />
                </Reveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 mt-0">
                  {inspirationPrompts.map((p, i) => (
                    <Reveal key={p} variant="up" delay={400 + i * 110}>
                      <button
                        onClick={() => generate(p)}
                        className="tf-card group relative w-full text-left p-8 lg:p-10 border-r last:border-r-0 border-b md:border-b-0 border-foreground tf-invert-hover h-full"
                      >
                        <div className="tf-eyebrow mb-6">0{i + 1} · Try</div>
                        <div className="tf-display text-xl md:text-2xl leading-tight">
                          {p}
                        </div>
                        <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                          Render
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
            ) : (
              <FeaturedGallery
                images={images}
                isGenerating={isGenerating}
                featuredId={featuredId}
                setFeaturedId={setFeaturedId}
                onOpen={setLightbox}
                onDownload={download}
              />
            )}
          </div>
        </div>

        {/* Sticky command bar */}
        <div className="sticky bottom-0 border-t border-border bg-background/85 backdrop-blur-xl">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4">
            {/* Style chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
              <span className="tf-eyebrow shrink-0 mr-2">Style</span>
              <button
                onClick={() => setStyle(null)}
                className={cn(
                  "shrink-0 px-3.5 h-8 rounded-full border text-xs font-medium transition-all",
                  style === null
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-ink-soft hover:text-foreground hover:border-foreground"
                )}
              >
                None
              </button>
              {stylePresets.map((s) => {
                const active = style === s.name;
                return (
                  <button
                    key={s.name}
                    onClick={() => setStyle(active ? null : s.name)}
                    className={cn(
                      "shrink-0 px-3.5 h-8 rounded-full border text-xs font-medium transition-all",
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-ink-soft hover:text-foreground hover:border-foreground"
                    )}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>

            {/* Prompt input */}
            <div className="flex items-end gap-3 border border-border focus-within:border-foreground transition-colors p-2 pl-4 rounded-2xl bg-background">
              <Sparkles className="size-4 mb-3 shrink-0 text-ink-soft" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Describe an image…  (Enter to render)"
                className="flex-1 resize-none bg-transparent border-0 px-0 py-2.5 text-foreground placeholder:text-ink-soft/60 focus:outline-none text-base max-h-32"
              />
              <button
                onClick={() => generate()}
                disabled={!prompt.trim() || isGenerating}
                className="tf-cta inline-flex items-center justify-center rounded-xl bg-foreground text-background size-10 shrink-0 disabled:opacity-30"
                aria-label="Render"
              >
                {isGenerating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 text-sm border border-destructive/40 bg-destructive/10 text-destructive px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 size-10 rounded-full border border-background/50 text-background hover:bg-background hover:text-foreground transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div
            className="max-w-6xl max-h-[90vh] flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={lightbox.prompt}
              className="max-h-[80vh] w-auto mx-auto border border-background/30 rounded-lg"
            />
            <div className="flex items-center justify-between gap-6 text-background">
              <p className="text-sm opacity-80 truncate flex-1">{lightbox.prompt}</p>
              <button
                onClick={() => download(lightbox)}
                className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-background hover:bg-background hover:text-foreground transition-colors text-sm font-medium"
              >
                <Download className="size-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedGallery({
  images,
  isGenerating,
  featuredId,
  setFeaturedId,
  onOpen,
  onDownload,
}: {
  images: Generated[];
  isGenerating: boolean;
  featuredId: string | null;
  setFeaturedId: (id: string) => void;
  onOpen: (img: Generated) => void;
  onDownload: (img: Generated) => void;
}) {
  const featured =
    images.find((i) => i.id === featuredId) ?? images[0] ?? null;

  return (
    <div className="space-y-8">
      {/* HERO — currently selected (or generating) */}
      <div className="relative">
        {isGenerating ? (
          <div className="w-full aspect-[16/10] rounded-2xl border border-border bg-gradient-to-br from-cream to-background flex flex-col items-center justify-center gap-5 relative overflow-hidden">
            <div className="absolute inset-0 tf-shimmer pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <Loader2 className="size-8 animate-spin text-foreground" />
              <span className="tf-eyebrow">Rendering…</span>
            </div>
          </div>
        ) : featured ? (
          <figure
            className="group relative rounded-2xl overflow-hidden border border-border bg-cream cursor-zoom-in"
            onClick={() => onOpen(featured)}
          >
            <img
              src={featured.image}
              alt={featured.prompt}
              className="w-full max-h-[78vh] object-contain bg-cream block"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 lg:p-6 bg-gradient-to-t from-foreground/95 via-foreground/60 to-transparent text-background flex items-end justify-between gap-6">
              <p className="text-sm lg:text-base line-clamp-2 max-w-3xl leading-relaxed">
                {featured.prompt}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(featured);
                }}
                className="shrink-0 inline-flex items-center gap-2 px-4 h-10 rounded-full border border-background/60 text-xs font-medium hover:bg-background hover:text-foreground transition-colors"
              >
                <Download className="size-3.5" /> Save
              </button>
            </figcaption>
          </figure>
        ) : null}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div>
          <div className="tf-eyebrow mb-4">
            History · {images.length}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {images.map((img) => {
              const active = (featured?.id ?? null) === img.id;
              return (
                <button
                  key={img.id}
                  onClick={() => setFeaturedId(img.id)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border transition-all",
                    active
                      ? "border-foreground ring-2 ring-highlight"
                      : "border-border hover:border-foreground opacity-70 hover:opacity-100"
                  )}
                  title={img.prompt}
                >
                  <img
                    src={img.image}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
