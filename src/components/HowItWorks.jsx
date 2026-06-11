import { For } from "solid-js";
import { Dynamic } from "solid-js/web";
import { TiltCard } from "./TiltCard";
import { CreditCard, Users, Coins } from "lucide-solid";

const STEPS = [
  {
    num: "01",
    icon: CreditCard,
    iconClass: "text-primary h-6 w-6",
    title: "Submit Your Card",
    desc: "Provide your unused Amazon, Flipkart, or gaming gift cards. Our secure system processes the card credentials in seconds.",
    glow: "rgba(255, 74, 74, 0.15)",
    borderGlow: "rgba(255, 74, 74, 0.3)"
  },
  {
    num: "02",
    icon: Users,
    iconClass: "text-rose-400 h-6 w-6",
    title: "We Match & Sell",
    desc: "We securely list and sell the cards to verified buyers who need them, operating as a trusted, high-volume brokerage.",
    glow: "rgba(244, 63, 94, 0.15)",
    borderGlow: "rgba(244, 63, 94, 0.3)"
  },
  {
    num: "03",
    icon: Coins,
    iconClass: "text-amber-400 h-6 w-6",
    title: "Get Paid minus Brokerage",
    desc: "Once the card is redeemed by the buyer, we take a minor brokerage fee and instantly transfer the remaining funds to your UPI or USDT wallet.",
    glow: "rgba(245, 158, 11, 0.15)",
    borderGlow: "rgba(245, 158, 11, 0.3)"
  }
];

export function HowItWorks() {
  return (
    <section id="how" class="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div class="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <p class="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">The Process</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
            How it works
          </h2>
          <p class="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            We act as a secure bridge between cardholders and buyers, taking care of the escrow and payout logistics.
          </p>
        </div>

        {/* Steps Grid */}
        <div class="grid md:grid-cols-3 gap-8 relative z-10">
          <For each={STEPS}>
            {(step) => (
              <TiltCard
                class="liquid-glass rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 border border-border/60 group hover:border-border/85 hover:bg-[#121215]"
                intensity={10}
              >
                <div class="relative flex flex-col h-full" style={{ "transform-style": "preserve-3d" }}>
                  {/* Top Segment: Step number + Icon */}
                  <div class="flex items-center justify-between mb-8" style={{ transform: "translateZ(30px)" }}>
                    <div class="h-12 w-12 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                      <Dynamic component={step.icon} class={step.iconClass} />
                    </div>
                    <span class="text-3xl sm:text-4xl font-bold font-mono text-muted-foreground/30 tracking-tight group-hover:text-primary transition-all duration-500">
                      {step.num}
                    </span>
                  </div>

                  {/* Body Segment: Title + Description */}
                  <div class="mt-4" style={{ transform: "translateZ(20px)" }}>
                    <h3 class="text-lg sm:text-xl font-bold font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
