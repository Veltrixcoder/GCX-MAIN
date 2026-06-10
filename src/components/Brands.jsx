import { createSignal, onSettled, For, Show } from "solid-js";
import { TiltCard } from "./TiltCard";
import { ChevronDown, ChevronUp } from "lucide-solid";

import amazonCard from "../assets/images/card-amazon-pkV6XfjL.png";
import flipkartCard from "../assets/images/card-flipkart-SeEfOOvb.png";
import robloxCard from "../assets/images/card-roblox-Cn_R-R5S.png";
import lolCard from "../assets/images/card-lol-eD770gql.png";
import overwatchCard from "../assets/images/overwatch2.png";
import sotCard from "../assets/images/sot.png";

const imgMap = {
  amazon: amazonCard,
  flipkart: flipkartCard,
  roblox: robloxCard,
  lol: lolCard,
  overwatch: overwatchCard,
  sot: sotCard,
};

const getCardImage = (imgSrc) => imgMap[imgSrc] || imgSrc;

const fallbackBrands = [
  { id: "amazon",   name: "Amazon",            img: "amazon",    tag: "Shopping", rate: "100 INR / 0.91 USDT", glow: "rgba(255, 153, 0, 0.4)",   variants: [{ name: "arena100", inr_rate: "100 INR", usdt_rate: "0.91 USDT" }] },
  { id: "flipkart", name: "Flipkart",          img: "flipkart",  tag: "Shopping", rate: "90 INR",              glow: "rgba(40, 116, 240, 0.4)",   variants: [{ name: "e-Gift Voucher", inr_rate: "90 INR", usdt_rate: null }] },
  { id: "roblox",   name: "Roblox",            img: "roblox",    tag: "Gaming",   rate: "88 USDT",             glow: "rgba(239, 68, 68, 0.4)",    variants: [{ name: "Gift Card", inr_rate: null, usdt_rate: "88 USDT" }] },
  { id: "lol",      name: "League of Legends", img: "lol",       tag: "Gaming",   rate: "86 USDT",             glow: "rgba(197, 168, 128, 0.35)", variants: [{ name: "RP Gift Card", inr_rate: null, usdt_rate: "86 USDT" }] },
  { id: "overwatch",name: "Overwatch 2",       img: "overwatch", tag: "Gaming",   rate: "84 USDT",             glow: "rgba(240, 100, 20, 0.4)",   variants: [{ name: "Coins Gift Card", inr_rate: null, usdt_rate: "84 USDT" }] },
  { id: "sot",      name: "Sea of Thieves",    img: "sot",       tag: "Gaming",   rate: "82 USDT",             glow: "rgba(16, 185, 129, 0.4)",   variants: [{ name: "Coins Pack", inr_rate: null, usdt_rate: "82 USDT" }] },
];

export function Brands() {
  const [brands, setBrands] = createSignal([]);
  const [expandedCardId, setExpandedCardId] = createSignal(null);

  onSettled(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/cards");
        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        } else {
          setBrands(fallbackBrands);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic card rates, using fallback.", err);
        setBrands(fallbackBrands);
      }
    };
    fetchBrands();
  });

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId() === id ? null : id);
  };

  return (
    <section id="brands" class="relative py-10 sm:py-14 overflow-hidden">
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div class="relative mx-auto max-w-7xl px-4">

        <div class="text-center mb-6 sm:mb-8">
          <p class="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3">Accepted cards</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-foreground leading-tight">
            We take the cards <span class="text-gradient">you actually own</span>
          </h2>
          <p class="text-xs text-muted-foreground mt-3 font-mono">Click on any card to view detailed variant payout rates</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={brands()}>
            {(b) => {
              const cardId = b.id || b.name;
              const isExpanded = () => expandedCardId() === cardId;

              return (
                <div
                  onClick={() => toggleExpand(cardId)}
                  class="cursor-pointer h-full"
                >
                  <TiltCard class="liquid-glass rounded-[2rem] p-6 h-full overflow-hidden flex flex-col justify-between border border-border/60 hover:border-border/90 hover:bg-foreground/[0.01] transition-all duration-300">
                    <div>
                      <div
                        class="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-40 pointer-events-none"
                        style={{ background: b.glow }}
                      />

                      {/* Image container */}
                      <div class="relative h-40 mb-4 grid place-items-center" style={{ transform: "translateZ(40px)" }}>
                        <img
                          src={getCardImage(b.img)}
                          alt={`${b.name} gift card`}
                          loading="lazy"
                          width={448}
                          height={288}
                          class="max-h-full w-auto object-contain drop-shadow-2xl"
                        />
                      </div>

                      {/* Header details */}
                      <div class="relative" style={{ transform: "translateZ(20px)" }}>
                        <div class="flex items-center justify-between mb-3">
                          <h3 class="text-base sm:text-lg font-bold font-display text-foreground">{b.name}</h3>
                          <span class="text-[8px] sm:text-[9px] font-bold font-mono uppercase tracking-wider text-muted-foreground/90 liquid-glass rounded-full px-2.5 py-1">
                            {b.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom breakdown section */}
                    <div class="relative mt-4" style={{ transform: "translateZ(20px)" }}>
                      <div class="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground font-sans">
                        <span class="font-bold font-display text-foreground flex items-center gap-1">
                          See Rates
                        </span>
                        <span class="text-foreground/70">
                          {isExpanded() ? <ChevronUp size={16} class="text-primary" /> : <ChevronDown size={16} />}
                        </span>
                      </div>

                      {/* Variants Breakdown */}
                      <Show when={isExpanded() && b.variants && b.variants.length > 0}>
                        <div class="overflow-hidden mt-3 pt-3 border-t border-border/30 space-y-2 text-xs transition-all duration-300">
                          <For each={b.variants}>
                            {(v) => (
                              <div class="flex justify-between items-center text-muted-foreground hover:text-foreground transition py-1 border-b border-border/10 last:border-0">
                                <span class="font-medium text-foreground">{v.name}</span>
                                <div class="flex flex-wrap items-center justify-end gap-1.5 max-w-[70%]">
                                  <Show when={v.inr_rate}>
                                    <span class="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/15 flex items-center gap-1 text-[11px]">
                                      <span class="text-[9px] opacity-75 font-sans">INR:</span> {v.inr_rate}
                                    </span>
                                  </Show>
                                  <Show when={v.usdt_rate}>
                                    <span class="font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/15 flex items-center gap-1 text-[11px]">
                                      <span class="text-[9px] opacity-75 font-sans">USDT:</span> {v.usdt_rate}
                                    </span>
                                  </Show>
                                </div>
                              </div>
                            )}
                          </For>
                          <a
                            href="https://wa.me/919120138828"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            class="mt-3.5 w-full text-center rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md font-bold py-2 text-[11px] transition block"
                          >
                            Start Trade on WhatsApp ➔
                          </a>
                        </div>
                      </Show>
                    </div>
                  </TiltCard>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}

export default Brands;
