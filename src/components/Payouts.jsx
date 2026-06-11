import { createSignal, onSettled, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Link } from "./router";
import { TiltCard } from "./TiltCard";
import { Smartphone, Shield, Gift, RefreshCw, Clock, Upload, CheckCircle } from "lucide-solid";

const PAYOUTS_DATA = [
  {
    num: "01",
    icon: Smartphone,
    iconClass: "text-primary h-6 w-6",
    title: "UPI Bank Transfer",
    desc: "Instant direct bank deposit routed via UPI. Cash out straight to PhonePe, Paytm, Google Pay, or BHIM instantly.",
    glow: "rgba(255, 74, 74, 0.15)",
    borderGlow: "rgba(255, 74, 74, 0.3)"
  },
  {
    num: "02",
    icon: Shield,
    iconClass: "text-rose-400 h-6 w-6",
    title: "USDT Crypto Address",
    desc: "Receive stablecoins directly to your Web3 wallet address. Supports low-fee TRC-20, ERC-20, and Polygon networks.",
    glow: "rgba(244, 63, 94, 0.15)",
    borderGlow: "rgba(244, 63, 94, 0.3)"
  },
  {
    num: "03",
    icon: Gift,
    iconClass: "text-amber-400 h-6 w-6",
    title: "Voucher Swap 1:1",
    desc: "Swap your card balance for another digital brand voucher of equivalent value like Steam, Apple, or PlayStation.",
    glow: "rgba(245, 158, 11, 0.15)",
    borderGlow: "rgba(245, 158, 11, 0.3)"
  }
];

