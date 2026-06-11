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
            <div class="liquid-glass rounded-[2.5rem] p-8 sm:p-12 border border-border/30 text-center shadow-2xl relative overflow-hidden bg-background">

              <div class="mx-auto h-16 w-16 rounded-full bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-400/90 mb-6 shadow-sm">
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
          <div class="liquid-glass rounded-[2.5rem] p-6 sm:p-10 border border-border/30 shadow-2xl relative overflow-hidden bg-background">

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
                    class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
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
                    class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 font-mono"
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
                    class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 cursor-pointer"
                  >
                    <option value="Amazon" class="bg-[#121214]">Amazon</option>
                    <option value="Flipkart" class="bg-[#121214]">Flipkart</option>
                    <option value="Roblox" class="bg-[#121214]">Roblox</option>
                    <option value="League of Legends" class="bg-[#121214]">League of Legends</option>
                    <option value="Overwatch 2" class="bg-[#121214]">Overwatch 2</option>
                    <option value="Sea of Thieves" class="bg-[#121214]">Sea of Thieves</option>
                    <option value="Other" class="bg-[#121214]">Other</option>
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
                    class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
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
                  class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 font-mono"
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
                  class="w-full bg-[#121214]/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 resize-none leading-relaxed"
                />
              </div>

              {/* Reassurance Badge */}
              <div class="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 text-muted-foreground">
                <ShieldCheck size={18} class="shrink-0 text-emerald-500/80 mt-0.5" />
                <span class="text-[10px] leading-relaxed">
                  <strong class="text-foreground font-semibold">Your data is fully secured:</strong> We use industry-standard encryption to protect your privacy and transaction data.
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
                class="w-full rounded-xl bg-primary text-black hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/5 py-3.5 text-xs font-bold transition-all duration-300 text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
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
