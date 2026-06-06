import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";

const ROW_1 = [
  {
    name: "Aarav Sharma",
    role: "Casual Gamer",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Had a ₹5,000 Amazon card sitting around from my birthday. Swapped it for UPI cash easily. The transaction felt extremely transparent.",
    rating: 5,
    tradeType: "Amazon ➔ UPI"
  },
  {
    name: "Karan Mehta",
    role: "Crypto Trader",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Converted my League of Legends RP cards directly into USDT. Payout was routed securely and the rate was easily the best I found online.",
    rating: 5,
    tradeType: "LoL Card ➔ USDT"
  },
  {
    name: "Priya Rao",
    role: "Freelance Designer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Received a Flipkart voucher from a client but needed liquid cash. GCX processed the exchange seamlessly. The glassmorphism UI is beautiful.",
    rating: 5,
    tradeType: "Flipkart ➔ UPI"
  },
  {
    name: "Rahul Verma",
    role: "Mobile Developer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Swapped my Overwatch 2 coins voucher for UPI bank transfer. Got my money within the 5 days window! Highly recommended.",
    rating: 5,
    tradeType: "Overwatch ➔ UPI"
  },
  {
    name: "Sneha Patel",
    role: "Valorant Player",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Traded Roblox card for USDT TRC20. Payout was verified on ledger. Fast and very safe brokerage service.",
    rating: 5,
    tradeType: "Roblox ➔ USDT"
  },
  {
    name: "Amit Kumar",
    role: "College Student",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Got a Steam card from my cousin but wanted cash. Swapped here and received direct bank deposit. Brokered seamlessly.",
    rating: 5,
    tradeType: "Steam ➔ UPI"
  }
];

const ROW_2 = [
  {
    name: "Jessica Taylor",
    role: "Esports Lead",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Traded my Sea of Thieves card. Very reliable service, fair exchange rates, and awesome support throughout the process.",
    rating: 5,
    tradeType: "SoT Card ➔ USDT"
  },
  {
    name: "Devansh Gupta",
    role: "Tech Lead",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "GCX is a lifesaver. Sold multiple unused corporate gift cards easily. Brokerage is reasonable and payouts are safe.",
    rating: 5,
    tradeType: "Amazon ➔ UPI"
  },
  {
    name: "Ananya Sen",
    role: "Lifestyle Blogger",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Very smooth Flipkart card exchange. I always get confused with crypto, but the UPI route worked like magic for me.",
    rating: 5,
    tradeType: "Flipkart ➔ UPI"
  },
  {
    name: "Vikram Bajaj",
    role: "Web3 Enthusiast",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Fast USDT payout on my Roblox card trades. Zero hassle. The ledger verification means you know exactly where your funds are.",
    rating: 5,
    tradeType: "Roblox ➔ USDT"
  },
  {
    name: "Rohit Mishra",
    role: "Esports Coach",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Best payout rates for gaming vouchers. Swapped RP cards and got bank transfer. No hidden deductions.",
    rating: 5,
    tradeType: "League ➔ UPI"
  },
  {
    name: "Neha Kapoor",
    role: "Live Streamer",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80",
    quote: "Smooth trade, helpful support. Swapped Overwatch voucher for crypto. Definitely using GCX for all future payouts.",
    rating: 5,
    tradeType: "Overwatch ➔ USDT"
  }
];

export function Testimonials() {
  const row1Doubled = [...ROW_1, ...ROW_1];
  const row2Doubled = [...ROW_2, ...ROW_2];

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden">
      {/* Local keyframes for marquee movement */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-container-left {
          display: flex;
          width: max-content;
          gap: 24px;
          animation: marqueeScrollLeft 40s linear infinite;
        }
        .marquee-container-right {
          display: flex;
          width: max-content;
          gap: 24px;
          animation: marqueeScrollRight 40s linear infinite;
        }
        .marquee-wrapper:hover .marquee-container-left,
        .marquee-wrapper:hover .marquee-container-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[32vw] w-[32vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 mb-16 text-center">
        {/* Title */}
        <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">Reviews</p>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
          Loved by the <span className="text-gradient">community</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans">
          Hear from 12+ gift card holders who converted their unused balances into real cash and crypto.
        </p>
      </div>

      {/* Testimonials Infinite Marquees */}
      <div className="relative z-10 space-y-8 marquee-wrapper max-w-full overflow-hidden">
        
        {/* Row 1: Moving Left */}
        <div className="flex w-full overflow-hidden select-none">
          <div className="marquee-container-left">
            {row1Doubled.map((t, idx) => (
              <TestimonialCard key={`${t.name}-${idx}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="flex w-full overflow-hidden select-none">
          <div className="marquee-container-right">
            {row2Doubled.map((t, idx) => (
              <TestimonialCard key={`${t.name}-${idx}`} t={t} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="liquid-glass rounded-[1.8rem] p-6 sm:p-8 w-[80vw] sm:w-[26vw] 2xl:w-[380px] shrink-0 border border-border/60 hover:border-border hover:bg-foreground/[0.02] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Rating + Quote Icon */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} size={15} className="fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_4px_rgba(14,165,233,0.4)]" />
            ))}
          </div>
          <Quote size={18} className="text-foreground/10" />
        </div>

        {/* Comment */}
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 font-medium">
          "{t.quote}"
        </p>
      </div>

      <div>
        {/* Divider line */}
        <div className="w-full h-[1px] bg-border/60 mb-5" />

        {/* Profile info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Avatar Image */}
            <img 
              src={t.avatarUrl} 
              alt={t.name}
              className="h-9 w-9 rounded-full object-cover border border-border/60 shadow-md select-none pointer-events-none"
              loading="lazy"
            />
            
            {/* Details */}
            <div>
              <h4 className="font-bold text-xs font-display text-foreground">
                {t.name}
              </h4>
              <p className="text-[10px] text-muted-foreground font-sans">
                {t.role}
              </p>
            </div>
          </div>

          {/* Trade tag */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[8.5px] font-bold font-mono text-muted-foreground/80 bg-foreground/[0.03] border border-border/60 rounded-full px-2 py-0.5 whitespace-nowrap">
              {t.tradeType}
            </span>
            <span className="text-[7.5px] font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-0.5">
              <CheckCircle size={7} className="fill-emerald-400/20" /> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
