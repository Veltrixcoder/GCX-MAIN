import { createSignal, Show } from "solid-js";
import { ArrowLeft, MessageSquare, Mail, HelpCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-solid";
import { Link } from "../components/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function SupportPage() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [subject, setSubject] = createSignal("General Inquiry");
  const [message, setMessage] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name().trim() || !email().trim() || !message().trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);

    // Simulate server call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send support ticket. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="relative min-h-screen pt-32 pb-12 overflow-hidden flex flex-col justify-between bg-background">
      <Navbar />

      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-5xl px-4 z-10 w-full flex-grow">
        {/* Back Link */}
        <div class="mb-6 flex justify-start">
          <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-sans font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        {/* Title */}
        <div class="mb-12 text-left border-b border-border/40 pb-6">
          <p class="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-2">Help Center</p>
          <h1 class="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
            GCX Support Desk
          </h1>
          <p class="text-xs sm:text-sm text-muted-foreground mt-3 font-sans">
            Need assistance with a trade, payout schedule, or dispute? We are online 24/7.
          </p>
        </div>

        <div class="grid md:grid-cols-5 gap-8 items-start mb-12">
          {/* Left panel: Quick contacts */}
          <div class="md:col-span-2 space-y-6">
            <div class="liquid-glass rounded-[2rem] p-6 border border-border/60 space-y-5">
              <h3 class="text-sm font-bold text-foreground font-display mb-1 flex items-center gap-2">
                <HelpCircle size={16} class="text-primary" /> Contact Channels
              </h3>
              
              {/* WhatsApp card */}
              <a
                href="https://wa.me/919120138828"
                target="_blank"
                rel="noopener noreferrer"
                class="block p-4 rounded-2xl bg-foreground/[0.015] border border-border hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition duration-300 group"
              >
                <div class="flex items-start gap-3">
                  <div class="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                    <MessageSquare size={15} />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-emerald-400 transition">WhatsApp Live Support</h4>
                    <p class="text-[11px] text-muted-foreground mt-1 leading-normal">
                      Chat directly with our verification operators. Typical response time under 5 minutes.
                    </p>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:support@gcx.co.in"
                class="block p-4 rounded-2xl bg-foreground/[0.015] border border-border hover:border-primary/45 hover:bg-primary/[0.02] transition duration-300 group"
              >
                <div class="flex items-start gap-3">
                  <div class="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition">
                    <Mail size={15} />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-primary transition">Email Support</h4>
                    <p class="text-[11px] text-muted-foreground mt-1 leading-normal">
                      Send us details or business proposals. Checked continuously: <span class="font-semibold">support@gcx.co.in</span>
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* Quick action banners */}
            <div class="liquid-glass rounded-[2rem] p-6 border border-border/60 space-y-4">
              <h4 class="text-xs font-bold text-foreground uppercase tracking-wider font-sans">Delayed Payout?</h4>
              <p class="text-[11px] text-muted-foreground leading-normal">
                If your submission dates have elapsed and payment hasn't arrived, please file an official complaint immediately for manual intervention.
              </p>
              <Link
                to="/appeal"
                class="w-full text-center rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 text-[11px] transition block cursor-pointer"
              >
                File an Appeal / Dispute ➔
              </Link>
            </div>
          </div>

          {/* Right panel: Support ticketing form */}
          <div class="md:col-span-3 liquid-glass rounded-[2rem] p-6 sm:p-8 border border-border/60">
            <h3 class="text-sm sm:text-base font-bold text-foreground font-display mb-1">Send a Message</h3>
            <p class="text-[11px] text-muted-foreground mb-6 font-sans">Fill out the form below, and we'll open a ticket to assist you.</p>

            <form onSubmit={handleSubmit} class="space-y-4 text-xs font-sans">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name()}
                    onInput={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
                {/* Email */}
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav@gmail.com"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
              </div>

              {/* Subject dropdown */}
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Inquiry Type *</label>
                <select
                  value={subject()}
                  onChange={(e) => setSubject(e.target.value)}
                  class="w-full bg-[#040408] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:dark]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Exchange Rates">Rate Inquiry</option>
                  <option value="Payout Issue">Payout / Transaction Issue</option>
                  <option value="Partnership">Partnership Proposal</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Message / Details *</label>
                <textarea
                  required
                  value={message()}
                  onInput={(e) => setMessage(e.target.value)}
                  placeholder="Detail your inquiry, specify card values, variant names, or transaction numbers if applicable..."
                  rows={5}
                  class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition resize-none leading-relaxed"
                />
              </div>

              {/* Status messages */}
              <Show when={error()}>
                <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle size={14} class="shrink-0 mt-0.5" />
                  <span>{error()}</span>
                </div>
              </Show>
              
              <Show when={success()}>
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2 animate-pulse">
                  <CheckCircle size={14} class="shrink-0 mt-0.5" />
                  <span>Your support ticket has been sent! Check your inbox for updates.</span>
                </div>
              </Show>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting()}
                class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md py-3 text-xs font-bold transition-all duration-300 text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Show
                  when={submitting()}
                  fallback={<span>Send Ticket</span>}
                >
                  <Loader2 class="animate-spin h-3.5 w-3.5" />
                  <span>Sending Ticket...</span>
                </Show>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SupportPage;
