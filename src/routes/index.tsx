import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, RevealText } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, Code as CodeIcon, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Neurix AI — Free AI, Image Gen, Code Gen" },
      {
        name: "description",
        content:
          "Enterprise-grade AI with unlimited access. Generate images, write code, chat with AI. No signup, no limits, no credit card required.",
      },
      { property: "og:title", content: "Neurix AI — Free AI, Image Gen, Code Gen" },
      {
        property: "og:description",
        content:
          "Enterprise-grade AI with unlimited access. No signup, no limits, no credit card required.",
      },
    ],
  }),
});


function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-semibold tracking-tight text-lg shrink-0">
          Neurix<span className="text-ink-soft">®</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/chat" className="flex items-center gap-2 px-4 h-10 rounded-full text-ink-soft hover:text-foreground hover:bg-cream transition-colors">
            <MessageSquare className="size-4" /> Chat
          </Link>
          <Link to="/coder" className="flex items-center gap-2 px-4 h-10 rounded-full text-ink-soft hover:text-foreground hover:bg-cream transition-colors">
            <CodeIcon className="size-4" /> Coder
          </Link>
          <Link to="/image" className="flex items-center gap-2 px-4 h-10 rounded-full text-ink-soft hover:text-foreground hover:bg-cream transition-colors">
            <ImageIcon className="size-4" /> Image
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/chat"
            className="tf-cta inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 h-10 text-sm font-medium"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col">
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-12 flex flex-col justify-center">
        <div className="flex flex-wrap items-end gap-x-12 gap-y-8">
          <h1 className="tf-display text-foreground text-[clamp(3.5rem,11vw,10rem)] flex-1 min-w-0 break-words">
            <Reveal variant="up" delay={0}>
              <span className="block">
                Free AI<span className="text-ink-soft">,</span>
              </span>
            </Reveal>
            <Reveal variant="up" delay={120}>
              <span className="block">
                Image Gen<span className="text-ink-soft">,</span>
              </span>
            </Reveal>
            <Reveal variant="up" delay={240}>
              <span className="block">
                Code Gen<span className="text-highlight">.</span>
              </span>
            </Reveal>
          </h1>
          <Reveal variant="up" delay={420} className="flex flex-col items-start gap-4 pb-4">
            <Link
              to="/chat"
              className="tf-cta inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 h-16 text-lg font-medium"
            >
              Get started
            </Link>
            <div className="text-sm text-ink-soft">Always free · No signup</div>
          </Reveal>
        </div>

        <Reveal variant="up" delay={520} className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-soft text-sm">
          <span>Available now</span>
          <span className="h-1 w-1 rounded-full bg-ink-soft/60" />
          <span>50+ edge regions</span>
          <span className="h-1 w-1 rounded-full bg-ink-soft/60" />
          <span>Latest AI models</span>
        </Reveal>
      </div>

      {/* Bottom rule — clean separator instead of marquee */}
      <div className="tf-rule border-t border-border shrink-0" />
    </section>
  );
}

