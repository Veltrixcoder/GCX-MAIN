import React from "react";
import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";

// Import existing 3D transparent PNG assets
import amazonCard from "../assets/card-amazon-pkV6XfjL.png";
import flipkartCard from "../assets/card-flipkart-SeEfOOvb.png";
import robloxCard from "../assets/card-roblox-Cn_R-R5S.png";
import lolCard from "../assets/card-lol-eD770gql.png";
import overwatchCard from "../assets/overwatch2.png";
import sotCard from "../assets/sot.png";

const brands = [
  { name: "Amazon", img: amazonCard, tag: "Shopping", rate: "Up to 92%", glow: "rgba(255, 153, 0, 0.4)" },
  { name: "Flipkart", img: flipkartCard, tag: "Shopping", rate: "Up to 90%", glow: "rgba(40, 116, 240, 0.4)" },
  { name: "Roblox", img: robloxCard, tag: "Gaming", rate: "Up to 88%", glow: "rgba(239, 68, 68, 0.4)" },
  { name: "League of Legends", img: lolCard, tag: "Gaming", rate: "Up to 86%", glow: "rgba(197, 168, 128, 0.35)" },
  { name: "Overwatch 2", img: overwatchCard, tag: "Gaming", rate: "Up to 84%", glow: "rgba(240, 100, 20, 0.4)" },
  { name: "Sea of Thieves", img: sotCard, tag: "Gaming", rate: "Up to 82%", glow: "rgba(16, 185, 129, 0.4)" },
];

export function Brands() {
  return (
    <section id="brands" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3">Accepted cards</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-foreground leading-tight">We take the cards <span className="text-gradient">you actually own</span></h2>
        </div>

        {/* Adjusted to 3-columns for 6 brands */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TiltCard className="liquid-glass rounded-3xl p-6 h-full overflow-hidden">
                <div
                  className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-50"
                  style={{ background: b.glow }}
                />
                <div className="relative h-40 mb-4 grid place-items-center" style={{ transform: "translateZ(40px)" }}>
                  <img
                    src={b.img}
                    alt={`${b.name} gift card`}
                    loading="lazy"
                    width={448}
                    height={288}
                    className="max-h-full w-auto object-contain drop-shadow-2xl"
                  />
                </div>
                  <div className="relative" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold font-display text-foreground">{b.name}</h3>
                      <span className="text-[8px] sm:text-[9px] font-bold font-mono uppercase tracking-wider text-muted-foreground/90 liquid-glass rounded-full px-2.5 py-1">{b.tag}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground font-sans">Payout</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-[var(--neon)]">{b.rate}</span>
                    </div>
                  </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Brands;
