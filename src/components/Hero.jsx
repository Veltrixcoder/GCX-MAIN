import { createSignal, onSettled } from "solid-js";
import RevolvingCards from "./RevolvingCards";

export function Hero() {
  const [mouse, setMouse] = createSignal({ x: 0, y: 0 });

  onSettled(() => {
    const onMove = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  });

  const rotateX = () => mouse().y * -20;
  const rotateY = () => mouse().x * 30;
  const tx = () => mouse().x * -60;
  const ty = () => mouse().y * -40;

  return (
    <section class="relative min-h-[80vh] pt-20 pb-8 md:pt-28 md:pb-12 overflow-hidden flex items-center">
      <div class="absolute inset-0 grid-bg pointer-events-none" />
      <div class="absolute inset-0 [background:var(--gradient-hero)] pointer-events-none" />

      {/* Animated blob orbs */}
      <div
        style={{
          transform: `translate(${tx()}px, ${ty()}px)`
        }}
        class="absolute top-1/4 -left-20 h-80 w-80 bg-primary/30 blur-[110px] animate-blob transition-transform duration-300 ease-out"
      />
      <div
        style={{
          transform: `translate(${mouse().x * 60}px, ${mouse().y * 40}px)`
        }}
        class="absolute bottom-1/4 -right-20 h-[28rem] w-[28rem] bg-accent/30 blur-[140px] animate-blob transition-transform duration-300 ease-out"
      />
      <div
        style={{
          transform: `translate(${mouse().x * -30}px, ${mouse().y * -20}px)`
        }}
        class="absolute top-1/2 left-1/2 -translate-x-1/2 h-72 w-72 bg-[var(--neon)]/20 blur-[100px] animate-pulse-glow transition-transform duration-300 ease-out"
      />

      <div class="relative mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <div class="text-center lg:text-left flex flex-col items-center lg:items-start">
          <div class="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-bold tracking-wider font-mono text-muted-foreground mb-6">
            <span class="h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse" />
            Secure payouts · 24/7
          </div>
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.15] lg:leading-[1.1] mb-6 max-w-2xl text-foreground">
            Turn gift cards into <span class="text-gradient animate-gradient">real cash</span>.
          </h1>
          <p class="text-base sm:text-lg text-muted-foreground max-w-xl mb-8">
            GCX converts your unused Amazon, Flipkart, Roblox, Overwatch 2, Sea of Thieves & League of Legends gift cards into UPI, USDT, or
            another gift card of equivalent value — securely.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
            <a
              href="https://wa.me/919120138828"
              target="_blank"
              rel="noopener noreferrer"
              class="relative overflow-hidden rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md px-6 py-3.5 text-sm font-semibold hover:scale-105 transition-all duration-300 glow-ring group text-center block sm:inline-block w-full sm:w-auto"
            >
              <span class="relative z-10">Start a trade →</span>
              <span class="absolute inset-0 shine opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href="#how"
              class="rounded-xl liquid-glass px-6 py-3.5 text-sm font-semibold hover:bg-secondary/40 transition text-center block sm:inline-block w-full sm:w-auto text-foreground"
            >
              How it works
            </a>
          </div>
          <div class="mt-10 grid grid-cols-2 gap-y-6 gap-x-4 sm:flex sm:items-center sm:gap-10 text-xs text-muted-foreground w-full justify-items-center max-w-lg mx-auto lg:mx-0">
            <Stat value="5 days" label="Avg payout" />
            <Stat value="Upto ₹3L" label="Card processed" />
            <Stat value="₹5Lakh+" label="Paid out" />
            <Stat value="4.9★" label="User rating" />
          </div>
        </div>

        <div
          style={{
            transform: `rotateX(${rotateX()}deg) rotateY(${rotateY()}deg)`,
            "transform-style": "preserve-3d"
          }}
          class="relative h-[75vw] md:h-[50vw] lg:h-[33vw] 2xl:h-[530px] flex items-center justify-center [perspective:1400px] z-10 w-full overflow-visible transition-transform duration-300 ease-out"
        >
          <RevolvingCards />
        </div>
      </div>
    </section>
  );
}

function Stat(props) {
  return (
    <div class="text-center lg:text-left">
      <div class="text-sm sm:text-base font-black font-display text-foreground leading-none mb-1.5">{props.value}</div>
      <div class="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/80">{props.label}</div>
    </div>
  );
}

export default Hero;
