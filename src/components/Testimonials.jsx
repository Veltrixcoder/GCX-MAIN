import { createSignal, onSettled, For, Show, createMemo } from "solid-js";
import { Star, Quote, CheckCircle, Image as ImageIcon, X } from "lucide-solid";

export function Testimonials() {
  const [dbReviews, setDbReviews] = createSignal([]);
  const [zoomedImgUrl, setZoomedImgUrl] = createSignal(null);

  onSettled(() => {
    const fetchDbReviews = async () => {
      try {
        const res = await fetch("https://api.gcx.co.in/api/reviews");
        if (res.ok) {
          const data = await res.json();
          // Normalize DB keys to match static ones
          const mapped = data
            .filter(r => r.verified)
            .map(r => {
              const createdAt = r.created_at || new Date().toISOString();
              return {
                name: r.name,
                role: r.role,
                avatarUrl: r.avatar_url || "",
                quote: r.quote,
                rating: r.rating,
                tradeType: r.trade_type,
                proofImageUrl: r.proof_image_url,
                region: r.region,
                gcReceivedDate: r.gc_received_date || new Date(new Date(createdAt).getTime() - 3600 * 1000 * 24 * 3).toISOString(),
                paymentSentDate: r.payment_sent_date || createdAt
              };
            });
          setDbReviews(mapped);
        }
      } catch (err) {
        console.error("Failed to load live reviews", err);
      }
    };
    fetchDbReviews();
  });

  const useMarquee = createMemo(() => dbReviews().length >= 5);
  const row1Data = createMemo(() => dbReviews().filter((_, idx) => idx % 2 === 0));
  const row2Data = createMemo(() => dbReviews().filter((_, idx) => idx % 2 === 1));

  const row1Doubled = createMemo(() => [...row1Data(), ...row1Data()]);
  const row2Doubled = createMemo(() => [...row2Data(), ...row2Data()]);

  return (
    <Show when={dbReviews().length > 0}>
      <section id="testimonials" class="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden">
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
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalScaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-modal-fade {
            animation: modalFadeIn 0.2s ease-out forwards;
          }
          .animate-modal-scale {
            animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

        <div class="relative mx-auto max-w-7xl px-4 mb-6 text-center">
          <p class="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">Reviews</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
            Loved by the <span class="text-gradient">community</span>
          </h2>
          <p class="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans">
            Hear from our community members who converted their unused balances into real cash and crypto.
          </p>
        </div>

        <Show
          when={useMarquee()}
          fallback={
            <div class="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto px-4 z-10 relative">
              <For each={dbReviews()}>
                {(t) => <TestimonialCard t={t} onZoom={setZoomedImgUrl} />}
              </For>
            </div>
          }
        >
          <div class="relative z-10 space-y-8 marquee-wrapper max-w-full overflow-hidden">
            {/* Row 1: Moving Left */}
            <div class="flex w-full overflow-hidden select-none">
              <div class="marquee-container-left">
                <For each={row1Doubled()}>
                  {(t) => <TestimonialCard t={t} onZoom={setZoomedImgUrl} />}
                </For>
              </div>
            </div>

            {/* Row 2: Moving Right */}
            <Show when={row2Data().length > 0}>
              <div class="flex w-full overflow-hidden select-none">
                <div class="marquee-container-right">
                  <For each={row2Doubled()}>
                    {(t) => <TestimonialCard t={t} onZoom={setZoomedImgUrl} />}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </Show>
      </section>

      {/* Zoom Modal Overlay */}
      <Show when={zoomedImgUrl()}>
        <div
          onClick={() => setZoomedImgUrl(null)}
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-modal-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="relative max-w-4xl max-h-[85vh] rounded-lg overflow-hidden border border-border/80 shadow-2xl bg-background p-2 animate-modal-scale"
          >
            <img src={zoomedImgUrl()} alt="Zoomed Receipt" class="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setZoomedImgUrl(null)}
              class="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-md border border-white/10 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </Show>
    </Show>
  );
}

function TestimonialCard(props) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  const getGlowColor = (tradeType) => {
    const t = (tradeType || "").toLowerCase();
    if (t.includes("amazon")) return "rgba(249, 115, 22, 0.15)";
    if (t.includes("flipkart")) return "rgba(14, 165, 233, 0.15)";
    if (t.includes("roblox")) return "rgba(239, 68, 68, 0.15)";
    if (t.includes("legends") || t.includes("league")) return "rgba(234, 179, 8, 0.15)";
    if (t.includes("overwatch")) return "rgba(244, 63, 94, 0.15)";
    if (t.includes("thieves") || t.includes("sea")) return "rgba(20, 184, 166, 0.15)";
    return "rgba(99, 102, 241, 0.15)";
  };

  const diffDays = createMemo(() => {
    if (!props.t.gcReceivedDate || !props.t.paymentSentDate) return null;
    try {
      const gcDate = new Date(props.t.gcReceivedDate);
      const payDate = new Date(props.t.paymentSentDate);
      if (isNaN(gcDate.getTime()) || isNaN(payDate.getTime())) return null;
      const diffTime = Math.abs(payDate.getTime() - gcDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  });

  return (
    <div class="relative overflow-hidden liquid-glass rounded-[1.8rem] p-6 sm:p-8 w-[80vw] sm:w-[26vw] 2xl:w-[380px] shrink-0 border border-border/60 hover:border-border hover:bg-foreground/[0.02] transition-all duration-300 flex flex-col justify-between text-left">


      <div class="relative z-10">
        {/* Rating + Quote Icon */}
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-1">
            <For each={Array.from({ length: props.t.rating || 5 }, (_, i) => i)}>
              {(i) => (
                <Star size={15} class="fill-[var(--primary)] text-[var(--primary)]" />
              )}
            </For>
          </div>
          <Quote size={18} class="text-foreground/10" />
        </div>

        {/* Comment */}
        <p class="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 font-medium">
          "{props.t.quote}"
        </p>

        {/* Dates / Payout Timeline Widget */}
        <div class="relative flex items-center justify-between mt-3 mb-6 px-4 py-2.5 rounded-2xl bg-foreground/[0.015] border border-border/40 shadow-inner">
          <div class="relative z-10 flex flex-col text-left">
            <span class="text-[8px] font-mono font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
              Received
            </span>
            <span class="text-[10.5px] font-bold font-display text-foreground mt-0.5">{formatDate(props.t.gcReceivedDate)}</span>
          </div>

          {/* Dashed line & Settlement Badge */}
          <div class="absolute left-[28%] right-[28%] top-1/2 -translate-y-1/2 flex items-center justify-center hidden xs:flex">
            <div class="w-full h-0 border-t border-dashed border-border/60" />
            <span class="absolute px-2.5 py-0.5 rounded-full bg-background border border-border/60 text-[7px] font-mono font-bold text-muted-foreground uppercase whitespace-nowrap shadow-sm animate-pulse">
              {diffDays() === 0 ? "⚡ Instant" : `${diffDays()}d Settlement`}
            </span>
          </div>

          <div class="relative z-10 flex flex-col items-end text-right">
            <span class="text-[8px] font-mono font-bold uppercase text-emerald-400/90 tracking-wider flex items-center gap-1">
              Paid Out
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            </span>
            <span class="text-[10.5px] font-bold font-display text-foreground mt-0.5">{formatDate(props.t.paymentSentDate)}</span>
          </div>
        </div>
      </div>

      <div class="relative z-10">
        {/* Verification Proof Receipt link if available */}
        <Show when={props.t.proofImageUrl}>
          <div class="mb-5">
            <p class="text-[8px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-2">Verification Certificate</p>
            <a
              href={props.t.proofImageUrl}
              onClick={(e) => {
                e.preventDefault();
                props.onZoom(props.t.proofImageUrl);
              }}
              class="flex items-center gap-3 p-2.5 rounded-2xl bg-foreground/[0.015] border border-border/60 hover:border-primary/50 hover:bg-foreground/[0.03] transition-all duration-300 group cursor-pointer"
            >
              <div class="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-border group-hover:border-primary/30 transition-colors shadow-inner bg-black/40">
                <img src={props.t.proofImageUrl} alt="Proof transaction receipt" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                <div class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <ImageIcon size={16} class="text-white" />
                </div>
              </div>
              <div class="flex-grow min-w-0 text-left">
                <div class="flex items-center gap-1 mb-0.5">
                  <span class="text-[8px] font-bold font-mono text-primary flex items-center gap-0.5">
                    <CheckCircle size={8} class="fill-primary/15" /> SECURE
                  </span>
                  <span class="h-1 w-1 rounded-full bg-border" />
                  <span class="text-[7.5px] font-mono text-muted-foreground uppercase">Proof</span>
                </div>
                <h5 class="text-[9px] font-black font-display text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors">
                  Verify Payout
                </h5>
                <p class="text-[7.5px] text-muted-foreground truncate font-semibold">Click to verify receipt</p>
              </div>
            </a>
          </div>
        </Show>

        {/* Divider line */}
        <div class="w-full h-[1px] bg-border/60 mb-5" />

        {/* Profile info */}
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground shadow-md uppercase select-none shrink-0">
              <Show
                when={props.t.avatarUrl}
                fallback={(props.t.name || "").charAt(0)}
              >
                <img
                  src={props.t.avatarUrl}
                  alt={props.t.name}
                  class="h-full w-full rounded-full object-cover border border-border/60 shadow-md select-none pointer-events-none"
                  loading="lazy"
                />
              </Show>
            </div>

            {/* Details */}
            <div>
              <h4 class="font-bold text-xs font-display text-foreground">
                {props.t.name}
              </h4>
              <p class="text-[10px] text-muted-foreground font-sans">
                {props.t.role}
              </p>
            </div>
          </div>

          {/* Trade tag */}
          <div class="flex flex-col items-end gap-0.5">
            <div class="flex items-center gap-1">
              <Show when={props.t.region}>
                <span class={`text-[8px] font-black font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border ${props.t.region === "US"
                  ? "text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/5"
                  : "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5"
                  }`}>
                  {props.t.region === "US" ? "🇺🇸 US" : "🇬🇧 UK"}
                </span>
              </Show>
              <span class="text-[8.5px] font-bold font-mono text-muted-foreground/80 bg-foreground/[0.03] border border-border/60 rounded-full px-2 py-0.5 whitespace-nowrap">
                {props.t.tradeType}
              </span>
            </div>
            <span class="text-[7.5px] font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-0.5">
              <CheckCircle size={7} class="fill-emerald-400/20" /> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