export function Payouts() {
  const [livePayouts, setLivePayouts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  onSettled(() => {
    const fetchLivePayouts = async () => {
      try {
        const res = await fetch("https://api.gcx.co.in/api/payouts");
        if (res.ok) {
          const data = await res.json();
          setLivePayouts(data.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load live payouts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivePayouts();
  });

  return (
    <section id="payouts" class="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div class="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <p class="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-4">Payout options</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-bold font-display mb-5 tracking-tight leading-tight text-foreground">
            Get paid your <span class="text-gradient">way</span>
          </h2>
          <p class="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            Three automated channels to disburse your funds. Pick whichever route matches your financial setup.
          </p>
        </div>

        {/* Steps Grid */}
        <div class="grid md:grid-cols-3 gap-8 relative z-10 mb-12">
          <For each={PAYOUTS_DATA}>
            {(item) => (
              <TiltCard
                class="liquid-glass rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 border border-border/60 group hover:border-border/85 hover:bg-[#121215]"
                intensity={10}
              >
                <div class="relative flex flex-col h-full" style={{ "transform-style": "preserve-3d" }}>
                  <div class="flex items-center justify-between mb-8" style={{ transform: "translateZ(30px)" }}>
                    <div class="h-12 w-12 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                      <Dynamic component={item.icon} class={item.iconClass} />
                    </div>
                    <span class="text-3xl sm:text-4xl font-bold font-sans text-muted-foreground/20 tracking-tight group-hover:text-primary transition-all duration-500">
                      {item.num}
                    </span>
                  </div>
                  <div class="mt-4" style={{ transform: "translateZ(20px)" }}>
                    <h3 class="text-lg sm:text-xl font-bold font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            )}
          </For>
        </div>

        {/* Live Payout Tracker Section */}
        <div class="relative z-10 border-t border-border/40 pt-10">
          <div class="text-center mb-6 max-w-xl mx-auto">
            <div class="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-[9px] font-bold font-sans uppercase tracking-wider text-primary mb-4 shadow-sm">
              <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Payout Schedules
            </div>
            <h3 class="text-xl sm:text-3xl font-bold font-display mb-3 tracking-tight text-foreground">
              Payout <span class="text-gradient">Time Tracker</span>
            </h3>
            <p class="text-xs sm:text-sm text-muted-foreground font-sans">
              We process card submissions on scheduled runs. Submission opening dates and payout timelines for all accepted cards are listed below.
            </p>
          </div>

          <Show when={loading()}>
            <div class="flex flex-col items-center justify-center py-10 space-y-2">
              <RefreshCw class="animate-spin text-primary h-6 w-6" />
              <span class="text-[10px] text-muted-foreground font-sans">Loading schedules...</span>
            </div>
          </Show>

          <Show when={!loading() && livePayouts().length === 0}>
            <div class="liquid-glass rounded-2xl p-8 text-center border border-border/60 text-xs text-muted-foreground font-sans">
              No active payout schedules configured.
            </div>
          </Show>

          <Show when={!loading() && livePayouts().length > 0}>
            <div class="space-y-6">
              {/* Unified Timeline Grid View */}
              <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <For each={livePayouts()}>
                  {(p, idx) => {
                    const sub = new Date(p.submission_date);
                    const pay = new Date(p.payout_date);
                    const diffDays = Math.ceil(Math.abs(pay - sub) / (1000 * 60 * 60 * 24));
                    const isSettled = pay <= new Date();

                    return (
                      <div class="relative overflow-hidden liquid-glass rounded-[2rem] p-6 border border-border/50 hover:border-border/80 hover:bg-foreground/[0.01] transition-all duration-300 flex flex-col justify-between bg-background">
                        {/* Card Header: Schedule & Status */}
                        <div class="flex justify-between items-center mb-5">
                          <span class="text-[9px] font-sans font-bold uppercase tracking-wider text-muted-foreground bg-foreground/[0.02] border border-border/60 rounded-full px-3 py-1">
                            Run #{idx() + 1}
                          </span>
                          <Show
                            when={isSettled}
                            fallback={
                              <span class="text-[9.5px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm font-sans">
                                <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Processing Run
                              </span>
                            }
                          >
                            <span class="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm font-sans">
                              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Settled & Disbursed
                            </span>
                          </Show>
                        </div>

                        {/* Interactive Timeline visualization */}
                        <div class="relative flex items-center justify-between my-5 px-1">
                          {/* Dotted Track Line */}
                          <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] pointer-events-none z-0">
                            <div
                              class={`h-full w-full ${isSettled ? "border-t border-emerald-500/30" : "border-t border-dashed border-border/80"}`}
                            />
                          </div>

                          {/* Left node (Submission) */}
                          <div class="relative z-10 flex flex-col items-center select-none">
                            <div class={`h-9 w-9 rounded-full flex items-center justify-center border shadow-md transition duration-300 ${isSettled ? "bg-emerald-950/80 border-emerald-500 text-emerald-400" : "bg-secondary border-border text-muted-foreground"}`}>
                              <Upload size={13} class="stroke-[2.5]" />
                            </div>
                            <span class="text-[8px] font-sans font-bold text-muted-foreground mt-2 uppercase tracking-wider">Submitted</span>
                            <span class="text-[10px] font-bold text-foreground mt-0.5">
                              {sub.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                          </div>

                          {/* Center badge (Days count) */}
                          <div class="relative z-20 px-2.5 py-0.5 rounded-full bg-background border border-border/80 text-[7.5px] font-bold text-primary uppercase tracking-wider shadow-sm font-sans">
                            ⚡ {diffDays}d Run
                          </div>

                          {/* Right node (Disbursed) */}
                          <div class="relative z-10 flex flex-col items-center select-none">
                            <div class={`h-9 w-9 rounded-full flex items-center justify-center border shadow-md transition duration-300 ${isSettled ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 animate-pulse" : "bg-secondary border-border text-muted-foreground"}`}>
                              <CheckCircle size={13} class="stroke-[2.5]" />
                            </div>
                            <span class="text-[8px] font-sans font-bold text-muted-foreground mt-2 uppercase tracking-wider">Disbursed</span>
                            <span class="text-[10px] font-bold text-foreground mt-0.5">
                              {pay.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        </div>

                        {/* Card Footer detail */}
                        <div class="border-t border-border/30 pt-3 flex justify-between items-center text-[9px] text-muted-foreground font-sans">
                          <span>Timeline Cycle:</span>
                          <span class="font-semibold text-foreground">
                            {isSettled ? "100% Disbursed on Schedule" : "Settlement Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>

              {/* WHATSAPP BANNER */}
              <div class="pt-8 text-center">
                <div class="liquid-glass rounded-[2rem] border border-border/60 p-6 sm:p-8 max-w-2xl mx-auto relative overflow-hidden shadow-xl hover:border-primary/30 transition-all duration-300">
                  <p class="text-xs sm:text-sm font-bold text-foreground mb-4 leading-relaxed max-w-md mx-auto">
                    For real-time updates on payout settlements, schedule modifications, and current rate changes:
                  </p>
                  <a
                    href="https://whatsapp.com/channel/0029Vb5lJ3g35fLoqQl2QZ0K"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-2xl bg-primary text-black font-bold px-6 py-3.5 text-xs shadow-lg transition-all duration-300 hover:bg-accent cursor-pointer"
                  >
                    <svg class="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.484 2.016 14.1 1.01 11.69 1.01c-5.433 0-9.858 4.37-9.862 9.8-.001 1.76.476 3.483 1.383 4.985l-.998 3.642 3.834-.993zm11.233-5.288c-.288-.144-1.701-.84-1.964-.936-.263-.096-.454-.144-.645.144-.191.288-.741.936-.908 1.128-.167.192-.335.216-.623.072-1.359-.68-2.336-1.189-3.266-2.793-.245-.424.245-.394.7-.1.408-.266.454-.456.68-.84.228-.384.114-.72-.056-.864-.17-.144-1.454-3.51-1.996-4.814-.528-1.272-1.066-1.099-1.454-1.119-.377-.02-.81-.023-1.243-.023-.433 0-1.139.163-1.733.816-.595.653-2.268 2.219-2.268 5.412 0 3.193 2.315 6.273 2.637 6.708.322.434 4.558 6.963 11.047 9.77.712.308 1.267.491 1.7.63.715.228 1.366.196 1.881.119.574-.085 1.701-.696 1.94-.816.239-.12.397-.576.335-.816-.062-.24-.263-.384-.55-.528z" />
                    </svg>
                    <span>Follow GCX Channel on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Appeal/Complaint Banner */}
              <div class="pt-8 text-center max-w-2xl mx-auto">
                <div class="liquid-glass rounded-[1.8rem] border border-red-500/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-lg hover:border-red-500/35 transition-all duration-300">
                  <div class="text-center sm:text-left z-10">
                    <p class="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1">Payment Delayed?</p>
                    <p class="text-xs sm:text-sm text-foreground font-semibold leading-normal">
                      Have you not received your payment even after the payout date?
                    </p>
                  </div>
                  <Link
                    to="/appeal"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-3 text-xs transition-all duration-300 shrink-0 z-10 cursor-pointer"
                  >
                    File an Appeal / Complaint →
                  </Link>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </section>
  );
}

export default Payouts;
