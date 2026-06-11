import { For } from "solid-js";

const items = ["AMAZON", "FLIPKART", "ROBLOX", "OVERWATCH 2", "SEA OF THIEVES", "LEAGUE OF LEGENDS", "INR", "CRYPTO", "UPI", "USDT TRC20", "USDT ERC20", "INSTANT PAYOUT", "24/7 SUPPORT"];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <section class="relative py-6 border-y border-border/40 overflow-hidden bg-background">
      <div class="flex gap-12 animate-marquee whitespace-nowrap">
        <For each={row}>
          {(t, i) => (
            <div class="flex items-center gap-12 text-xs sm:text-sm font-bold font-display uppercase tracking-widest text-muted-foreground/50">
              <span>{t}</span>
              <span class="text-primary/75">✦</span>
            </div>
          )}
        </For>
      </div>
    </section>
  );
}
export default Marquee;