function About() {
  const stats = [
    { value: "$0", label: "Forever Free" },
    { value: "<1s", label: "Response Time" },
    { value: "99.9%", label: "Uptime" },
    { value: "0", label: "Data Stored" },
  ];
  return (
    <section className="border-b border-border min-h-screen flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <Reveal variant="up">
              <div className="tf-eyebrow">About</div>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <RevealText
              level={2}
              step={45}
              text="Enterprise-grade AI with unlimited access. Generate images, write code, chat with AI. No signup, no limits, no credit card required."
              className="tf-display text-3xl md:text-5xl lg:text-6xl text-foreground max-w-[20ch]"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 border-t border-border">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              variant="up"
              delay={i * 110}
              className="border-b lg:border-b-0 border-r last:border-r-0 border-border py-10 px-2"
            >
              <div className="tf-display text-5xl md:text-7xl">{s.value}</div>
              <div className="mt-4 tf-eyebrow">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tools() {
  const features = [
    {
      n: "01",
      title: "AI Chat",
      description:
        "Natural conversations with advanced AI. Get help with writing, analysis, brainstorming, and creative tasks.",
      to: "/chat" as const,
      tone: "bg-background text-foreground",
    },
    {
      n: "02",
      title: "Image Generation",
      description:
        "Create stunning visuals from text. Generate art, photos, illustrations, and designs in seconds.",
      to: "/image" as const,
      tone: "bg-cream text-foreground",
    },
    {
      n: "03",
      title: "Coder AI",
      description:
        "Write, debug, and explain code in any language. Professional-grade code assistance powered by AI.",
      to: "/coder" as const,
      tone: "bg-foreground text-background",
    },
  ];
  return (
    <section id="tools" className="border-b border-border">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 pt-24 lg:pt-32 pb-16">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <Reveal variant="up">
              <div className="tf-eyebrow mb-6">What's on</div>
            </Reveal>
            <RevealText
              level={2}
              text="Three powerful tools"
              className="tf-display text-5xl md:text-7xl max-w-[14ch]"
            />
          </div>
          <Reveal variant="up" delay={200}>
            <p className="max-w-md text-ink-soft text-lg">
              Everything you need to create, code, and communicate with AI.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Sticky scroll-stack — each card slides up and pins, the next one
          glides over it like a luxury card-deck */}
      <div className="relative">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="tf-stack-card sticky top-0 h-screen flex items-center"
            style={{
              zIndex: i + 1,
            }}
          >
            <div
              className={`w-full h-full flex items-center border-t border-border ${f.tone}`}
            >
              <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-4">
                  <span className="tf-display text-7xl md:text-9xl leading-none opacity-90">
                    {f.n}
                  </span>
                </div>
                <div className="lg:col-span-7">
                  <h3 className="tf-display text-5xl md:text-7xl lg:text-8xl mb-8">
                    {f.title}
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed max-w-xl opacity-80">
                    {f.description}
                  </p>
                </div>
                <div className="lg:col-span-3 flex lg:justify-end">
                  <Link
                    to={f.to}
                    className="tf-cta inline-flex items-center justify-center gap-3 rounded-full px-8 h-14 text-base font-medium border border-current"
                  >
                    Try it now
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyNeurix() {
  const items = [
    {
      title: "Instant Access",
      description:
        "No signup required. Start using AI immediately without creating an account or entering payment details.",
    },
    {
      title: "Global Edge Network",
      description:
        "Powered by distributed infrastructure across 50+ regions for lightning-fast responses worldwide.",
    },
    {
      title: "Latest AI Models",
      description:
        "Access cutting-edge AI models including GPT-4, FLUX, and custom fine-tuned models for specific tasks.",
    },
    {
      title: "Community Driven",
      description:
        "Built for creators, developers, and innovators. Join thousands of users creating with AI daily.",
    },
  ];
  return (
    <section id="why" className="border-b border-border bg-cream min-h-screen flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal variant="up">
          <div className="tf-eyebrow mb-6">Why choose us</div>
        </Reveal>
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <RevealText
            level={2}
            text="Built for everyone"
            className="tf-display text-5xl md:text-7xl max-w-[16ch]"
          />
          <Reveal variant="up" delay={200}>
            <p className="text-ink-soft text-lg max-w-md">
              Powerful AI tools accessible to all, without barriers or
              limitations.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              variant="up"
              delay={i * 120}
              className="bg-cream"
            >
              <div className="tf-card p-10 lg:p-14 flex gap-8 items-start h-full">
                <span className="tf-display text-2xl text-ink-soft shrink-0 pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="tf-display text-3xl md:text-4xl mb-4">
                    {item.title}
                  </h3>
                  <p className="text-ink-soft text-lg leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const useCases = [
    {
      title: "Content Creators",
      description:
        "Generate blog posts, social media content, scripts, and marketing copy with AI assistance.",
      icon: "✍︎",
    },
    {
      title: "Developers",
      description:
        "Write code faster, debug issues, generate documentation, and learn new frameworks.",
      icon: "❮❯",
    },
    {
      title: "Designers",
      description:
        "Create concept art, illustrations, mockups, and visual content for any project.",
      icon: "✦",
    },
    {
      title: "Students",
      description:
        "Get help with research, explanations, study guides, and learning complex topics.",
      icon: "✱",
    },
    {
      title: "Entrepreneurs",
      description:
        "Build MVPs, create business plans, generate marketing materials, and automate tasks.",
      icon: "▲",
    },
    {
      title: "Researchers",
      description:
        "Analyze data, summarize papers, explore ideas, and accelerate your research workflow.",
      icon: "◐",
    },
  ];
  return (
    <section id="use-cases" className="border-b border-border min-h-screen flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Reveal variant="up">
          <div className="tf-eyebrow mb-6">Use cases</div>
        </Reveal>
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <RevealText
            level={2}
            text="Made for creators"
            className="tf-display text-5xl md:text-7xl max-w-[14ch]"
          />
          <Reveal variant="up" delay={200}>
            <p className="text-ink-soft text-lg max-w-md">
              From students to professionals, Neurix AI empowers everyone.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {useCases.map((u, i) => (
            <Reveal
              key={u.title}
              variant="up"
              delay={(i % 3) * 120}
              className="bg-background"
            >
              <div className="tf-card p-8 lg:p-10 hover:bg-cream h-full">
                <div className="text-3xl mb-8 text-foreground">{u.icon}</div>
                <h3 className="tf-display text-2xl md:text-3xl mb-3">{u.title}</h3>
                <p className="text-ink-soft leading-relaxed">{u.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-b border-border bg-foreground text-background min-h-screen flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="text-center mb-16">
          <Reveal variant="up">
            <div
              className="tf-eyebrow mb-6"
              style={{ color: "color-mix(in oklab, var(--background) 65%, transparent)" }}
            >
              How it works
            </div>
          </Reveal>
          <RevealText
            level={2}
            text="Simple. Powerful. Free."
            className="tf-display text-5xl md:text-7xl"
          />
        </div>

        <Reveal variant="scale" delay={120} className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/15">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/30">
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-white/20" />
              <span className="size-3 rounded-full bg-white/20" />
              <span className="size-3 rounded-full bg-white/20" />
            </div>
            <div className="flex-1 text-center text-xs font-mono opacity-60">
              neurix-terminal
            </div>
          </div>
          <div
            className="p-6 md:p-8 font-mono text-sm space-y-3"
            style={{ background: "color-mix(in oklab, black 50%, var(--foreground))" }}
          >
            <div>
              <span className="text-highlight">$</span>{" "}
              <span className="opacity-90">neurix --help</span>
            </div>
            <div className="opacity-60 pl-4 space-y-1">
              <p>Usage: neurix [command] [options]</p>
              <p className="pt-2">Commands:</p>
              <p className="pl-4">chat&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Start an AI conversation</p>
              <p className="pl-4">image&nbsp;&nbsp;&nbsp;&nbsp; Generate images from text</p>
              <p className="pl-4">code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Get coding assistance</p>
            </div>
            <div className="pt-2">
              <span className="text-highlight">$</span>{" "}
              <span className="opacity-90">neurix chat "Hello, Neurix!"</span>
            </div>
            <div className="opacity-80 pl-4">
              <p className="text-highlight">[NEURIX]</p>
              <p>Hello! I'm Neurix, your free AI assistant.</p>
              <p>How can I help you today?</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-highlight">$</span>
              <span className="tf-blink inline-block w-2 h-4 bg-background/80" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="start" className="border-b border-border min-h-screen flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-28 lg:py-40 text-center">
        <RevealText
          level={2}
          text="Start Creating"
          className="tf-display text-6xl md:text-8xl lg:text-9xl"
        />
        <RevealText
          level={3}
          text="Right Now"
          delay={120}
          className="tf-display text-6xl md:text-8xl lg:text-9xl text-ink-soft"
        />
        <Reveal variant="up" delay={400}>
          <p className="mt-10 text-lg text-ink-soft max-w-xl mx-auto">
            No signup required. No credit card needed. Just pure AI power at
            your fingertips.
          </p>
        </Reveal>
        <Reveal variant="up" delay={520} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chat"
            className="tf-cta inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 h-14 text-base font-medium"
          >
            Get Started Free →
          </Link>
          <Link
            to="/image"
            className="tf-cta inline-flex items-center justify-center rounded-full border border-border bg-background text-foreground px-8 h-14 text-base font-medium hover:bg-cream"
          >
            Generate Images
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <Link to="/" className="font-semibold tracking-tight text-lg">
            Neurix<span className="text-ink-soft">®</span>
          </Link>
          <nav className="flex gap-8 text-sm text-ink-soft">
            <Link to="/chat" className="tf-link hover:text-foreground transition">Chat</Link>
            <Link to="/image" className="tf-link hover:text-foreground transition">Image</Link>
            <Link to="/coder" className="tf-link hover:text-foreground transition">Coder</Link>
          </nav>
          <p className="text-sm text-ink-soft">
            Free AI for everyone. No limits.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  useEffect(() => {
    if (window.location.hash !== "#start") return;

    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", cleanUrl);

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <About />
      <Tools />
      <WhyNeurix />
      <UseCases />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
