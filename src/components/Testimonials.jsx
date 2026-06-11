import { createSignal, onSettled, For, Show, createMemo } from "solid-js";
import { Star, Quote, CheckCircle, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-solid";

export function Testimonials() {
  const [dbReviews, setDbReviews] = createSignal([]);
  
  // Multi-image viewer state
  const [zoomedImages, setZoomedImages] = createSignal([]);
  const [zoomedIndex, setZoomedIndex] = createSignal(0);

  const openZoom = (images, index = 0) => {
    setZoomedImages(images);
    setZoomedIndex(index);
  };

  const closeZoom = () => {
    setZoomedImages([]);
    setZoomedIndex(0);
  };

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

  const [activeTab, setActiveTab] = createSignal("All");
  const [currentPage, setCurrentPage] = createSignal(0);

  const filteredReviews = createMemo(() => {
    const tab = activeTab();
    const list = dbReviews();
    if (tab === "All") return list;
    if (tab === "UPI") return list.filter(r => (r.tradeType || "").toLowerCase().includes("upi") || (r.tradeType || "").toLowerCase().includes("bank"));
    if (tab === "Crypto") return list.filter(r => (r.tradeType || "").toLowerCase().includes("usdt") || (r.tradeType || "").toLowerCase().includes("crypto"));
    if (tab === "Amazon") return list.filter(r => (r.tradeType || "").toLowerCase().includes("amazon"));
    if (tab === "Gaming") return list.filter(r => 
      (r.tradeType || "").toLowerCase().includes("roblox") || 
      (r.tradeType || "").toLowerCase().includes("lol") || 
      (r.tradeType || "").toLowerCase().includes("legends") || 
      (r.tradeType || "").toLowerCase().includes("overwatch") || 
      (r.tradeType || "").toLowerCase().includes("thieves") ||
      (r.tradeType || "").toLowerCase().includes("sea")
    );
    return list;
  });

  const itemsPerPage = 3;
  const totalPages = createMemo(() => Math.ceil(filteredReviews().length / itemsPerPage));
  
  const visibleReviews = createMemo(() => {
    const list = filteredReviews();
    const start = currentPage() * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  });

  return (
    <Show when={dbReviews().length > 0}>
      <section id="testimonials" class="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
        <style>{`
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

        <div class="relative mx-auto max-w-7xl px-4 mb-8 text-center">
          <p class="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-4">Reviews</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-bold font-display mb-5 tracking-tight leading-tight text-foreground">
            Loved by the <span class="text-gradient">community</span>
          </h2>
          <p class="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans">
            Hear from our community members who converted their unused balances into real cash and crypto.
          </p>
        </div>

        {/* Stats bar */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10 px-4 relative z-10">
          <div class="bg-[#121214]/30 border border-border/30 rounded-2xl p-4 flex flex-col justify-between text-left">
            <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Rating Score</span>
            <div class="flex items-center gap-1.5 mt-2">
              <span class="text-lg font-bold font-display text-foreground">4.9</span>
              <div class="flex">
                <Star size={11} class="fill-primary text-primary" />
                <Star size={11} class="fill-primary text-primary" />
                <Star size={11} class="fill-primary text-primary" />
                <Star size={11} class="fill-primary text-primary" />
                <Star size={11} class="fill-primary text-primary" />
              </div>
            </div>
          </div>
          <div class="bg-[#121214]/30 border border-border/30 rounded-2xl p-4 flex flex-col justify-between text-left">
            <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Payout Success</span>
            <span class="text-lg font-bold font-display text-emerald-400 mt-2">100% Verified</span>
          </div>
          <div class="bg-[#121214]/30 border border-border/30 rounded-2xl p-4 flex flex-col justify-between text-left">
            <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Settlement Time</span>
            <span class="text-lg font-bold font-display text-primary mt-2">&lt; 2 Hours avg</span>
          </div>
          <div class="bg-[#121214]/30 border border-border/30 rounded-2xl p-4 flex flex-col justify-between text-left">
            <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Proof Receipts</span>
            <span class="text-lg font-bold font-display text-foreground mt-2">Public Ledger</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div class="flex flex-wrap justify-center gap-2 mb-8 relative z-10 px-4">
          <For each={["All", "UPI", "Crypto", "Amazon", "Gaming"]}>
            {(tab) => (
              <button
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(0);
                }}
                class={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  activeTab() === tab
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/5"
                    : "bg-[#121214]/40 text-muted-foreground border-border/40 hover:text-foreground hover:border-border/80"
                }`}
              >
                {tab === "All" ? "All Trades" : tab === "Crypto" ? "Crypto / USDT" : tab === "UPI" ? "UPI Bank Transfer" : tab === "Amazon" ? "Amazon Cards" : `${tab} Cards`}
              </button>
            )}
          </For>
        </div>

        {/* Grid of Reviews */}
        <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 z-10 relative mb-8 min-h-[300px] items-stretch">
          <Show
            when={visibleReviews().length > 0}
            fallback={
              <div class="col-span-full py-12 text-center">
                <p class="text-muted-foreground text-sm">No verified reviews found in this category.</p>
              </div>
            }
          >
            <For each={visibleReviews()}>
              {(t) => <TestimonialCard t={t} onZoom={openZoom} />}
            </For>
          </Show>
        </div>

        {/* Pagination navigation */}
        <Show when={totalPages() > 1}>
          <div class="flex items-center justify-center gap-4 mb-8 relative z-10">
            <button
              disabled={currentPage() === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              class="px-3 py-1.5 rounded-xl border border-border/40 bg-[#121214]/40 text-muted-foreground hover:text-foreground hover:border-border/80 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
            >
              ← Prev
            </button>
            <span class="text-xs font-sans font-semibold text-muted-foreground">
              Page {currentPage() + 1} of {totalPages()}
            </span>
            <button
              disabled={currentPage() >= totalPages() - 1}
              onClick={() => setCurrentPage(prev => Math.min(totalPages() - 1, prev + 1))}
              class="px-3 py-1.5 rounded-xl border border-border/40 bg-[#121214]/40 text-muted-foreground hover:text-foreground hover:border-border/80 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
            >
              Next →
            </button>
          </div>
        </Show>

        {/* View All CTA */}
        <div class="text-center z-10 relative px-4">
          <a
            href="/reviews"
            class="inline-flex items-center gap-2 rounded-xl bg-foreground/[0.03] border border-border/50 text-foreground hover:border-primary/50 hover:text-primary px-6 py-3.5 text-xs font-bold transition-all duration-300 cursor-pointer shadow-md"
          >
            View All Verified Receipts & Reviews →
          </a>
        </div>
      </section>

      {/* Zoom / Gallery Modal Overlay */}
      <Show when={zoomedImages().length > 0}>
        <div
          onClick={closeZoom}
          class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-modal-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="relative max-w-4xl max-h-[85vh] rounded-[2rem] overflow-hidden border border-border/80 shadow-2xl bg-card p-3 flex flex-col items-center justify-center select-none animate-modal-scale"
          >
            {/* Image display */}
            <div class="relative flex items-center justify-center max-w-full max-h-[75vh]">
              <img
                src={zoomedImages()[zoomedIndex()]}
                alt={`Receipt Proof ${zoomedIndex() + 1}`}
                class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-inner bg-black/40 border border-border/40"
              />

              {/* Prev Button */}
              <Show when={zoomedImages().length > 1}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex(prev => (prev > 0 ? prev - 1 : zoomedImages().length - 1));
                  }}
                  class="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition hover:scale-105 active:scale-95 shadow-lg border border-white/10 cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft size={20} class="stroke-[2.5]" />
                </button>
              </Show>

              {/* Next Button */}
              <Show when={zoomedImages().length > 1}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex(prev => (prev < zoomedImages().length - 1 ? prev + 1 : 0));
                  }}
                  class="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition hover:scale-105 active:scale-95 shadow-lg border border-white/10 cursor-pointer flex items-center justify-center"
                >
                  <ChevronRight size={20} class="stroke-[2.5]" />
                </button>
              </Show>
            </div>

            {/* Bottom bar: Title & Pagination */}
            <div class="w-full flex items-center justify-between mt-3 px-4 py-1 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold font-sans text-primary flex items-center gap-0.5 uppercase">
                  <CheckCircle size={10} class="fill-primary/15" /> Ledger Receipt
                </span>
                <span class="h-1 w-1 rounded-full bg-border" />
                <span class="text-[9px] font-sans font-bold text-muted-foreground uppercase">
                  Verification Secure
                </span>
              </div>

              <Show when={zoomedImages().length > 1}>
                <span class="text-[10px] font-sans font-bold text-foreground bg-foreground/[0.04] border border-border px-3 py-1 rounded-full">
                  Receipt {zoomedIndex() + 1} of {zoomedImages().length}
                </span>
              </Show>
            </div>

            {/* Close button */}
            <button
              onClick={closeZoom}
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
    <div class="relative overflow-hidden liquid-glass rounded-[1.8rem] p-6 sm:p-8 w-full border border-border/30 hover:border-border/60 hover:bg-[#121215]/50 transition-all duration-300 flex flex-col justify-between text-left">


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
            <span class="text-[8px] font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
              Received
            </span>
            <span class="text-[10.5px] font-bold text-foreground mt-0.5">{formatDate(props.t.gcReceivedDate)}</span>
          </div>

          {/* Dashed line & Settlement Badge */}
          <div class="absolute left-[28%] right-[28%] top-1/2 -translate-y-1/2 flex items-center justify-center hidden xs:flex">
            <div class="w-full h-0 border-t border-dashed border-border/60" />
            <span class="absolute px-2.5 py-0.5 rounded-full bg-background border border-border/60 text-[7px] font-bold text-muted-foreground uppercase whitespace-nowrap shadow-sm">
              {diffDays() === 0 ? "⚡ Instant" : `${diffDays()}d Settlement`}
            </span>
          </div>

          <div class="relative z-10 flex flex-col items-end text-right">
            <span class="text-[8px] font-bold uppercase text-emerald-400/90 tracking-wider flex items-center gap-1">
              Paid Out
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            </span>
            <span class="text-[10.5px] font-bold text-foreground mt-0.5">{formatDate(props.t.paymentSentDate)}</span>
          </div>
        </div>
      </div>

      <div class="relative z-10">
        {/* Verification Proof Receipt link if available */}
        <Show when={props.t.proofImageUrl}>
          <div class="mb-5">
            <p class="text-[8px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Verification Certificate</p>
            {(() => {
              const urls = props.t.proofImageUrl.split(',');
              return (
                <button
                  type="button"
                  onClick={() => props.onZoom(urls, 0)}
                  class="w-full flex items-center gap-4 p-2.5 rounded-2xl bg-foreground/[0.01] border border-border/60 hover:border-primary/40 hover:bg-foreground/[0.02] transition-all duration-300 group cursor-pointer text-left focus:outline-none"
                >
                  {/* Overlapping image stack */}
                  <div class="relative h-16 w-20 shrink-0 select-none">
                    <Show when={urls.length === 1}>
                      <div class="relative h-16 w-16 rounded-xl overflow-hidden border border-border bg-black/40 shadow-sm">
                        <img src={urls[0]} alt="Proof transaction receipt" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <ImageIcon size={14} class="text-white" />
                        </div>
                      </div>
                    </Show>
                    <Show when={urls.length > 1}>
                      <div class="relative w-full h-full">
                        <For each={urls.slice(0, 3).reverse()}>
                          {(url, idx) => {
                            const revIdx = urls.slice(0, 3).length - 1 - idx();
                            const offset = revIdx * 6;
                            const rotate = revIdx * 4 - 2;
                            return (
                              <div
                                class="absolute top-0 left-0 h-14 w-14 rounded-xl overflow-hidden border border-border bg-black/40 shadow-md transition-all duration-300 group-hover:scale-105"
                                style={{
                                                  transform: `translate(${offset}px, ${offset/2}px) rotate(${rotate}deg)`,
                                                  "z-index": 10 - revIdx,
                                                }}
                              >
                                <img src={url} alt="Proof transaction receipt" class="h-full w-full object-cover" />
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </Show>
                  </div>

                  <div class="flex-grow min-w-0">
                    <div class="flex items-center gap-1.5 mb-1">
                      <span class="text-[9px] font-bold text-primary flex items-center gap-0.5">
                        <CheckCircle size={9} class="fill-primary/15" /> SECURE LEDGER
                      </span>
                      <span class="h-1 w-1 rounded-full bg-border" />
                      <span class="text-[8px] font-semibold text-muted-foreground uppercase">
                        {urls.length === 1 ? "1 Receipt" : `${urls.length} Receipts`}
                      </span>
                    </div>
                    <h5 class="text-[10px] font-bold text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors">
                      {urls.length === 1 ? "Verify Payout Receipt" : "Browse Payout Receipts"}
                    </h5>
                    <p class="text-[8px] text-muted-foreground truncate">
                      {urls.length === 1 ? "Click to view full receipt" : "Click to view receipt stack"}
                    </p>
                  </div>
                </button>
              );
            })()}
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
              <h4 class="font-bold text-xs text-foreground">
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
                <span class={`text-[8px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${props.t.region === "US"
                  ? "text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/5"
                  : "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5"
                  }`}>
                  {props.t.region === "US" ? "🇺🇸 US" : "🇬🇧 UK"}
                </span>
              </Show>
              <span class="text-[8.5px] font-bold text-muted-foreground/80 bg-foreground/[0.03] border border-border/60 rounded-full px-2 py-0.5 whitespace-nowrap">
                {props.t.tradeType}
              </span>
            </div>
            <span class="text-[7.5px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-0.5">
              <CheckCircle size={7} class="fill-emerald-400/20" /> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
