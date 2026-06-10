import { createSignal, Show } from "solid-js";
import { Link } from "../components/router";
import { ArrowLeft, ShieldCheck, Mail, Send, Loader2, CheckCircle2 } from "lucide-solid";
import Navbar from "../components/Navbar";

export function AppealPage() {
  // Form states
  const [name, setName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [cardType, setCardType] = createSignal("Amazon");
  const [email, setEmail] = createSignal("");
  const [payoutAddress, setPayoutAddress] = createSignal("");
  const [details, setDetails] = createSignal("");

  const [submitting, setSubmitting] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [error, setError] = createSignal("");
  const [notification, setNotification] = createSignal({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name().trim() || !phone().trim() || !email().trim() || !payoutAddress().trim()) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("https://api.gcx.co.in/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name(),
          phone: phone(),
          card_type: cardType(),
          email: email(),
          payout_address: payoutAddress(),
          details: details()
        })
      });

      if (res.ok) {
        setSubmitted(true);
        showNotification("Appeal submitted successfully!");
        setName(""); setPhone(""); setCardType("Amazon");
        setEmail(""); setPayoutAddress(""); setDetails("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit appeal. Please try again.");
        showNotification(data.error || "Failed to submit appeal.", "error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server. Check your connection.");
      showNotification("Failed to connect to server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="relative min-h-screen pt-28 pb-16 overflow-hidden">
      <Navbar />

      {/* Background ambient lighting */}
      <div class="absolute top-1/4 left-1/4 -translate-y-1/2 h-[45vw] w-[45vw] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div class="absolute bottom-1/4 right-1/4 h-[40vw] w-[40vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-2xl px-4 z-10">

        {/* Back Link */}
        <div class="mb-6 flex justify-start">
          <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-mono font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        <Show
          when={!submitted()}
          fallback={
            <div class="liquid-glass rounded-[2.5rem] p-8 sm:p-12 border border-border/60 text-center shadow-2xl relative overflow-hidden">
              <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

              <div class="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <h2 class="text-xl sm:text-3xl font-black font-display mb-4 text-foreground">
                Appeal Submitted
              </h2>

              <p class="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Thank you. Your complaint has been successfully registered. Our support team is currently investigating your transaction data.
              </p>

              <div class="inline-flex items-center gap-2 p-3.5 rounded-2xl bg-primary/5 border border-primary/10 text-primary mb-8 text-left max-w-sm">
                <Mail size={16} class="shrink-0" />
                <span class="text-[10px] font-mono leading-normal font-semibold">
                  You will be notified through email once the audit is complete.
                </span>
              </div>

              <div>
                <Link
                  to="/"
                  class="inline-flex items-center justify-center rounded-xl bg-foreground/[0.04] border border-border text-foreground text-xs px-6 py-3 hover:bg-foreground/[0.08] transition font-bold"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          }
        >
          <div class="liquid-glass rounded-[2.5rem] p-6 sm:p-10 border border-border/60 shadow-2xl relative overflow-hidden">
            {/* Top visual accent */}
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div class="text-center mb-8">
              <div class="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-red-400 mb-4">
                Payout Support
              </div>
              <h1 class="text-2xl sm:text-4xl font-black font-display mb-3 tracking-tight text-foreground">
                File a <span class="text-gradient">Complaint / Appeal</span>
              </h1>
              <p class="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
                Have you submitted a card but haven't received your funds after the scheduled payout date? Let us know and we'll investigate it immediately.
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-5 text-xs">
              {/* Name & Phone */}
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name()}
                    onInput={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone()}
                    onInput={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210 (Used for card submission)"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition font-mono"
                  />
                </div>
              </div>

              {/* Card Brand & Email */}
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Submitted Card Type *
                  </label>
                  <select
                    value={cardType()}
                    onChange={(e) => setCardType(e.target.value)}
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer"
                  >
                    <option value="Amazon" class="bg-[#080711]">Amazon</option>
                    <option value="Flipkart" class="bg-[#080711]">Flipkart</option>
                    <option value="Roblox" class="bg-[#080711]">Roblox</option>
                    <option value="League of Legends" class="bg-[#080711]">League of Legends</option>
                    <option value="Overwatch 2" class="bg-[#080711]">Overwatch 2</option>
                    <option value="Sea of Thieves" class="bg-[#080711]">Sea of Thieves</option>
                    <option value="Other" class="bg-[#080711]">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav@gmail.com"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
              </div>

              {/* Payout Details */}
              <div>
                <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  UPI ID or Crypto Wallet Address *
                </label>
                <input
                  type="text"
                  required
                  value={payoutAddress()}
                  onInput={(e) => setPayoutAddress(e.target.value)}
                  placeholder="e.g. aarav@ybl OR USDT Wallet Address"
                  class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition font-mono"
                />
              </div>

              {/* Extra Details */}
              <div>
                <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Extra Details & Message (Optional)
                </label>
                <textarea
                  value={details()}
                  onInput={(e) => setDetails(e.target.value)}
                  placeholder="Enter card batch details, times, or any context regarding the delay..."
                  rows={4}
                  class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/60 transition resize-none leading-relaxed"
                />
              </div>

              {/* Reassurance Badge */}
              <div class="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                <ShieldCheck size={18} class="shrink-0" />
                <span class="text-[10px] font-medium leading-normal">
                  <strong>Your data is fully secured:</strong> We use industry-standard encryption to protect your privacy and data.
                </span>
              </div>

              {/* Form Error */}
              <Show when={error()}>
                <div class="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error()}
                </div>
              </Show>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting()}
                class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md py-3.5 text-xs font-bold transition-all duration-300 text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Show
                  when={submitting()}
                  fallback={<><Send size={12} /><span>Submit Appeal / Complaint</span></>}
                >
                  <Loader2 class="animate-spin h-4 w-4" />
                  <span>Submitting appeal...</span>
                </Show>
              </button>
            </form>
          </div>
        </Show>
      </div>

      {/* Floating Dynamic Notifications */}
      <Show when={notification().message}>
        <div class="fixed top-6 right-6 z-50 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-sans border text-xs font-semibold animate-slide-down bg-background/80 backdrop-blur-md border-border/80 text-foreground">
          <span class={`h-1.5 w-1.5 rounded-full ${notification().type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
          {notification().message}
        </div>
      </Show>
    </div>
  );
}

export default AppealPage;
