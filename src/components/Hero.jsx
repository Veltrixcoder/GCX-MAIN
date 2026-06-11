import { createSignal, onSettled } from "solid-js";

export function Hero() {
  return (
    <section class="relative min-h-[75vh] pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden flex items-center justify-center bg-background text-center">
      <div class="absolute inset-0 grid-bg pointer-events-none" />

      <div class="relative mx-auto max-w-4xl px-4 flex flex-col items-center">
        {/* Secure badge */}
        <div class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold tracking-wider font-mono text-muted-foreground mb-8">
          <span class="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Secure payouts · 24/7
        </div>

        {/* Headline */}
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black font-display leading-[1.1] mb-6 max-w-3xl text-foreground">
          Turn gift cards into <span class="text-gradient">real cash</span>.
        </h1>

        {/* Subtitle */}
        <p class="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          GCX converts your unused Amazon, Flipkart, Roblox, Overwatch 2, Sea of Thieves & League of Legends gift cards into UPI, USDT, or another gift card of equivalent value — securely.
        </p>

        {/* Call to Actions */}
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16">
          <a
            href="https://wa.me/919120138828"
            target="_blank"
            rel="noopener noreferrer"
            class="relative overflow-hidden rounded-full bg-primary text-black font-bold px-8 py-4 text-sm hover:bg-accent transition-all duration-300 text-center block sm:inline-block w-full sm:w-auto shadow-md"
          >
            <span class="relative z-10">Start a trade →</span>
          </a>
          <a
            href="#how"
            class="rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold hover:bg-secondary transition text-center block sm:inline-block w-full sm:w-auto text-foreground"
          >
            How it works
          </a>
        </div>

        {/* Stats Section */}
        <div class="grid grid-cols-2 gap-y-6 gap-x-8 sm:flex sm:items-center sm:gap-16 text-xs text-muted-foreground w-full justify-center max-w-2xl border-t border-border/40 pt-10">
          <Stat value="5 days" label="Avg payout" />
          <Stat value="Upto ₹3L" label="Card processed" />
          <Stat value="₹5Lakh+" label="Paid out" />
          <Stat value="4.9★" label="User rating" />
        </div>
      </div>
    </section>
  );
}

function Stat(props) {
  return (
    <div class="text-center">
      <div class="text-sm sm:text-base font-black font-display text-foreground leading-none mb-1.5">{props.value}</div>
      <div class="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/80">{props.label}</div>
    </div>
  );
}

export default Hero;
