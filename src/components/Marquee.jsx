import React from 'react';

const items = ["AMAZON", "FLIPKART", "ROBLOX", "OVERWATCH 2", "SEA OF THIEVES", "LEAGUE OF LEGENDS", "INR", "CRYPTO", "UPI", "USDT TRC20", "USDT ERC20", "INSTANT PAYOUT", "24/7 SUPPORT"];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <section className="relative py-12 border-y border-border/40 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-12 text-xs sm:text-sm font-bold font-display uppercase tracking-widest text-muted-foreground/50">
            <span>{t}</span>
            <span className="text-primary/75">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Marquee;
