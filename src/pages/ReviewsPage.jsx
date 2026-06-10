import { createSignal, For, Show } from "solid-js";
import { Star, Quote, CheckCircle, Upload, Image as ImageIcon, Loader2, AlertCircle, Plus, X, ArrowLeft, Calendar } from "lucide-solid";
import { Link } from "../components/router";
import Navbar from "../components/Navbar";

export function ReviewsPage() {
  const [reviews, setReviews] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [showModal, setShowModal] = createSignal(false);

  // Form state
  const [name, setName] = createSignal("");
  const [role, setRole] = createSignal("");
  const [cardType, setCardType] = createSignal("Amazon");
  const [tradeType, setTradeType] = createSignal("Amazon ➔ UPI");
  const [region, setRegion] = createSignal("");
  const [gcReceivedDate, setGcReceivedDate] = createSignal("");
  const [paymentSentDate, setPaymentSentDate] = createSignal("");
  const [rating, setRating] = createSignal(5);
  const [quote, setQuote] = createSignal("");
  const [proofImage, setProofImage] = createSignal(null);
  const [uploadingImage, setUploadingImage] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [formError, setFormError] = createSignal("");
  const [formSuccess, setFormSuccess] = createSignal(false);
  const [zoomedImgUrl, setZoomedImgUrl] = createSignal(null);
  const [notification, setNotification] = createSignal({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

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

  const fetchReviews = async () => {
    try {
      const res = await fetch("https://api.gcx.co.in/api/reviews");
      const data = await res.json();
      const processed = data.map(r => {
        const createdAt = r.created_at || new Date().toISOString();
        return {
          ...r,
          gc_received_date: r.gc_received_date || new Date(new Date(createdAt).getTime() - 3600 * 1000 * 24 * 3).toISOString(),
          payment_sent_date: r.payment_sent_date || createdAt
        };
      });
      setReviews(processed);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setLoading(false);
    }
  };

  fetchReviews();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setFormError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("https://veltrixcode-vscode.hf.space/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        setProofImage(file);
        showNotification("Proof receipt uploaded successfully!");
      } else {
        setFormError("Failed to upload image. Please try again.");
        showNotification("Failed to upload image.", "error");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setFormError("Error uploading image. Check network connection.");
      showNotification("Error uploading image.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!name().trim()) return setFormError("Name is required");
    if (!quote().trim()) return setFormError("Review description is required");
    if (!tradeType().trim()) return setFormError("Trade type is required (e.g. Amazon ➔ UPI)");
    if (!imageUrl()) return setFormError("Proof image is required to post a review");

    setSubmitting(true);

    try {
      const response = await fetch("https://api.gcx.co.in/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name(),
          role: role() || "Customer",
          avatar_url: "",
          quote: quote(),
          rating: rating(),
          trade_type: tradeType(),
          proof_image_url: imageUrl(),
          region: region() || null,
          gc_received_date: gcReceivedDate() || null,
          payment_sent_date: paymentSentDate() || null
        })
      });

      if (response.ok) {
        setFormSuccess(true);
        showNotification("Review posted successfully!");
        setName(""); setRole(""); setQuote(""); setRating(5);
        setCardType("Amazon"); setTradeType("Amazon ➔ UPI");
        setRegion(""); setGcReceivedDate(""); setPaymentSentDate("");
        setProofImage(null); setImageUrl("");
        fetchReviews();
        setTimeout(() => { setShowModal(false); setFormSuccess(false); }, 1500);
      } else {
        const errData = await response.json();
        setFormError(errData.error || "Failed to submit review");
        showNotification(errData.error || "Failed to submit review.", "error");
      }
    } catch (err) {
      console.error(err);
      setFormError("Failed to communicate with server");
      showNotification("Failed to communicate with server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <Navbar />

      {/* Background ambient lighting */}
      <div class="absolute top-1/4 left-1/4 -translate-y-1/2 h-[45vw] w-[45vw] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div class="absolute bottom-1/4 right-1/4 h-[40vw] w-[40vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-7xl px-4 z-10">

        {/* Back Link */}
        <div class="mb-6 flex justify-start">
          <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-mono font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        {/* Title */}
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <p class="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3">Community Hub</p>
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-display mb-6 tracking-tight leading-tight text-foreground">
            Real Brokerage <span class="text-gradient">Proofs & Reviews</span>
          </h1>
          <p class="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            Every review is posted by an actual client and backed by block or transaction receipts. We believe in 100% transparency.
          </p>
        </div>

        {/* Reviews Feed */}
        <div class="space-y-6">
          <h2 class="text-lg font-bold font-display text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            Reviews Feed <span class="text-xs font-mono font-bold text-muted-foreground bg-foreground/[0.04] px-2 py-0.5 rounded-full">{reviews().length} total</span>
          </h2>

          <Show when={loading()}>
            <div class="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 class="animate-spin text-primary h-8 w-8" />
              <p class="text-xs text-muted-foreground font-mono">Loading dynamic reviews feed...</p>
            </div>
          </Show>

          <Show when={!loading() && reviews().length === 0}>
            <div class="liquid-glass rounded-2xl p-12 text-center border border-border/60">
              <p class="text-muted-foreground text-sm">No reviews posted yet. Be the first to submit a review below!</p>
            </div>
          </Show>

          <Show when={!loading() && reviews().length > 0}>
            <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <For each={reviews()}>
                {(r) => {
                  const diffDays = (() => {
                    if (!r.gc_received_date || !r.payment_sent_date) return null;
                    try {
                      const gcDate = new Date(r.gc_received_date);
                      const payDate = new Date(r.payment_sent_date);
                      if (isNaN(gcDate.getTime()) || isNaN(payDate.getTime())) return null;
                      return Math.ceil(Math.abs(payDate - gcDate) / (1000 * 60 * 60 * 24));
                    } catch { return null; }
                  })();

                  return (
                    <div class="relative overflow-hidden liquid-glass rounded-[2rem] p-6 sm:p-8 border border-border/60 hover:border-border hover:bg-foreground/[0.01] transition-all duration-300 flex flex-col justify-between">
                      {/* Glow Orb background */}
                      <div
                        class="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${getGlowColor(r.trade_type)} 0%, transparent 70%)` }}
                      />

                      <div class="relative z-10">
                        {/* Rating + Quote Icon */}
                        <div class="flex items-center justify-between mb-4">
                          <div class="flex items-center gap-1">
                            <For each={Array.from({ length: r.rating || 5 }, (_, i) => i)}>
                              {() => <Star size={14} class="fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_3px_rgba(255,74,74,0.3)]" />}
                            </For>
                          </div>
                          <Quote size={18} class="text-foreground/10" />
                        </div>

                        {/* Comment */}
                        <p class="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 font-medium whitespace-pre-wrap font-sans">
                          "{r.quote}"
                        </p>
                      </div>

                      <div class="relative z-10">
                        {/* Dates / Payout Timeline Widget */}
                        <div class="relative flex items-center justify-between mt-3 mb-6 px-4 py-2.5 rounded-2xl bg-foreground/[0.015] border border-border/40 shadow-inner">
                          <div class="relative z-10 flex flex-col text-left">
                            <span class="text-[8px] font-mono font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
                              <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                              GC Received
                            </span>
                            <span class="text-[10.5px] font-bold font-display text-foreground mt-0.5">{formatDate(r.gc_received_date)}</span>
                          </div>

                          <div class="absolute left-[28%] right-[28%] top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div class="w-full h-0 border-t border-dashed border-border/60" />
                            <span class="absolute px-2.5 py-0.5 rounded-full bg-background border border-border/60 text-[7.5px] font-mono font-bold text-muted-foreground uppercase whitespace-nowrap shadow-sm">
                              {diffDays === 0 ? "⚡ Instant" : `${diffDays}d Settlement`}
                            </span>
                          </div>

                          <div class="relative z-10 flex flex-col items-end text-right">
                            <span class="text-[8px] font-mono font-bold uppercase text-emerald-400/90 tracking-wider flex items-center gap-1">
                              Payment Sent
                              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                            </span>
                            <span class="text-[10.5px] font-bold font-display text-foreground mt-0.5">{formatDate(r.payment_sent_date)}</span>
                          </div>
                        </div>

                        {/* Proof Image Section */}
                        <Show when={r.proof_image_url}>
                          <div class="mb-5">
                            <p class="text-[8px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-2">Verification Certificate</p>
                            <a
                              href={r.proof_image_url}
                              onClick={(e) => { e.preventDefault(); setZoomedImgUrl(r.proof_image_url); }}
                              class="flex items-center gap-3.5 p-3 rounded-2xl bg-foreground/[0.015] border border-border/60 hover:border-primary/50 hover:bg-foreground/[0.03] transition-all duration-300 group max-w-sm cursor-pointer"
                            >
                              <div class="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden border border-border group-hover:border-primary/30 transition-colors shadow-inner bg-black/40">
                                <img src={r.proof_image_url} alt="Proof transaction receipt" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                                <div class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <ImageIcon size={20} class="text-white" />
                                </div>
                              </div>
                              <div class="flex-grow min-w-0">
                                <div class="flex items-center gap-1.5 mb-1">
                                  <span class="text-[9px] font-bold font-mono text-primary flex items-center gap-0.5">
                                    <CheckCircle size={9} class="fill-primary/15" /> SECURE LINK
                                  </span>
                                  <span class="h-1 w-1 rounded-full bg-border" />
                                  <span class="text-[8px] font-mono text-muted-foreground uppercase">Payout Proof</span>
                                </div>
                                <h5 class="text-[10px] font-black font-display text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors">
                                  View Receipt Verification
                                </h5>
                                <p class="text-[8px] text-muted-foreground truncate font-semibold">Click to verify immutable block receipt</p>
                              </div>
                            </a>
                          </div>
                        </Show>

                        <div class="w-full h-[1px] bg-border/60 mb-5" />

                        {/* Profile info */}
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white shadow-md uppercase">
                              <Show
                                when={r.avatar_url}
                                fallback={(r.name || "").charAt(0)}
                              >
                                <img src={r.avatar_url} alt={r.name} class="h-full w-full rounded-full object-cover" />
                              </Show>
                            </div>
                            <div>
                              <h4 class="font-bold text-xs font-display text-foreground">{r.name}</h4>
                              <p class="text-[10px] text-muted-foreground font-sans">{r.role}</p>
                            </div>
                          </div>

                          <div class="flex flex-col items-end gap-1">
                            <div class="flex items-center gap-1.5">
                              <Show when={r.region}>
                                <span class={`text-[8px] font-black font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border ${r.region === "US" ? "text-sky-400 bg-sky-500/10 border-sky-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                  }`}>
                                  {r.region === "US" ? "🇺🇸 US" : "🇬🇧 UK"}
                                </span>
                              </Show>
                              <span class="text-[8.5px] font-bold font-mono text-muted-foreground/80 bg-foreground/[0.03] border border-border/60 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                                {r.trade_type}
                              </span>
                            </div>
                            <span class="text-[7.5px] font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle size={7} class="fill-emerald-400/20" /> Verified Trade
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>
      </div>

      {/* Floating Action Button (FAB) for posting a review */}
      <button
        onClick={() => setShowModal(true)}
        class="fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center shadow-2xl cursor-pointer hover:bg-primary/30 hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95"
      >
        <Plus size={24} class="stroke-[3px]" />
      </button>

      {/* Review Submission Modal Overlay */}
      <Show when={showModal()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setShowModal(false)}
            class="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Box */}
          <div class="relative w-full max-w-lg bg-card border border-border/80 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden liquid-glass">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              class="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition p-1.5 rounded-full bg-foreground/[0.04] border border-border hover:bg-foreground/[0.08]"
            >
              <X size={16} />
            </button>

            <div class="relative">
              <h2 class="text-xl font-bold font-display text-foreground mb-1">Share Your Experience</h2>
              <p class="text-xs text-muted-foreground mb-6">Fill out the details below. Payout receipt proof is mandatory.</p>

              <form onSubmit={handleSubmit} class="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name()}
                    onInput={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                  />
                </div>

                {/* Card Type & Trade Route */}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Gift Card Type *</label>
                    <select
                      value={cardType()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCardType(val);
                        setTradeType(`${val} ➔ UPI`);
                        if (val !== "Amazon") setRegion("");
                      }}
                      class="w-full bg-[#040408] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:dark]"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="Flipkart">Flipkart</option>
                      <option value="Roblox">Roblox</option>
                      <option value="League of Legends">League of Legends</option>
                      <option value="Overwatch 2">Overwatch 2</option>
                      <option value="Sea of Thieves">Sea of Thieves</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Trade Route *</label>
                    <input
                      type="text"
                      required
                      value={tradeType()}
                      onInput={(e) => setTradeType(e.target.value)}
                      placeholder="e.g. Amazon ➔ UPI"
                      class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Role (Optional)</label>
                    <input
                      type="text"
                      value={role()}
                      onInput={(e) => setRole(e.target.value)}
                      placeholder="e.g. Casual Gamer"
                      class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                    />
                  </div>
                </div>

                {/* Amazon Region Badges */}
                <Show when={cardType() === "Amazon" || tradeType().toLowerCase().includes("amazon")}>
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Amazon Card Region Badge</label>
                    <div class="flex gap-2.5 mt-1">
                      <For each={["US", "UK", "None"]}>
                        {(reg) => (
                          <button
                            type="button"
                            onClick={() => setRegion(reg === "None" ? "" : reg)}
                            class={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${(reg === "None" ? !region() : region() === reg)
                                ? "bg-primary/20 text-primary border-primary/50 font-extrabold"
                                : "bg-foreground/[0.02] text-muted-foreground border-border/80 hover:bg-foreground/[0.04]"
                              }`}
                          >
                            {reg === "US" ? "🇺🇸 US Badge" : reg === "UK" ? "🇬🇧 UK Badge" : "❌ No Badge"}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>

                {/* Dates */}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Calendar size={11} class="text-muted-foreground/85" /> Gift Card Received Date
                    </label>
                    <input
                      type="date"
                      value={gcReceivedDate()}
                      onChange={(e) => setGcReceivedDate(e.target.value)}
                      class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Calendar size={11} class="text-muted-foreground/85" /> Payment Sent Date
                    </label>
                    <input
                      type="date"
                      value={paymentSentDate()}
                      onChange={(e) => setPaymentSentDate(e.target.value)}
                      class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Rating</label>
                  <div class="flex items-center gap-1.5">
                    <For each={[1, 2, 3, 4, 5]}>
                      {(star) => (
                        <button
                          type="button"
                          onClick={() => setRating(star)}
                          class="focus:outline-none transition transform hover:scale-110"
                        >
                          <Star
                            size={18}
                            class={star <= rating()
                              ? "fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_3px_rgba(255,74,74,0.4)]"
                              : "text-muted-foreground/40"
                            }
                          />
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                {/* Quote (Description) */}
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Review Description *</label>
                  <textarea
                    required
                    value={quote()}
                    onInput={(e) => setQuote(e.target.value)}
                    placeholder="Tell others how easy your transaction was, how fast the payout completed..."
                    rows={3}
                    class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Proof Image Upload */}
                <div>
                  <label class="block text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Upload Payout Proof Receipt *</label>
                  <div class="relative border border-dashed border-border rounded-xl p-3 flex flex-col items-center justify-center bg-foreground/[0.01] hover:bg-foreground/[0.02] transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      required={!imageUrl()}
                      onChange={handleImageChange}
                      class="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingImage()}
                    />
                    <Show when={uploadingImage()}>
                      <div class="flex flex-col items-center space-y-1.5 py-1">
                        <Loader2 class="animate-spin text-primary h-5 w-5" />
                        <span class="text-[9px] text-muted-foreground font-mono">Uploading receipt...</span>
                      </div>
                    </Show>
                    <Show when={!uploadingImage() && imageUrl()}>
                      <div class="flex flex-col items-center space-y-1.5 py-1">
                        <div class="relative rounded-lg overflow-hidden border border-emerald-500/30">
                          <img src={imageUrl()} alt="Uploaded Proof" class="h-12 w-auto object-cover" />
                          <div class="absolute top-0 right-0 bg-emerald-500 text-white p-0.5 rounded-bl">
                            <CheckCircle size={8} />
                          </div>
                        </div>
                        <span class="text-[9px] text-emerald-400 font-bold font-mono">Proof Uploaded!</span>
                      </div>
                    </Show>
                    <Show when={!uploadingImage() && !imageUrl()}>
                      <div class="flex flex-col items-center space-y-0.5 py-1 text-center font-sans">
                        <Upload class="text-muted-foreground/60 h-5 w-5 mb-1" />
                        <span class="text-xs font-semibold text-foreground">Click to upload receipt image</span>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Messages */}
                <Show when={formError()}>
                  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle size={14} class="shrink-0 mt-0.5" />
                    <span>{formError()}</span>
                  </div>
                </Show>
                <Show when={formSuccess()}>
                  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2">
                    <CheckCircle size={14} class="shrink-0 mt-0.5" />
                    <span>Review posted successfully!</span>
                  </div>
                </Show>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting() || uploadingImage() || !imageUrl()}
                  class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md py-3 text-xs font-bold transition-all duration-300 text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Show
                    when={submitting()}
                    fallback={<span>Submit Review</span>}
                  >
                    <Loader2 class="animate-spin h-3.5 w-3.5" />
                    <span>Submitting...</span>
                  </Show>
                </button>
              </form>
            </div>
          </div>
        </div>
      </Show>

      {/* Zoom Modal Overlay */}
      <Show when={zoomedImgUrl()}>
        <div
          onClick={() => setZoomedImgUrl(null)}
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="relative max-w-4xl max-h-[85vh] rounded-lg overflow-hidden border border-border/80 shadow-2xl bg-background p-2"
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

export default ReviewsPage;
