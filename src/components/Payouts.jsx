import { createSignal, onSettled, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Link } from "./router";
import { TiltCard } from "./TiltCard";
import { Smartphone, Shield, Gift, RefreshCw, Clock } from "lucide-solid";

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
          <p class="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">Payout options</p>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
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
                    <span class="text-3xl sm:text-4xl font-bold font-mono text-muted-foreground/30 tracking-tight group-hover:text-primary transition-all duration-500">
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
            <div class="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-[9px] font-bold font-mono uppercase tracking-wider text-primary mb-4 shadow-sm">
              <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Payout Schedules
            </div>
            <h3 class="text-xl sm:text-3xl font-black font-display mb-3 tracking-tight text-foreground">
              Payout <span class="text-gradient">Time Tracker</span>
            </h3>
            <p class="text-xs sm:text-sm text-muted-foreground">
              We process card submissions on scheduled runs. Submission opening dates and payout timelines for all accepted cards are listed below.
            </p>
          </div>

          <Show when={loading()}>
            <div class="flex flex-col items-center justify-center py-10 space-y-2">
              <RefreshCw class="animate-spin text-primary h-6 w-6" />
              <span class="text-[10px] text-muted-foreground font-mono">Loading schedules...</span>
            </div>
          </Show>

          <Show when={!loading() && livePayouts().length === 0}>
            <div class="liquid-glass rounded-2xl p-8 text-center border border-border/60 text-xs text-muted-foreground">
              No active payout schedules configured.
            </div>
          </Show>

          <Show when={!loading() && livePayouts().length > 0}>
            <div class="space-y-6">
              {/* DESKTOP TABLE VIEW */}
              <div class="hidden sm:block liquid-glass rounded-[2rem] border border-border/60 overflow-hidden shadow-2xl relative">
                <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                <div class="overflow-x-auto relative">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-foreground/[0.03] border-b border-border text-[9px] font-mono uppercase tracking-wider text-muted-foreground/85">
                        <th class="px-6 py-4">Submission Date</th>
                        <th class="px-6 py-4">Payout Deadline Date</th>
                        <th class="px-6 py-4 text-right">Time Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={livePayouts()}>
                        {(p) => {
                          const sub = new Date(p.submission_date);
                          const pay = new Date(p.payout_date);
                          const diffDays = Math.ceil(Math.abs(pay - sub) / (1000 * 60 * 60 * 24));

                          return (
                            <tr class="border-b border-border/40 hover:bg-foreground/[0.01] transition duration-200">
                              <td class="px-6 py-4 text-foreground font-semibold font-display text-sm">
                                {sub.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td class="px-6 py-4 text-foreground font-semibold font-display text-sm">
                                {pay.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td class="px-6 py-4 text-right text-primary font-mono font-bold text-sm">
                                <span class="inline-flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                                  <Clock size={10} /> {diffDays} days
                                </span>
                              </td>
                            </tr>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE BOX VIEW */}
              <div class="grid gap-4 sm:hidden">
                <For each={livePayouts()}>
                  {(p, idx) => {
                    const sub = new Date(p.submission_date);
                    const pay = new Date(p.payout_date);
                    const diffDays = Math.ceil(Math.abs(pay - sub) / (1000 * 60 * 60 * 24));
                    const isOpen = p.status && p.status.toLowerCase().includes("open");

                    return (
                      <div class="liquid-glass rounded-3xl p-6 border border-border/60 relative overflow-hidden flex flex-col justify-between">
                        <div class="flex justify-between items-center mb-4">
                          <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-foreground/[0.03] border border-border/60 rounded px-2.5 py-0.5">
                            Schedule #{idx() + 1}
                          </span>
                        </div>

                        <div class="space-y-3 mb-4">
                          <div>
                            <span class="text-[9px] font-mono font-bold text-muted-foreground block uppercase tracking-wider mb-0.5">Submission Date</span>
                            <span class="font-bold text-foreground font-display text-sm">
                              {sub.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div>
                            <span class="text-[9px] font-mono font-bold text-muted-foreground block uppercase tracking-wider mb-0.5">Payout Deadline</span>
                            <span class="font-bold text-foreground font-display text-sm">
                              {pay.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>

                        <div class="border-t border-border/30 pt-3 flex justify-between items-center">
                          <span class="text-[10px] text-muted-foreground font-medium">Settlement Speed:</span>
                          <span class="font-mono font-bold text-primary text-xs bg-primary/10 px-2 py-0.5 rounded border border-primary/10">
                            {diffDays} days
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
