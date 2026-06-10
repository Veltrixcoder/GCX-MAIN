import { createSignal, onSettled, For, Show, Switch, Match } from "solid-js";
import { Link } from "../components/router";
import {
  Plus, Trash2, Edit2, Check, X, ShieldAlert, CreditCard, RefreshCw,
  Calendar, MessageSquare, Star, PlusCircle, ArrowLeft, Upload,
  Loader2, Image as ImageIcon, Copy, Layers, Clock, Search, Filter,
  CheckCircle2, AlertTriangle, KeyRound, LogOut, MailCheck
} from "lucide-solid";

export function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [token, setToken] = createSignal(localStorage.getItem("adminToken") || "");
  const [otpSent, setOtpSent] = createSignal(false);
  const [otp, setOtp] = createSignal("");
  const [authLoading, setAuthLoading] = createSignal(false);
  const [sessionVerifying, setSessionVerifying] = createSignal(true);

  // Tab state
  const [activeTab, setActiveTab] = createSignal("cards");

  // Notifications
  const [notification, setNotification] = createSignal({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  // --- API WRAPPER WITH AUTO-LOGOUT ON 401 ---
  const adminFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token()}`
    };
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpiry");
        setToken("");
        setIsAuthenticated(false);
        showNotification("Session expired. Please log in again.", "error");
        throw new Error("Unauthorized");
      }
      return res;
    } catch (err) {
      if (err.message !== "Unauthorized") {
        console.error("Fetch error:", err);
      }
      throw err;
    }
  };

  // --- AUTH METHODS ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("https://api.gcx.co.in/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        showNotification(data.message || "Verification code sent to email.");
      } else {
        showNotification(data.error || "Failed to send OTP.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to connect to backend server.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp().trim()) return;
    setAuthLoading(true);
    try {
      const res = await fetch("https://api.gcx.co.in/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp().trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminTokenExpiry", data.expiresAt.toString());
        setToken(data.token);
        setIsAuthenticated(true);
        showNotification("Authenticated successfully!");
      } else {
        showNotification(data.error || "Invalid or expired OTP code.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error verifying code.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiry");
    setToken("");
    setIsAuthenticated(false);
    setOtpSent(false);
    setOtp("");
    showNotification("Logged out successfully.");
  };

  // --- DATA STATES ---
  const [cards, setCards] = createSignal([]);
  const [loadingCards, setLoadingCards] = createSignal(true);
  const [newCardName, setNewCardName] = createSignal("");
  const [newCardTag, setNewCardTag] = createSignal("Shopping");
  const [newCardGlow, setNewCardGlow] = createSignal("rgba(14, 165, 233, 0.2)");
  const [newCardImg, setNewCardImg] = createSignal("amazon");

  // Variant editing/adding
  const [newVariantName, setNewVariantName] = createSignal("");
  const [newVariantInrRate, setNewVariantInrRate] = createSignal("");
  const [newVariantUsdtRate, setNewVariantUsdtRate] = createSignal("");
  const [addingVariantCardId, setAddingVariantCardId] = createSignal(null);

  const [editingVariantId, setEditingVariantId] = createSignal(null);
  const [editingVariantName, setEditingVariantName] = createSignal("");
  const [editingVariantInrRate, setEditingVariantInrRate] = createSignal("");
  const [editingVariantUsdtRate, setEditingVariantUsdtRate] = createSignal("");

  // Payouts state
  const [payouts, setPayouts] = createSignal([]);
  const [loadingPayouts, setLoadingPayouts] = createSignal(true);
  const [payoutSearch, setPayoutSearch] = createSignal("");
  const [payoutFilterStatus, setPayoutFilterStatus] = createSignal("All");
  const [payoutFormMode, setPayoutFormMode] = createSignal("single"); // "single" or "batch"

  // Single payout run form
  const [singleSubmissionDate, setSingleSubmissionDate] = createSignal("");
  const [singlePayoutDate, setSinglePayoutDate] = createSignal("");
  const [singleAmount, setSingleAmount] = createSignal("N/A");
  const [singleCardType, setSingleCardType] = createSignal("All Cards");
  const [singleMethod, setSingleMethod] = createSignal("Any");
  const [singleStatus, setSingleStatus] = createSignal("Submission Open");

  // Batch payouts form rows
  const [batchPayouts, setBatchPayouts] = createSignal([]);

  // Editing payout schedules
  const [editingPayoutId, setEditingPayoutId] = createSignal(null);
  const [editingPayoutSubDate, setEditingPayoutSubDate] = createSignal("");
  const [editingPayoutPayDate, setEditingPayoutPayDate] = createSignal("");

  // Reviews state
  const [reviews, setReviews] = createSignal([]);
  const [loadingReviews, setLoadingReviews] = createSignal(true);
  const [zoomedImgUrl, setZoomedImgUrl] = createSignal(null);

  // Add Review Form States
  const [adminNewName, setAdminNewName] = createSignal("");
  const [adminNewRole, setAdminNewRole] = createSignal("Customer");
  const [adminNewCardType, setAdminNewCardType] = createSignal("Amazon");
  const [adminNewTradeType, setAdminNewTradeType] = createSignal("Amazon ➔ UPI");
  const [adminNewRegion, setAdminNewRegion] = createSignal("");
  const [adminNewGcReceivedDate, setAdminNewGcReceivedDate] = createSignal("");
  const [adminNewPaymentSentDate, setAdminNewPaymentSentDate] = createSignal("");
  const [adminNewRating, setAdminNewRating] = createSignal(5);
  const [adminNewQuote, setAdminNewQuote] = createSignal("");
  const [adminNewProofUrl, setAdminNewProofUrl] = createSignal("");
  const [adminNewUploading, setAdminNewUploading] = createSignal(false);

  // Edit Review Form States
  const [editingReviewId, setEditingReviewId] = createSignal(null);
  const [editingReviewName, setEditingReviewName] = createSignal("");
  const [editingReviewRole, setEditingReviewRole] = createSignal("");
  const [editingReviewCardType, setEditingReviewCardType] = createSignal("Amazon");
  const [editingReviewTradeType, setEditingReviewTradeType] = createSignal("");
  const [editingReviewRegion, setEditingReviewRegion] = createSignal("");
  const [editingReviewGcReceivedDate, setEditingReviewGcReceivedDate] = createSignal("");
  const [editingReviewPaymentSentDate, setEditingReviewPaymentSentDate] = createSignal("");
  const [editingReviewRating, setEditingReviewRating] = createSignal(5);
  const [editingReviewQuote, setEditingReviewQuote] = createSignal("");
  const [editingReviewProofUrl, setEditingReviewProofUrl] = createSignal("");
  const [editingReviewUploading, setEditingReviewUploading] = createSignal(false);

  // Appeals state
  const [appeals, setAppeals] = createSignal([]);
  const [loadingAppeals, setLoadingAppeals] = createSignal(true);
  const [appealFilterStatus, setAppealFilterStatus] = createSignal("All");

  // Appeal prompt modal states
  const [showAppealActionModal, setShowAppealActionModal] = createSignal(false);
  const [appealActionTarget, setAppealActionTarget] = createSignal(null); // { id, status }
  const [appealActionNotes, setAppealActionNotes] = createSignal("");
  const [appealActionSubmitLoading, setAppealActionSubmitLoading] = createSignal(false);

  // Fetch all dashboard data
  const fetchAllData = async () => {
    setLoadingCards(true);
    setLoadingPayouts(true);
    setLoadingReviews(true);
    setLoadingAppeals(true);

    try {
      // Fetch cards
      const cardsRes = await adminFetch("https://api.gcx.co.in/api/cards");
      const cardsData = await cardsRes.json();
      setCards(cardsData);
      setLoadingCards(false);

      // Fetch payouts
      const payoutsRes = await adminFetch("https://api.gcx.co.in/api/payouts");
      const payoutsData = await payoutsRes.json();
      setPayouts(payoutsData);
      setLoadingPayouts(false);

      // Fetch reviews
      const reviewsRes = await adminFetch("https://api.gcx.co.in/api/reviews");
      const reviewsData = await reviewsRes.json();
      // Ensure reviews have received/sent timestamps fallback
      const processedReviews = reviewsData.map(r => {
        const createdAt = r.created_at || new Date().toISOString();
        return {
          ...r,
          gc_received_date: r.gc_received_date || new Date(new Date(createdAt).getTime() - 3600 * 1000 * 24 * 3).toISOString(),
          payment_sent_date: r.payment_sent_date || createdAt
        };
      });
      setReviews(processedReviews);
      setLoadingReviews(false);

      // Fetch appeals
      const appealsRes = await adminFetch("https://api.gcx.co.in/api/appeals");
      const appealsData = await appealsRes.json();
      setAppeals(appealsData);
      setLoadingAppeals(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  // Verify active session on load & Setup data fetching inside onSettled
  onSettled(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem("adminToken");
      const storedExpiry = localStorage.getItem("adminTokenExpiry");

      if (!storedToken || !storedExpiry || Date.now() > parseInt(storedExpiry, 10)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpiry");
        setSessionVerifying(false);
        return;
      }

      try {
        const res = await fetch("https://api.gcx.co.in/api/auth/verify-session", {
          headers: { "Authorization": `Bearer ${storedToken}` }
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setIsAuthenticated(true);
          setToken(storedToken);
          await fetchAllData();

          const now = new Date();
          const subStr = now.toISOString().slice(0, 10);
          const payStr = new Date(now.getTime() + 7 * 24 * 3600000).toISOString().slice(0, 10);
          setSingleSubmissionDate(subStr);
          setSinglePayoutDate(payStr);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminTokenExpiry");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setSessionVerifying(false);
      }
    };

    checkSession();

    // Theme logic
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const applyTheme = () => {
      if (mediaQuery.matches) {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
    };
    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  });

  // Fetch data if user signs in successfully
  const handleVerifyOtpSuccess = async () => {
    await fetchAllData();
    const now = new Date();
    const subStr = now.toISOString().slice(0, 10);
    const payStr = new Date(now.getTime() + 7 * 24 * 3600000).toISOString().slice(0, 10);
    setSingleSubmissionDate(subStr);
    setSinglePayoutDate(payStr);
  };

  // Radial Brand colors glow helper
  const getGlowColor = (tradeType = "") => {
    const t = tradeType.toLowerCase();
    if (t.includes("amazon")) return "rgba(249, 115, 22, 0.15)";
    if (t.includes("flipkart")) return "rgba(14, 165, 233, 0.15)";
    if (t.includes("roblox")) return "rgba(239, 68, 68, 0.15)";
    if (t.includes("legends") || t.includes("league")) return "rgba(234, 179, 8, 0.15)";
    if (t.includes("overwatch")) return "rgba(244, 63, 94, 0.15)";
    if (t.includes("thieves") || t.includes("sea")) return "rgba(20, 184, 166, 0.15)";
    return "rgba(99, 102, 241, 0.15)";
  };

  // --- CARDS CRUD ACTIONS ---
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardName() || !newCardImg() || !newCardTag()) return;
    try {
      const res = await adminFetch("https://api.gcx.co.in/api/cards", {
        method: "POST",
        body: JSON.stringify({ name: newCardName(), img: newCardImg(), tag: newCardTag(), glow: newCardGlow() })
      });
      if (res.ok) {
        showNotification("Card brand successfully saved.");
        setNewCardName("");
        const data = await adminFetch("https://api.gcx.co.in/api/cards");
        setCards(await data.json());
      } else {
        const err = await res.json();
        showNotification(err.error || "Failed to add brand.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!confirm("Are you sure you want to delete this card brand and all its rates?")) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Card brand successfully deleted.");
        const data = await adminFetch("https://api.gcx.co.in/api/cards");
        setCards(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- VARIANTS CRUD ACTIONS ---
  const handleAddVariant = async (cardId) => {
    if (!newVariantName()) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/cards/${cardId}/variants`, {
        method: "POST",
        body: JSON.stringify({
          name: newVariantName(),
          inr_rate: newVariantInrRate() || null,
          usdt_rate: newVariantUsdtRate() || null
        })
      });
      if (res.ok) {
        showNotification("Variant successfully added.");
        setNewVariantName("");
        setNewVariantInrRate("");
        setNewVariantUsdtRate("");
        setAddingVariantCardId(null);
        const data = await adminFetch("https://api.gcx.co.in/api/cards");
        setCards(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateVariant = async (variantId) => {
    if (!editingVariantName()) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/variants/${variantId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editingVariantName(),
          inr_rate: editingVariantInrRate() || null,
          usdt_rate: editingVariantUsdtRate() || null
        })
      });
      if (res.ok) {
        showNotification("Variant updated.");
        setEditingVariantId(null);
        const data = await adminFetch("https://api.gcx.co.in/api/cards");
        setCards(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/variants/${variantId}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Variant removed.");
        const data = await adminFetch("https://api.gcx.co.in/api/cards");
        setCards(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PAYOUT TIMELINE ACTIONS ---
  const handleAddSinglePayout = async (e) => {
    e.preventDefault();
    if (!singleSubmissionDate() || !singlePayoutDate()) {
      showNotification("Please select valid timeline dates.", "error");
      return;
    }
    try {
      const res = await adminFetch("https://api.gcx.co.in/api/payouts", {
        method: "POST",
        body: JSON.stringify({
          submission_date: singleSubmissionDate(),
          payout_date: singlePayoutDate(),
          amount: singleAmount(),
          card_type: singleCardType(),
          method: singleMethod(),
          status: singleStatus()
        })
      });
      if (res.ok) {
        showNotification("Payout schedule logged!");
        const data = await adminFetch("https://api.gcx.co.in/api/payouts");
        setPayouts(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addBatchRow = () => {
    const now = new Date();
    const subStr = now.toISOString().slice(0, 10);
    const payStr = new Date(now.getTime() + 7 * 24 * 3600000).toISOString().slice(0, 10);

    setBatchPayouts(prev => [
      ...prev,
      {
        submission_date: subStr,
        payout_date: payStr,
        amount: "N/A",
        card_type: "All Cards",
        method: "Any",
        status: "Submission Open"
      }
    ]);
  };

  const removeBatchRow = (idx) => {
    setBatchPayouts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleBatchRowChange = (idx, field, val) => {
    setBatchPayouts(prev => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (batchPayouts().length === 0) return;
    const invalid = batchPayouts().some(b => !b.submission_date || !b.payout_date);
    if (invalid) {
      showNotification("Ensure dates are set for all batch items.", "error");
      return;
    }

    try {
      const res = await adminFetch("https://api.gcx.co.in/api/payouts/batch", {
        method: "POST",
        body: JSON.stringify({ payouts: batchPayouts() })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`Batch timeline success! Created ${data.count} items.`);
        setBatchPayouts([]);
        const pData = await adminFetch("https://api.gcx.co.in/api/payouts");
        setPayouts(await pData.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditingPayout = (p) => {
    setEditingPayoutId(p.id);
    setEditingPayoutSubDate(p.submission_date ? p.submission_date.slice(0, 10) : "");
    setEditingPayoutPayDate(p.payout_date ? p.payout_date.slice(0, 10) : "");
  };

  const handleUpdatePayout = async (id) => {
    if (!editingPayoutSubDate() || !editingPayoutPayDate()) {
      showNotification("Please select valid dates.", "error");
      return;
    }
    const payout = payouts().find(p => p.id === id);
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/payouts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          submission_date: editingPayoutSubDate(),
          payout_date: editingPayoutPayDate(),
          amount: payout?.amount || "N/A",
          card_type: payout?.card_type || "All Cards",
          method: payout?.method || "Any",
          status: payout?.status || "Submission Open"
        })
      });
      if (res.ok) {
        showNotification("Payout schedule dates updated.");
        setEditingPayoutId(null);
        const data = await adminFetch("https://api.gcx.co.in/api/payouts");
        setPayouts(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePayoutStatus = async (id, newStatus) => {
    const payout = payouts().find(p => p.id === id);
    if (!payout) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/payouts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          submission_date: payout.submission_date,
          payout_date: payout.payout_date,
          amount: payout.amount || "N/A",
          card_type: payout.card_type || "All Cards",
          method: payout.method || "Any",
          status: newStatus
        })
      });
      if (res.ok) {
        showNotification("Status updated!");
        const data = await adminFetch("https://api.gcx.co.in/api/payouts");
        setPayouts(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePayout = async (id) => {
    if (!confirm("Delete this timeline record?")) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/payouts/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Payout timeline record removed.");
        const data = await adminFetch("https://api.gcx.co.in/api/payouts");
        setPayouts(await data.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- REVIEWS MODERATION ACTIONS ---
  const handleAdminImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEdit) setEditingReviewUploading(true);
    else setAdminNewUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://veltrixcode-vscode.hf.space/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (isEdit) setEditingReviewProofUrl(data.url);
        else setAdminNewProofUrl(data.url);
        showNotification("Verification receipt uploaded!");
      } else {
        showNotification("Upload failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Upload connection error.", "error");
    } finally {
      if (isEdit) setEditingReviewUploading(false);
      else setAdminNewUploading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!adminNewName() || !adminNewQuote() || !adminNewTradeType() || !adminNewProofUrl()) {
      showNotification("Name, review comment, route, and proof are required.", "error");
      return;
    }

    try {
      const res = await adminFetch("https://api.gcx.co.in/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          name: adminNewName(),
          role: adminNewRole(),
          avatar_url: "",
          quote: adminNewQuote(),
          rating: adminNewRating(),
          trade_type: adminNewTradeType(),
          proof_image_url: adminNewProofUrl(),
          region: adminNewRegion() || null,
          gc_received_date: adminNewGcReceivedDate() || null,
          payment_sent_date: adminNewPaymentSentDate() || null
        })
      });
      if (res.ok) {
        showNotification("Review successfully logged!");
        setAdminNewName("");
        setAdminNewQuote("");
        setAdminNewProofUrl("");
        setAdminNewRegion("");
        setAdminNewGcReceivedDate("");
        setAdminNewPaymentSentDate("");
        setAdminNewRating(5);
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews");
        const rData = await rRes.json();
        setReviews(rData.map(r => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReview = async (id) => {
    if (!editingReviewName() || !editingReviewQuote() || !editingReviewTradeType() || !editingReviewProofUrl()) {
      showNotification("All review fields are required.", "error");
      return;
    }
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editingReviewName(),
          role: editingReviewRole(),
          avatar_url: "",
          quote: editingReviewQuote(),
          rating: editingReviewRating(),
          trade_type: editingReviewTradeType(),
          proof_image_url: editingReviewProofUrl(),
          region: editingReviewRegion() || null,
          gc_received_date: editingReviewGcReceivedDate() || null,
          payment_sent_date: editingReviewPaymentSentDate() || null
        })
      });
      if (res.ok) {
        showNotification("Review updated.");
        setEditingReviewId(null);
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews");
        const rData = await rRes.json();
        setReviews(rData.map(r => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("Permanently delete this testimonial?")) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Review removed.");
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews");
        const rData = await rRes.json();
        setReviews(rData.map(r => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })));
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to remove review.", "error");
    }
  };

  // --- APPEALS ACTIONS ---
  const handleUpdateAppealStatus = async (id, status, notes = null) => {
    if ((status === "Resolved" || status === "Rejected") && notes === null) {
      setAppealActionTarget({ id, status });
      setAppealActionNotes("");
      setShowAppealActionModal(true);
      return;
    }

    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/appeals/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status, adminNotes: notes })
      });
      if (res.ok) {
        showNotification(`Appeal status updated to ${status}.`);
        const appRes = await adminFetch("https://api.gcx.co.in/api/appeals");
        setAppeals(await appRes.json());
        setShowAppealActionModal(false);
        setAppealActionTarget(null);
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Failed to update appeal status.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to update appeal status.", "error");
    }
  };

  const handleConfirmAppealAction = async (e) => {
    e.preventDefault();
    const target = appealActionTarget();
    if (!target) return;

    const notes = appealActionNotes().trim();
    if (!notes) {
      showNotification("Explanation is required.", "error");
      return;
    }

    setAppealActionSubmitLoading(true);
    try {
      await handleUpdateAppealStatus(target.id, target.status, notes);
    } finally {
      setAppealActionSubmitLoading(false);
    }
  };

  const handleDeleteAppeal = async (id) => {
    if (!confirm("Delete this appeal log permanently?")) return;
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/appeals/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Appeal deleted successfully.");
        const appRes = await adminFetch("https://api.gcx.co.in/api/appeals");
        setAppeals(await appRes.json());
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete appeal.", "error");
    }
  };

  // --- RENDER AUTHENTICATION VIEW ---
  return (
    <div class="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div class="absolute top-0 right-1/4 h-[30vw] w-[30vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 h-[30vw] w-[30vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-25" />

      {/* Dynamic Floating Notifications */}
      <Show when={notification().message}>
        <div class="fixed top-6 right-6 z-50 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-sans border text-xs font-semibold animate-slide-down bg-background/80 backdrop-blur-md border-border/80 text-foreground">
          <span class={`h-1.5 w-1.5 rounded-full ${notification().type === 'error' ? 'bg-negative' : 'bg-positive'} animate-pulse`} />
          {notification().message}
        </div>
      </Show>

      <Show
        when={!sessionVerifying()}
        fallback={
          <div class="min-h-screen bg-background flex flex-col items-center justify-center relative z-10">
            <RefreshCw class="animate-spin text-primary h-10 w-10 mb-4" />
            <p class="text-sm font-mono text-muted-foreground">Verifying staff credentials...</p>
          </div>
        }
      >
        <Show
          when={isAuthenticated()}
          fallback={
            <div class="min-h-screen flex items-center justify-center p-4">
              <div class="w-full max-w-md p-8 liquid-glass rounded-[2rem] border border-border/80 shadow-2xl relative z-10 text-center">
                <div class="mx-auto w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-inner">
                  <KeyRound size={24} />
                </div>
                <h1 class="text-xl font-black font-display tracking-tight text-foreground">
                  GCX Staff <span class="text-gradient">Verification</span>
                </h1>
                <p class="text-xs text-muted-foreground mt-2 px-4 leading-relaxed font-semibold">
                  {!otpSent()
                    ? "Generate a dynamic passcode to unlock administrative rate configuration and client appeal controls."
                    : "Enter the security code emailed to veltrix620@gmail.com. Expires in 1 hour."}
                </p>

                <div class="mt-8">
                  <Show
                    when={otpSent()}
                    fallback={
                      <form onSubmit={handleSendOtp} class="space-y-4">
                        <button
                          type="submit"
                          disabled={authLoading()}
                          class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md py-3.5 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {authLoading() ? <Loader2 size={14} class="animate-spin" /> : <MailCheck size={14} />}
                          Send Security Verification OTP
                        </button>
                      </form>
                    }
                  >
                    <form onSubmit={async (e) => {
                      await handleVerifyOtp(e);
                      if (isAuthenticated()) {
                        await handleVerifyOtpSuccess();
                      }
                    }} class="space-y-4">
                      <div>
                        <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5 text-left">Verification Code</label>
                        <input
                          type="text"
                          required
                          value={otp()}
                          onInput={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          class="w-full bg-foreground/[0.02] border border-border rounded-xl px-4 py-3 text-foreground text-center font-mono text-lg tracking-widest focus:outline-none focus:border-primary/60 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading() || otp().length < 6}
                        class="w-full rounded-full bg-primary/15 border border-primary/30 hover:bg-primary/25 text-primary backdrop-blur-md py-3.5 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {authLoading() ? <Loader2 size={14} class="animate-spin" /> : <CheckCircle2 size={14} />}
                        Verify Code & Access Dashboard
                      </button>

                      <div class="text-center pt-2">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={authLoading()}
                          class="text-[10px] font-mono text-muted-foreground hover:text-primary transition cursor-pointer"
                        >
                          Resend Code
                        </button>
                      </div>
                    </form>
                  </Show>
                </div>

                <div class="mt-8 pt-6 border-t border-border/40 text-center">
                  <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-semibold">
                    <ArrowLeft size={13} /> Return to Exchange Site
                  </Link>
                </div>
              </div>
            </div>
          }
        >
          {/* --- STAFF DASHBOARD --- */}
          <div class="py-12 px-4 sm:px-6 relative z-10 max-w-7xl mx-auto">

            {/* Header */}
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 pb-8 mb-8 gap-4">
              <div>
                <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-3 transition font-mono font-semibold uppercase tracking-wider">
                  <ArrowLeft size={13} /> Back to Exchange Website
                </Link>
                <h1 class="text-2xl sm:text-3xl font-black font-display flex items-center gap-2.5 tracking-tight">
                  <ShieldAlert class="text-primary h-8 w-8" />
                  GCX Staff <span class="text-gradient">Admin Center</span>
                </h1>
              </div>

              <div class="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                {/* Navigation Tabs */}
                <div class="relative liquid-glass p-0.5 rounded-full flex gap-0.5 border border-border/60 overflow-x-auto no-scrollbar whitespace-nowrap">
                  <For each={[
                    { id: "cards", label: "Cards & Rates", icon: CreditCard },
                    { id: "payouts", label: "Payout Logs", icon: Calendar },
                    { id: "reviews", label: "Reviews Moderation", icon: MessageSquare },
                    { id: "appeals", label: "Appeals Center", icon: ShieldAlert },
                  ]}>
                    {(tab) => (
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        class={`relative px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 z-10 ${activeTab() === tab.id ? "text-primary font-semibold bg-primary/10 border border-primary/20" : "text-muted-foreground hover:text-primary border border-transparent"
                          }`}
                      >
                        {tab.icon({ size: 13 })} {tab.label}
                      </button>
                    )}
                  </For>
                </div>

                <button
                  onClick={handleLogout}
                  class="p-2.5 rounded-full border border-border hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Log Out Session"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Stats Summary row */}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-primary">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Brands Managed</span>
                  <div class="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Layers size={14} />
                  </div>
                </div>
                <div class="flex items-baseline gap-1.5 mt-4">
                  <span class="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{cards().length}</span>
                  <span class="text-[9px] text-positive font-mono font-bold bg-positive/5 px-2 py-0.5 rounded-[4px] border border-positive/15">LIVE</span>
                </div>
              </div>

              <div class="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-accent">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Timeline Runs</span>
                  <div class="p-2 rounded-lg bg-accent/5 border border-accent/15 text-accent">
                    <Clock size={14} />
                  </div>
                </div>
                <div class="flex items-baseline gap-1.5 mt-4">
                  <span class="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{payouts().length}</span>
                  <span class="text-[9px] text-accent font-mono font-bold bg-accent/5 px-2 py-0.5 rounded-[4px] border border-accent/15">BATCHES</span>
                </div>
              </div>

              <div class="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-positive">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Reviews Logged</span>
                  <div class="p-2 rounded-lg bg-positive/5 border border-positive/15 text-positive">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
                <div class="flex items-baseline gap-1.5 mt-4">
                  <span class="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{reviews().length}</span>
                  <span class="text-[9px] text-positive font-mono font-bold bg-positive/5 px-2 py-0.5 rounded-[4px] border border-positive/15">VERIFIED</span>
                </div>
              </div>

              <div class="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-negative">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Open Appeals</span>
                  <div class="p-2 rounded-lg bg-negative/5 border border-negative/15 text-negative">
                    <AlertTriangle size={14} />
                  </div>
                </div>
                <div class="flex items-baseline gap-1.5 mt-4">
                  <span class="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    {appeals().filter(a => a.status === "Pending" || !a.status).length}
                  </span>
                  <span class={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-[4px] border ${appeals().filter(a => a.status === "Pending" || !a.status).length > 0
                    ? "text-negative bg-negative/5 border-negative/15 animate-pulse"
                    : "text-muted-foreground bg-foreground/[0.04] border-border"
                    }`}>
                    TICKETS
                  </span>
                </div>
              </div>
            </div>

            {/* --- TAB VIEW CONTROLLERS --- */}
            <Switch>
              {/* 1. CARDS TAB */}
              <Match when={activeTab() === "cards"}>
                <div class="grid lg:grid-cols-12 gap-8 items-start">

                  {/* Create brand card form */}
                  <div class="lg:col-span-4">
                    <div class="liquid-glass rounded-2xl p-6 border border-border/60 shadow-lg relative overflow-hidden text-left">
                      <div class="absolute top-0 right-0 h-12 w-12 bg-primary/5 rounded-bl-xl flex items-center justify-center text-primary">
                        <CreditCard size={16} />
                      </div>

                      <h2 class="text-base font-bold font-display text-foreground mb-4">Add Card Brand</h2>
                      <form onSubmit={handleAddCard} class="space-y-4 text-xs">
                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Brand Name</label>
                          <input
                            type="text"
                            required
                            value={newCardName()}
                            onInput={(e) => setNewCardName(e.target.value)}
                            placeholder="e.g. Steam, Apple, Razer Gold"
                            class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                          />
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Category Tag</label>
                          <select
                            value={newCardTag()}
                            onChange={(e) => setNewCardTag(e.target.value)}
                            class="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition [color-scheme:light-dark]"
                          >
                            <option value="Shopping" class="bg-background">Shopping</option>
                            <option value="Gaming" class="bg-background">Gaming</option>
                            <option value="Crypto" class="bg-background">Crypto</option>
                          </select>
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Brand Neon Glow Effect</label>
                          <input
                            type="text"
                            required
                            value={newCardGlow()}
                            onInput={(e) => setNewCardGlow(e.target.value)}
                            placeholder="rgba(14, 165, 233, 0.2)"
                            class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground font-mono focus:outline-none focus:border-primary/60 transition"
                          />

                          {/* Predefined glow presets */}
                          <div class="flex flex-wrap gap-1.5 mt-2">
                            <For each={[
                              { name: "Orange", value: "rgba(249, 115, 22, 0.2)", color: "bg-[#f97316]" },
                              { name: "Rose", value: "rgba(244, 63, 94, 0.2)", color: "bg-[#f43f5e]" },
                              { name: "Emerald", value: "rgba(16, 185, 129, 0.2)", color: "bg-[#10b981]" },
                              { name: "Blue", value: "rgba(14, 165, 233, 0.2)", color: "bg-[#0ea5e9]" },
                              { name: "Indigo", value: "rgba(99, 102, 241, 0.2)", color: "bg-[#6366f1]" }
                            ]}>
                              {(preset) => (
                                <button
                                  type="button"
                                  onClick={() => setNewCardGlow(preset.value)}
                                  class="flex items-center gap-1 px-2.5 py-1 bg-foreground/[0.03] border border-border hover:bg-foreground/[0.06] rounded-full transition text-[9px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <span class={`w-2 h-2 rounded-full ${preset.color} inline-block`} />
                                  {preset.name}
                                </button>
                              )}
                            </For>
                          </div>
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Image Identifier / URL</label>
                          <input
                            type="text"
                            required
                            value={newCardImg()}
                            onInput={(e) => setNewCardImg(e.target.value)}
                            placeholder="amazon, flipkart, roblox or external URL"
                            class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                          />
                        </div>

                        <button
                          type="submit"
                          class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md font-bold py-2.5 mt-2 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus size={14} /> Add Card Brand
                        </button>
                      </form>

                      {/* Live Card Preview */}
                      <div class="mt-6 border-t border-border/40 pt-6">
                        <span class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-3 tracking-wider">Interactive Live Preview</span>
                        <div
                          class="relative p-5 rounded-2xl border border-border transition-all duration-300 overflow-hidden flex flex-col justify-between h-36 bg-gradient-to-br from-card to-card/60"
                          style={{
                            "box-shadow": `0 8px 30px -4px ${newCardGlow() ? newCardGlow() : "rgba(0,0,0,0)"}`,
                            "border-color": newCardGlow() ? newCardGlow() : "var(--border)"
                          }}
                        >
                          <div class="absolute top-0 right-0 h-14 w-14 bg-foreground/[0.02] rounded-bl-2xl border-l border-b border-border/40 flex items-center justify-center text-[8px] font-bold font-mono text-primary uppercase tracking-widest">{newCardTag() || "Tag"}</div>

                          <div class="flex items-center gap-2.5">
                            <div class="h-9 w-9 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center font-bold font-display text-xs text-primary shadow-inner">
                              {(newCardName() || "G").charAt(0)}
                            </div>
                            <div>
                              <h4 class="text-sm font-black font-display text-foreground tracking-tight">{newCardName() || "Brand Title"}</h4>
                              <span class="text-[9px] text-muted-foreground font-mono mt-0.5 block">Submissions Active</span>
                            </div>
                          </div>

                          <div class="flex justify-between items-center text-[10px] border-t border-border/20 pt-3 mt-4">
                            <span class="text-muted-foreground font-semibold">Asset ID:</span>
                            <span class="font-mono text-foreground font-bold">{newCardImg() || "amazon"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List and manage variants */}
                  <div class="lg:col-span-8 space-y-6 text-left">
                    <h2 class="text-lg font-bold font-display text-foreground border-b border-border/50 pb-2">Active Card Brands & Rates</h2>
                    <Show
                      when={!loadingCards()}
                      fallback={<div class="flex justify-center py-20"><RefreshCw class="animate-spin text-primary" /></div>}
                    >
                      <div class="grid gap-6">
                        <For each={cards()}>
                          {(card) => {
                            const activeGlow = card.glow || "rgba(255,255,255,0.06)";
                            return (
                              <div
                                class="liquid-glass rounded-2xl p-6 border border-border/60 border-l-[3.5px] hover:border-border/80 transition flex flex-col justify-between gap-4 group"
                                style={{
                                  "border-left-color": activeGlow,
                                  "box-shadow": `0 4px 24px -6px ${activeGlow}`
                                }}
                              >
                                {/* Top Header Row of Card */}
                                <div class="flex items-start justify-between border-b border-border/40 pb-4">
                                  <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center font-bold font-display text-xs text-primary shadow-inner">
                                      {card.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 class="text-sm font-bold font-display text-foreground flex items-center gap-2">
                                        {card.name}
                                        <span class="text-[9px] font-mono font-bold text-muted-foreground uppercase bg-foreground/[0.04] border border-border px-2.5 py-0.5 rounded-[4px]">{card.tag}</span>
                                      </h3>
                                      <p class="text-[10px] text-muted-foreground font-mono mt-0.5">{card.glow}</p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    class="p-2 rounded-xl border border-negative/15 text-negative hover:bg-negative/5 transition cursor-pointer"
                                    title="Delete brand"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                {/* Variants Grid */}
                                <div class="space-y-3">
                                  <div class="flex justify-between items-center">
                                    <h4 class="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Variants & Payout Rates</h4>
                                    <span class="text-[9px] font-mono font-semibold bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                                      {card.variants?.length || 0} Variants
                                    </span>
                                  </div>

                                  <div class="grid gap-2 sm:grid-cols-2">
                                    <Show
                                      when={card.variants && card.variants.length > 0}
                                      fallback={<div class="sm:col-span-2 text-center text-muted-foreground py-4 text-[11px] border border-dashed border-border rounded-xl">No variants configured. Add a variant below.</div>}
                                    >
                                      <For each={card.variants}>
                                        {(v) => (
                                          <div class="flex justify-between items-center bg-foreground/[0.02] border border-border/50 hover:border-border rounded-xl px-4 py-2.5 text-xs transition duration-200">
                                            <Show
                                              when={editingVariantId() === v.id}
                                              fallback={
                                                <>
                                                  <span class="font-bold text-foreground">{v.name}</span>
                                                  <div class="flex items-center gap-3">
                                                    <div class="flex items-center gap-1.5">
                                                      <Show when={v.inr_rate}>
                                                        <span class="font-mono text-positive font-bold bg-positive/5 px-2.5 py-1 rounded-md border border-positive/15 text-[10px]">INR: {v.inr_rate}</span>
                                                      </Show>
                                                      <Show when={v.usdt_rate}>
                                                        <span class="font-mono text-primary font-bold bg-primary/5 px-2.5 py-1 rounded-md border border-primary/15 text-[10px]">USDT: {v.usdt_rate}</span>
                                                      </Show>
                                                    </div>
                                                    <div class="flex items-center gap-1">
                                                      <button
                                                        onClick={() => {
                                                          setEditingVariantId(v.id);
                                                          setEditingVariantName(v.name);
                                                          setEditingVariantInrRate(v.inr_rate || "");
                                                          setEditingVariantUsdtRate(v.usdt_rate || "");
                                                        }}
                                                        class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] rounded-lg transition cursor-pointer"
                                                        title="Edit variant"
                                                      >
                                                        <Edit2 size={11} />
                                                      </button>
                                                      <button
                                                        onClick={() => handleDeleteVariant(v.id)}
                                                        class="p-1.5 text-negative hover:bg-negative/5 hover:border-negative/15 border border-transparent rounded-lg transition cursor-pointer"
                                                        title="Delete variant"
                                                      >
                                                        <Trash2 size={11} />
                                                      </button>
                                                    </div>
                                                  </div>
                                                </>
                                              }
                                            >
                                              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                                                <input
                                                  type="text"
                                                  value={editingVariantName()}
                                                  onInput={(e) => setEditingVariantName(e.target.value)}
                                                  class="bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-foreground w-full sm:w-1/3 focus:outline-none focus:border-primary"
                                                />
                                                <input
                                                  type="text"
                                                  value={editingVariantInrRate()}
                                                  onInput={(e) => setEditingVariantInrRate(e.target.value)}
                                                  placeholder="INR Rate"
                                                  class="bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-foreground w-full sm:w-1/4 font-mono focus:outline-none focus:border-primary"
                                                />
                                                <input
                                                  type="text"
                                                  value={editingVariantUsdtRate()}
                                                  onInput={(e) => setEditingVariantUsdtRate(e.target.value)}
                                                  placeholder="USDT Rate"
                                                  class="bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-foreground w-full sm:w-1/4 font-mono focus:outline-none focus:border-primary"
                                                />
                                                <div class="flex gap-1.5 w-full sm:w-auto justify-end mt-1 sm:mt-0">
                                                  <button onClick={() => handleUpdateVariant(v.id)} class="p-1 text-positive hover:bg-positive/5 border border-positive/15 rounded-lg"><Check size={12} /></button>
                                                  <button onClick={() => setEditingVariantId(null)} class="p-1 text-negative hover:bg-negative/5 border border-negative/15 rounded-lg"><X size={12} /></button>
                                                </div>
                                              </div>
                                            </Show>
                                          </div>
                                        )}
                                      </For>
                                    </Show>
                                  </div>

                                  {/* Add Variant Form Inline */}
                                  <Show
                                    when={addingVariantCardId() === card.id}
                                    fallback={
                                      <button
                                        onClick={() => setAddingVariantCardId(card.id)}
                                        class="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition cursor-pointer mt-1"
                                      >
                                        <PlusCircle size={12} /> Add Variant & Payout Rate
                                      </button>
                                    }
                                  >
                                    <div class="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/20">
                                      <input
                                        type="text"
                                        required
                                        value={newVariantName()}
                                        onInput={(e) => setNewVariantName(e.target.value)}
                                        placeholder="Variant Name (e.g. arena20)"
                                        class="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground w-full sm:w-1/3 focus:outline-none focus:border-primary"
                                      />
                                      <input
                                        type="text"
                                        value={newVariantInrRate()}
                                        onInput={(e) => setNewVariantInrRate(e.target.value)}
                                        placeholder="INR Rate (e.g. 20 INR)"
                                        class="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground w-full sm:w-1/4 focus:outline-none focus:border-primary font-mono"
                                      />
                                      <input
                                        type="text"
                                        value={newVariantUsdtRate()}
                                        onInput={(e) => setNewVariantUsdtRate(e.target.value)}
                                        placeholder="USDT Rate (e.g. 0.18 USDT)"
                                        class="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground w-full sm:w-1/4 focus:outline-none focus:border-primary font-mono"
                                      />
                                      <div class="flex gap-2 w-full sm:w-auto">
                                        <button
                                          onClick={() => handleAddVariant(card.id)}
                                          class="rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md font-bold text-xs px-4 py-2 transition cursor-pointer shadow-sm"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setAddingVariantCardId(null)}
                                          class="rounded-full bg-foreground/[0.03] border border-border/80 text-muted-foreground hover:text-foreground font-semibold text-xs px-4 py-2 transition cursor-pointer hover:bg-foreground/[0.06]"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </Show>
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </Show>
                  </div>
                </div>
              </Match>

              {/* 2. PAYOUTS TAB */}
              <Match when={activeTab() === "payouts"}>
                <div class="grid lg:grid-cols-12 gap-8 items-start">

                  {/* Create payouts form */}
                  <div class="lg:col-span-5 space-y-6 text-left">
                    <div class="liquid-glass rounded-2xl p-6 border border-border/60 shadow-lg relative overflow-hidden">
                      <div class="flex justify-between items-center mb-6 border-b border-border/30 pb-4">
                        <h2 class="text-base font-bold font-display text-foreground">Timeline Log Generator</h2>

                        {/* Mode Switcher capsule */}
                        <div class="flex p-0.5 bg-foreground/[0.03] border border-border/80 rounded-full">
                          <button
                            onClick={() => setPayoutFormMode("single")}
                            class={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer border ${payoutFormMode() === "single"
                              ? "bg-primary/15 border-primary/30 text-primary"
                              : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            Single Run
                          </button>
                          <button
                            onClick={() => setPayoutFormMode("batch")}
                            class={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer border ${payoutFormMode() === "batch"
                              ? "bg-primary/15 border-primary/30 text-primary"
                              : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            Batch Timelines
                          </button>
                        </div>
                      </div>

                      <Switch>
                        <Match when={payoutFormMode() === "single"}>
                          <div>
                            <form onSubmit={handleAddSinglePayout} class="space-y-4 text-xs">
                              <div>
                                <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Scope Coverage</label>
                                <input
                                  type="text"
                                  readOnly
                                  value="All Cards"
                                  class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-muted-foreground focus:outline-none font-mono"
                                />
                              </div>

                              <div class="grid grid-cols-2 gap-4">
                                <div>
                                  <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Submission Date</label>
                                  <input
                                    type="date"
                                    required
                                    value={singleSubmissionDate()}
                                    onInput={(e) => setSingleSubmissionDate(e.target.value)}
                                    class="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition font-mono [color-scheme:light-dark]"
                                  />
                                </div>
                                <div>
                                  <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Payout Deadline</label>
                                  <input
                                    type="date"
                                    required
                                    value={singlePayoutDate()}
                                    onInput={(e) => setSinglePayoutDate(e.target.value)}
                                    class="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition font-mono [color-scheme:light-dark]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Initial Status</label>
                                <select
                                  value={singleStatus()}
                                  onChange={(e) => setSingleStatus(e.target.value)}
                                  class="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:light-dark]"
                                >
                                  <option value="Submission Open">Submission Open</option>
                                  <option value="Submission Closed">Submission Closed</option>
                                </select>
                              </div>

                              <button
                                type="submit"
                                class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md font-bold py-2.5 mt-2 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Plus size={14} /> Log Payout Schedule
                              </button>
                            </form>
                          </div>
                        </Match>

                        <Match when={payoutFormMode() === "batch"}>
                          <div>
                            <form onSubmit={handleBatchSubmit} class="space-y-4 text-xs">
                              <Show
                                when={batchPayouts().length > 0}
                                fallback={
                                  <div class="p-8 border border-dashed border-border rounded-xl text-center">
                                    <Clock class="mx-auto text-muted-foreground/50 h-8 w-8 mb-2 animate-pulse" />
                                    <p class="text-muted-foreground text-[11px] mb-3">No batch timeline rows configured.</p>
                                    <button
                                      type="button"
                                      onClick={addBatchRow}
                                      class="rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md px-5 py-2 font-bold inline-flex items-center gap-1.5 cursor-pointer text-[10px] transition shadow-sm"
                                    >
                                      <PlusCircle size={13} /> Add Timeline Row
                                    </button>
                                  </div>
                                }
                              >
                                <div class="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                                  <For each={batchPayouts()}>
                                    {(row, idx) => (
                                      <div class="p-4 rounded-xl bg-foreground/[0.01] border border-border/80 relative space-y-3 shadow-sm">
                                        <button
                                          type="button"
                                          onClick={() => removeBatchRow(idx())}
                                          class="absolute top-3 right-3 text-muted-foreground hover:text-negative p-1 cursor-pointer transition"
                                        >
                                          <X size={13} />
                                        </button>

                                        <span class="inline-block text-[9px] font-bold font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Timeline #{idx() + 1}</span>

                                        <div class="grid grid-cols-2 gap-3">
                                          <div>
                                            <label class="block text-[8px] font-mono uppercase text-muted-foreground mb-1">Submission Date</label>
                                            <input
                                              type="date"
                                              required
                                              value={row.submission_date}
                                              onInput={(e) => handleBatchRowChange(idx(), "submission_date", e.target.value)}
                                              class="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-[10px] text-foreground font-mono focus:outline-none focus:border-primary [color-scheme:light-dark]"
                                            />
                                          </div>
                                          <div>
                                            <label class="block text-[8px] font-mono uppercase text-muted-foreground mb-1">Payout Deadline</label>
                                            <input
                                              type="date"
                                              required
                                              value={row.payout_date}
                                              onInput={(e) => handleBatchRowChange(idx(), "payout_date", e.target.value)}
                                              class="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-[10px] text-foreground font-mono focus:outline-none focus:border-primary [color-scheme:light-dark]"
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <label class="block text-[8px] font-mono uppercase text-muted-foreground mb-1">Timeline Status</label>
                                          <select
                                            value={row.status}
                                            onChange={(e) => handleBatchRowChange(idx(), "status", e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-[10px] text-foreground focus:outline-none focus:border-primary [color-scheme:light-dark]"
                                          >
                                            <option value="Submission Open">Submission Open</option>
                                            <option value="Submission Closed">Submission Closed</option>
                                          </select>
                                        </div>
                                      </div>
                                    )}
                                  </For>
                                </div>
                              </Show>

                              <Show when={batchPayouts().length > 0}>
                                <div class="flex gap-2 pt-2 border-t border-border/30">
                                  <button
                                    type="button"
                                    onClick={addBatchRow}
                                    class="w-1/2 rounded-full bg-primary/5 border border-primary/15 hover:bg-primary/10 text-primary backdrop-blur-md font-bold py-2 transition cursor-pointer text-center text-[10.5px]"
                                  >
                                    Add Row
                                  </button>
                                  <button
                                    type="submit"
                                    class="w-1/2 rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md font-bold py-2 transition cursor-pointer text-[10.5px] flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 size={12} /> Submit Batch ({batchPayouts().length})
                                  </button>
                                </div>
                              </Show>
                            </form>
                          </div>
                        </Match>
                      </Switch>
                    </div>
                  </div>

                  {/* List of logged payout schedules */}
                  <div class="lg:col-span-7 space-y-6 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-2 gap-4">
                      <h2 class="text-lg font-bold font-display text-foreground">Schedules and Deadline Timeline Logs</h2>

                      {/* Search and Filters */}
                      <div class="flex items-center gap-2">
                        <div class="relative">
                          <Search size={11} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                          <input
                            type="text"
                            placeholder="Search dates/status..."
                            value={payoutSearch()}
                            onInput={(e) => setPayoutSearch(e.target.value)}
                            class="bg-foreground/[0.02] border border-border rounded-xl pl-7 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/60 transition w-36 sm:w-44"
                          />
                        </div>

                        <div class="relative flex items-center">
                          <Filter size={11} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                          <select
                            value={payoutFilterStatus()}
                            onChange={(e) => setPayoutFilterStatus(e.target.value)}
                            class="bg-background border border-border rounded-xl pl-7 pr-2 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer text-[11px] [color-scheme:light-dark]"
                          >
                            <option value="All" class="bg-background text-foreground">All Runs</option>
                            <option value="Open" class="bg-background text-positive">Open Runs</option>
                            <option value="Closed" class="bg-background text-negative">Closed Runs</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Show
                      when={!loadingPayouts()}
                      fallback={<div class="flex justify-center py-20"><RefreshCw class="animate-spin text-primary" /></div>}
                    >
                      <div class="space-y-4">
                        <div class="liquid-glass rounded-2xl border border-border/60 overflow-hidden shadow-inner">
                          <table class="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr class="bg-foreground/[0.03] border-b border-border text-[9px] font-mono uppercase tracking-wider text-muted-foreground/90">
                                <th class="px-5 py-3">Submission / Payout Deadline</th>
                                <th class="px-5 py-3">Status</th>
                                <th class="px-5 py-3 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <For each={payouts().filter(p => {
                                const matchesStatus = payoutFilterStatus() === "All" ||
                                  (payoutFilterStatus() === "Open" && p.status?.toLowerCase().includes("open")) ||
                                  (payoutFilterStatus() === "Closed" && p.status?.toLowerCase().includes("closed"));

                                const subDateStr = p.submission_date ? new Date(p.submission_date).toLocaleDateString('en-GB') : "";
                                const payDateStr = p.payout_date ? new Date(p.payout_date).toLocaleDateString('en-GB') : "";
                                const query = payoutSearch().toLowerCase();

                                return matchesStatus && (!payoutSearch() || subDateStr.toLowerCase().includes(query) || payDateStr.toLowerCase().includes(query) || p.status?.toLowerCase().includes(query));
                              })}>
                                {(p) => {
                                  const subDate = new Date(p.submission_date);
                                  const payDate = new Date(p.payout_date);
                                  const diffDays = Math.ceil(Math.abs(payDate.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24));
                                  const isOpen = p.status && p.status.toLowerCase().includes("open");

                                  return (
                                    <tr class="border-b border-border/40 hover:bg-foreground/[0.02] transition duration-150">
                                      <Show
                                        when={editingPayoutId() === p.id}
                                        fallback={
                                          <>
                                            <td class="px-5 py-3.5 space-y-1">
                                              <div class="text-foreground font-semibold flex flex-wrap gap-x-2 text-[11px]">
                                                <span>Sub: {subDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span class="text-muted-foreground">➔</span>
                                                <span>Pay: {payDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                              </div>
                                              <div class="text-[10px] text-positive font-mono font-bold">
                                                <span>Settle: {diffDays} days</span>
                                              </div>
                                            </td>
                                            <td class="px-5 py-3.5">
                                              <div class="flex items-center gap-2">
                                                <span class={`relative flex h-2 w-2 rounded-full ${isOpen ? "bg-positive" : "bg-negative"}`}>
                                                  <Show when={isOpen}>
                                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                  </Show>
                                                </span>
                                                <select
                                                  value={p.status || "Submission Open"}
                                                  onChange={(e) => handleUpdatePayoutStatus(p.id, e.target.value)}
                                                  class={`rounded-[4px] px-3 py-1 text-[10px] font-bold border focus:outline-none cursor-pointer transition ${isOpen
                                                    ? "bg-positive/5 border-positive/20 text-positive"
                                                    : "bg-negative/5 border-negative/20 text-negative"
                                                    } [color-scheme:light-dark]`}
                                                >
                                                  <option value="Submission Open">Open</option>
                                                  <option value="Submission Closed">Closed</option>
                                                </select>
                                              </div>
                                            </td>
                                            <td class="px-5 py-3.5 text-right">
                                              <div class="flex justify-end gap-1.5">
                                                <button onClick={() => startEditingPayout(p)} class="p-1.5 rounded-md border border-primary/20 text-primary hover:bg-primary/10 transition cursor-pointer"><Edit2 size={12} /></button>
                                                <button onClick={() => handleDeletePayout(p.id)} class="p-1.5 rounded-md border border-negative/15 text-negative hover:bg-negative/5 transition cursor-pointer"><Trash2 size={12} /></button>
                                              </div>
                                            </td>
                                          </>
                                        }
                                      >
                                        <td class="px-5 py-3.5" colSpan="2">
                                          <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                                            <div class="flex items-center gap-1.5">
                                              <span class="text-[9px] font-mono text-muted-foreground uppercase">Sub:</span>
                                              <input
                                                type="date"
                                                value={editingPayoutSubDate()}
                                                onInput={(e) => setEditingPayoutSubDate(e.target.value)}
                                                class="bg-background border border-border rounded-lg px-2 py-1 text-[11px] text-foreground font-mono focus:outline-none [color-scheme:light-dark]"
                                              />
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                              <span class="text-[9px] font-mono text-muted-foreground uppercase">Pay:</span>
                                              <input
                                                type="date"
                                                value={editingPayoutPayDate()}
                                                onInput={(e) => setEditingPayoutPayDate(e.target.value)}
                                                class="bg-background border border-border rounded-lg px-2 py-1 text-[11px] text-foreground font-mono focus:outline-none [color-scheme:light-dark]"
                                              />
                                            </div>
                                          </div>
                                        </td>
                                        <td class="px-5 py-3.5 text-right">
                                          <div class="flex justify-end gap-1.5">
                                            <button onClick={() => handleUpdatePayout(p.id)} class="p-1.5 text-positive hover:bg-positive/5 rounded-md border border-positive/15 cursor-pointer"><Check size={12} /></button>
                                            <button onClick={() => setEditingPayoutId(null)} class="p-1.5 text-negative hover:bg-negative/5 rounded-md border border-negative/15 cursor-pointer"><X size={12} /></button>
                                          </div>
                                        </td>
                                      </Show>
                                    </tr>
                                  );
                                }}
                              </For>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </Match>

              {/* 3. REVIEWS MODERATION TAB */}
              <Match when={activeTab() === "reviews"}>
                <div class="grid lg:grid-cols-12 gap-8 items-start">

                  {/* Create review form */}
                  <div class="lg:col-span-4 text-left">
                    <div class="liquid-glass rounded-2xl p-6 border border-border/60 shadow-lg relative overflow-hidden">
                      <div class="absolute top-0 right-0 h-12 w-12 bg-primary/5 rounded-bl-xl flex items-center justify-center text-primary">
                        <MessageSquare size={16} />
                      </div>

                      <h2 class="text-base font-bold font-display text-foreground mb-4">Add Client Review</h2>
                      <form onSubmit={handleAddReview} class="space-y-4 text-xs">
                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Client Name</label>
                          <input
                            type="text"
                            required
                            value={adminNewName()}
                            onInput={(e) => setAdminNewName(e.target.value)}
                            placeholder="e.g. Rahul Verma"
                            class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                          />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Gift Card Type</label>
                            <select
                              value={adminNewCardType()}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAdminNewCardType(val);
                                setAdminNewTradeType(`${val} ➔ UPI`);
                                if (val !== 'Amazon') setAdminNewRegion('');
                              }}
                              class="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition cursor-pointer [color-scheme:light-dark]"
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
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Trade Route</label>
                            <input
                              type="text"
                              required
                              value={adminNewTradeType()}
                              onInput={(e) => setAdminNewTradeType(e.target.value)}
                              placeholder="e.g. Amazon ➔ UPI"
                              class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition"
                            />
                          </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Role / Tag</label>
                            <input
                              type="text"
                              required
                              value={adminNewRole()}
                              onInput={(e) => setAdminNewRole(e.target.value)}
                              placeholder="e.g. Casual Gamer"
                              class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Amazon region selectors */}
                        <Show when={adminNewCardType() === 'Amazon' || adminNewTradeType().toLowerCase().includes('amazon')}>
                          <div class="space-y-1.5">
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1">Amazon Region Badge</label>
                            <div class="flex gap-2">
                              <For each={['US', 'UK', 'None']}>
                                {(reg) => (
                                  <button
                                    type="button"
                                    onClick={() => setAdminNewRegion(reg === 'None' ? '' : reg)}
                                    class={`flex-1 py-2 rounded-xl border font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${(reg === 'None' ? !adminNewRegion() : adminNewRegion() === reg)
                                      ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_12px_rgba(14,165,233,0.1)] font-extrabold'
                                      : 'bg-foreground/[0.02] text-muted-foreground border-border/80 hover:bg-foreground/[0.04]'
                                      }`}
                                  >
                                    {reg === 'US' ? '🇺🇸 US' : reg === 'UK' ? '🇬🇧 UK' : '❌ None'}
                                  </button>
                                )}
                              </For>
                            </div>
                          </div>
                        </Show>

                        {/* Fallback Dates */}
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
                              <Calendar size={11} /> GC Received Date
                            </label>
                            <input
                              type="date"
                              value={adminNewGcReceivedDate()}
                              onInput={(e) => setAdminNewGcReceivedDate(e.target.value)}
                              class="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none [color-scheme:light-dark]"
                            />
                          </div>
                          <div>
                            <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
                              <Calendar size={11} /> Payment Sent Date
                            </label>
                            <input
                              type="date"
                              value={adminNewPaymentSentDate()}
                              onInput={(e) => setAdminNewPaymentSentDate(e.target.value)}
                              class="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none [color-scheme:light-dark]"
                            />
                          </div>
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Rating (1-5)</label>
                          <div class="flex items-center gap-1.5">
                            <For each={[1, 2, 3, 4, 5]}>
                              {(star) => (
                                <button
                                  type="button"
                                  onClick={() => setAdminNewRating(star)}
                                  class="focus:outline-none transition-transform duration-200 hover:scale-125"
                                >
                                  <Star
                                    size={18}
                                    class={`${star <= adminNewRating()
                                      ? "fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_3px_rgba(14,165,233,0.4)]"
                                      : "text-muted-foreground/35"
                                      } transition-all duration-200`}
                                  />
                                </button>
                              )}
                            </For>
                          </div>
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Review Description</label>
                          <textarea
                            required
                            value={adminNewQuote()}
                            onInput={(e) => setAdminNewQuote(e.target.value)}
                            placeholder="Write review details..."
                            rows={3}
                            class="w-full bg-foreground/[0.02] border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition resize-none"
                          />
                        </div>

                        <div>
                          <label class="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5">Proof Receipt Image *</label>
                          <div class="relative border-2 border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center bg-foreground/[0.01] hover:bg-foreground/[0.02] hover:border-primary/45 transition duration-300 group overflow-hidden">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleAdminImageUpload(e, false)}
                              class="absolute inset-0 opacity-0 cursor-pointer z-10"
                              disabled={adminNewUploading()}
                            />
                            <Switch>
                              <Match when={adminNewUploading()}>
                                <div class="flex flex-col items-center py-2 z-20">
                                  <Loader2 class="animate-spin text-primary h-6 w-6 mb-2" />
                                  <span class="text-[10px] text-muted-foreground font-mono">Uploading...</span>
                                </div>
                              </Match>
                              <Match when={adminNewProofUrl()}>
                                <div class="flex flex-col items-center py-1 z-20 w-full">
                                  <div class="relative rounded-xl overflow-hidden border border-border bg-background max-h-24 max-w-full inline-block">
                                    <img src={adminNewProofUrl()} alt="Uploaded Proof" class="h-20 object-cover" />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setAdminNewProofUrl("");
                                      }}
                                      class="absolute top-1 right-1 p-1 bg-negative text-white rounded-full hover:bg-red-600 transition z-30 shadow-md cursor-pointer"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                  <span class="text-[9px] text-positive font-bold font-mono mt-2 flex items-center gap-1">
                                    <Check size={10} /> Ready for Submission
                                  </span>
                                </div>
                              </Match>
                              <Match when={true}>
                                <div class="flex flex-col items-center py-3 text-center z-20 group-hover:scale-105 transition-transform duration-300">
                                  <Upload class="text-muted-foreground/80 group-hover:text-primary h-6 w-6 mb-2 transition-colors duration-300" />
                                  <span class="text-xs font-bold text-foreground">Upload Trade Proof</span>
                                  <span class="text-[9px] text-muted-foreground mt-1 font-mono">Drag receipt or click to upload</span>
                                </div>
                              </Match>
                            </Switch>
                          </div>
                        </div>

                        <button
                          type="submit"
                          class="w-full rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary backdrop-blur-md font-bold py-2.5 mt-2 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus size={14} /> Add Client Review
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Testimonials List */}
                  <div class="lg:col-span-8 space-y-6 text-left">
                    <h2 class="text-lg font-bold font-display text-foreground border-b border-border/50 pb-2">Submitted Client Testimonials</h2>

                    <Show
                      when={!loadingReviews()}
                      fallback={<div class="flex justify-center py-20"><RefreshCw class="animate-spin text-primary" /></div>}
                    >
                      <Show
                        when={reviews().length > 0}
                        fallback={<div class="liquid-glass rounded-2xl p-12 text-center border border-border/60 text-muted-foreground">No review submissions found.</div>}
                      >
                        <div class="grid gap-6 md:grid-cols-2">
                          <For each={reviews()}>
                            {(review) => {
                              const diffDays = (() => {
                                if (!review.gc_received_date || !review.payment_sent_date) return null;
                                try {
                                  const gcDate = new Date(review.gc_received_date);
                                  const payDate = new Date(review.payment_sent_date);
                                  if (isNaN(gcDate.getTime()) || isNaN(payDate.getTime())) return null;
                                  return Math.ceil(Math.abs(payDate.getTime() - gcDate.getTime()) / (1000 * 60 * 60 * 24));
                                } catch { return null; }
                              })();

                              return (
                                <div
                                  class="liquid-glass rounded-2xl p-6 border border-border/60 flex flex-col justify-between hover:border-border/80 transition-all duration-300 relative overflow-hidden text-left"
                                >
                                  <div
                                    class="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                                    style={{ background: `radial-gradient(circle, ${getGlowColor(review.trade_type)} 0%, transparent 70%)` }}
                                  />
                                  <div class="absolute right-6 top-6 text-primary/[0.03] text-7xl select-none font-serif pointer-events-none font-black z-0">“</div>

                                  <Show
                                    when={editingReviewId() === review.id}
                                    fallback={
                                      <div class="flex flex-col justify-between h-full z-10 w-full relative z-10">
                                        <div>
                                          <div class="flex justify-between items-start mb-4">
                                            <div class="flex items-center gap-1">
                                              <For each={[...Array(review.rating)]}>
                                                {() => (
                                                  <Star size={13} class="fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_2px_rgba(14,165,233,0.3)]" />
                                                )}
                                              </For>
                                            </div>
                                            <div class="flex gap-2">
                                              <button
                                                onClick={() => {
                                                  setEditingReviewId(review.id);
                                                  setEditingReviewName(review.name);
                                                  setEditingReviewRole(review.role);
                                                  setEditingReviewTradeType(review.trade_type);
                                                  setEditingReviewRating(review.rating);
                                                  setEditingReviewQuote(review.quote);
                                                  setEditingReviewProofUrl(review.proof_image_url);
                                                  setEditingReviewRegion(review.region || "");
                                                  const parsedCard = review.trade_type.split(" ")[0] || "Amazon";
                                                  setEditingReviewCardType(parsedCard);
                                                  setEditingReviewGcReceivedDate(review.gc_received_date ? new Date(review.gc_received_date).toISOString().split('T')[0] : "");
                                                  setEditingReviewPaymentSentDate(review.payment_sent_date ? new Date(review.payment_sent_date).toISOString().split('T')[0] : "");
                                                }}
                                                class="p-1.5 rounded-md border border-primary/20 text-primary hover:bg-primary/10 transition cursor-pointer"
                                                title="Edit review"
                                              >
                                                <Edit2 size={12} />
                                              </button>
                                              <button onClick={() => handleDeleteReview(review.id)} class="p-1.5 rounded-md border border-negative/15 text-negative hover:bg-negative/5 transition cursor-pointer"><Trash2 size={12} /></button>
                                            </div>
                                          </div>
                                          <p class="text-muted-foreground text-[12px] leading-relaxed mb-6 font-medium whitespace-pre-wrap">"{review.quote}"</p>
                                        </div>

                                        <div>
                                          <Show when={review.proof_image_url}>
                                            <div class="mb-5">
                                              <p class="text-[8px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-2">Verification Certificate</p>
                                              <button
                                                onClick={() => setZoomedImgUrl(review.proof_image_url)}
                                                class="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/[0.015] border border-border/60 hover:border-primary/50 hover:bg-foreground/[0.03] transition-all duration-300 group cursor-pointer w-full text-left"
                                              >
                                                <div class="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-border group-hover:border-primary/30 transition shadow-inner bg-black/40">
                                                  <img src={review.proof_image_url} alt="Proof Thumbnail" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                                                  <div class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <ImageIcon size={16} class="text-white" />
                                                  </div>
                                                </div>
                                                <div class="flex-grow min-w-0">
                                                  <div class="flex items-center gap-1 mb-0.5">
                                                    <span class="text-[8px] font-bold font-mono text-primary flex items-center gap-0.5"><CheckCircle2 size={8} /> SECURE</span>
                                                    <span class="h-1 w-1 rounded-full bg-border" />
                                                    <span class="text-[7.5px] font-mono text-muted-foreground uppercase">Proof</span>
                                                  </div>
                                                  <h5 class="text-[9px] font-black font-display text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors">View Receipt Verification</h5>
                                                  <p class="text-[7.5px] text-muted-foreground truncate font-semibold">Click to inspect receipt overlay</p>
                                                </div>
                                              </button>
                                            </div>
                                          </Show>

                                          {/* Dates / Payout Timeline Widget */}
                                          <div class="relative flex items-center justify-between mt-3 mb-6 px-4 py-2 rounded-2xl bg-foreground/[0.015] border border-border/40 shadow-inner">
                                            <div class="relative z-10 flex flex-col text-left">
                                              <span class="text-[8px] font-mono font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
                                                <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                                                Received
                                              </span>
                                              <span class="text-[10px] font-bold font-display text-foreground mt-0.5">{new Date(review.gc_received_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                            </div>

                                            <div class="absolute left-[28%] right-[28%] top-1/2 -translate-y-1/2 flex items-center justify-center">
                                              <div class="w-full h-0 border-t border-dashed border-border/60" />
                                              <span class="absolute px-2.5 py-0.5 rounded-full bg-background border border-border/60 text-[7px] font-mono font-bold text-muted-foreground uppercase whitespace-nowrap shadow-sm animate-pulse">
                                                {diffDays === 0 ? "⚡ Instant" : `${diffDays}d Settlement`}
                                              </span>
                                            </div>

                                            <div class="relative z-10 flex flex-col items-end text-right">
                                              <span class="text-[8px] font-mono font-bold uppercase text-emerald-400/90 tracking-wider flex items-center gap-1">
                                                Paid Out
                                                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                                              </span>
                                              <span class="text-[10px] font-bold font-display text-foreground mt-0.5">{new Date(review.payment_sent_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                            </div>
                                          </div>

                                          <div class="w-full h-[1px] bg-border/40 mb-4" />

                                          <div class="flex justify-between items-center text-xs">
                                            <div>
                                              <div class="font-bold text-foreground font-display text-[11px]">{review.name}</div>
                                              <div class="text-[10px] text-muted-foreground">{review.role}</div>
                                            </div>
                                            <div class="flex items-center gap-1.5">
                                              <Show when={review.region}>
                                                <span class={`text-[8px] font-black font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border ${review.region === 'US'
                                                  ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                                                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                                  }`}>
                                                  {review.region === 'US' ? '🇺🇸 US' : '🇬🇧 UK'}
                                                </span>
                                              </Show>
                                              <span class="text-[9px] font-bold font-mono text-primary bg-primary/10 border border-primary/25 rounded-[2px] px-2.5 py-0.5">
                                                {review.trade_type}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div class="space-y-4 text-xs w-full z-10 relative">
                                      <div class="flex justify-between items-center border-b border-border/40 pb-2 mb-2">
                                        <span class="font-bold font-display text-primary">Edit Review ID #{review.id}</span>
                                        <div class="flex gap-2">
                                          <button onClick={() => handleUpdateReview(review.id)} class="p-1.5 text-positive hover:bg-positive/5 border border-positive/15 rounded-lg cursor-pointer"><Check size={13} /></button>
                                          <button onClick={() => setEditingReviewId(null)} class="p-1.5 text-negative hover:bg-negative/5 border border-negative/15 rounded-lg cursor-pointer"><X size={13} /></button>
                                        </div>
                                      </div>

                                      <div>
                                        <label class="block text-[9px] font-mono text-muted-foreground mb-1">Name</label>
                                        <input
                                          type="text"
                                          value={editingReviewName()}
                                          onInput={(e) => setEditingReviewName(e.target.value)}
                                          class="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:border-primary"
                                        />
                                      </div>

                                      <div class="grid grid-cols-2 gap-2">
                                        <div>
                                          <label class="block text-[9px] font-mono text-muted-foreground mb-1">Card Type</label>
                                          <select
                                            value={editingReviewCardType()}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setEditingReviewCardType(val);
                                              setEditingReviewTradeType(`${val} ➔ UPI`);
                                              if (val !== 'Amazon') setEditingReviewRegion('');
                                            }}
                                            class="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:border-primary cursor-pointer [color-scheme:light-dark]"
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
                                          <label class="block text-[9px] font-mono text-muted-foreground mb-1">Route</label>
                                          <input
                                            type="text"
                                            value={editingReviewTradeType()}
                                            onInput={(e) => setEditingReviewTradeType(e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:border-primary"
                                          />
                                        </div>
                                      </div>

                                      <div class="grid grid-cols-2 gap-2">
                                        <div>
                                          <label class="block text-[9px] font-mono text-muted-foreground mb-1">Role</label>
                                          <input
                                            type="text"
                                            value={editingReviewRole()}
                                            onInput={(e) => setEditingReviewRole(e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                                          />
                                        </div>
                                        <Show when={editingReviewCardType() === 'Amazon' || editingReviewTradeType().toLowerCase().includes('amazon')}>
                                          <div>
                                            <label class="block text-[9px] font-mono text-muted-foreground mb-1">Region</label>
                                            <select
                                              value={editingReviewRegion()}
                                              onChange={(e) => setEditingReviewRegion(e.target.value)}
                                              class="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none cursor-pointer [color-scheme:light-dark]"
                                            >
                                              <option value="">None</option>
                                              <option value="US">🇺🇸 US</option>
                                              <option value="UK">🇬🇧 UK</option>
                                            </select>
                                          </div>
                                        </Show>
                                      </div>

                                      <div class="grid grid-cols-2 gap-2">
                                        <div>
                                          <label class="block text-[9px] font-mono text-muted-foreground mb-1">GC Received Date</label>
                                          <input
                                            type="date"
                                            value={editingReviewGcReceivedDate()}
                                            onInput={(e) => setEditingReviewGcReceivedDate(e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none [color-scheme:light-dark]"
                                          />
                                        </div>
                                        <div>
                                          <label class="block text-[9px] font-mono text-muted-foreground mb-1">Payment Sent Date</label>
                                          <input
                                            type="date"
                                            value={editingReviewPaymentSentDate()}
                                            onInput={(e) => setEditingReviewPaymentSentDate(e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none [color-scheme:light-dark]"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label class="block text-[9px] font-mono text-muted-foreground mb-1.5">Rating (1-5)</label>
                                        <div class="flex items-center gap-1.5 mb-2">
                                          <For each={[1, 2, 3, 4, 5]}>
                                            {(star) => (
                                              <button
                                                type="button"
                                                onClick={() => setEditingReviewRating(star)}
                                                class="focus:outline-none"
                                              >
                                                <Star
                                                  size={16}
                                                  class={`${star <= editingReviewRating()
                                                    ? "fill-[var(--primary)] text-[var(--primary)] filter drop-shadow-[0_0_2px_rgba(14,165,233,0.3)]"
                                                    : "text-muted-foreground/45"
                                                    }`}
                                                />
                                              </button>
                                            )}
                                          </For>
                                        </div>
                                      </div>

                                      <div>
                                        <label class="block text-[9px] font-mono text-muted-foreground mb-1">Quote Description</label>
                                        <textarea
                                          value={editingReviewQuote()}
                                          onInput={(e) => setEditingReviewQuote(e.target.value)}
                                          rows={3}
                                          class="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none resize-none"
                                        />
                                      </div>

                                      <div>
                                        <label class="block text-[9px] font-mono text-muted-foreground mb-1">Proof Image URL</label>
                                        <div class="flex gap-2">
                                          <input
                                            type="text"
                                            value={editingReviewProofUrl()}
                                            onInput={(e) => setEditingReviewProofUrl(e.target.value)}
                                            class="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none font-mono"
                                          />
                                          <div class="relative shrink-0 border border-dashed border-border rounded-lg px-3 py-1 flex items-center justify-center bg-foreground/[0.01] hover:bg-foreground/[0.02] cursor-pointer">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => handleAdminImageUpload(e, true)}
                                              class="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <Show
                                              when={editingReviewUploading()}
                                              fallback={<Upload size={12} class="text-muted-foreground" />}
                                            >
                                              <Loader2 size={12} class="animate-spin text-primary" />
                                            </Show>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Show>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                      </Show>
                    </Show>
                  </div>
                </div>
              </Match>

              {/* 4. APPEALS TAB */}
              <Match when={activeTab() === "appeals"}>
                <div class="space-y-6 text-left">
                  <div class="liquid-glass rounded-2xl p-6 border border-border/60 shadow-lg relative overflow-hidden">
                    <div class="absolute top-0 right-0 h-12 w-12 bg-primary/5 rounded-bl-xl flex items-center justify-center text-primary">
                      <ShieldAlert size={16} />
                    </div>

                    <h2 class="text-base font-bold font-display text-foreground mb-1">User Payment Appeals & Complaints</h2>
                    <p class="text-xs text-muted-foreground mb-6">Manage complaints filed by users regarding delayed payouts. Investigate card details and modify resolution status.</p>

                    {/* Status Filters */}
                    <div class="flex flex-wrap gap-2 mb-6 bg-foreground/[0.02] border border-border p-1.5 rounded-full max-w-full overflow-x-auto no-scrollbar">
                      <For each={[
                        { label: "All", count: appeals().length },
                        { label: "Pending", count: appeals().filter(a => a.status === "Pending" || !a.status).length, color: "text-accent bg-accent/10 border-accent/15" },
                        { label: "Under Investigation", count: appeals().filter(a => a.status === "Under Investigation").length, color: "text-secondary bg-secondary/5 border-blue-500/20" },
                        { label: "Resolved", count: appeals().filter(a => a.status === "Resolved").length, color: "text-positive bg-positive/5 border-positive/15" },
                        { label: "Rejected", count: appeals().filter(a => a.status === "Rejected").length, color: "text-negative bg-negative/5 border-negative/15" }
                      ]}>
                        {(tab) => (
                          <button
                            type="button"
                            onClick={() => setAppealFilterStatus(tab.label)}
                            class={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border ${appealFilterStatus() === tab.label
                              ? "bg-primary/15 border-primary/30 text-primary"
                              : "bg-foreground/[0.01] border-border text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                              }`}
                          >
                            <span>{tab.label}</span>
                            <span class={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${appealFilterStatus() === tab.label
                              ? "bg-primary/10 text-primary"
                              : tab.count > 0 ? (tab.color?.replace("rounded-md", "rounded-full") || "text-foreground bg-foreground/10 border-border rounded-full") : "text-muted-foreground bg-foreground/[0.04] border-transparent rounded-full"
                              }`}>
                              {tab.count}
                            </span>
                          </button>
                        )}
                      </For>
                    </div>

                    <Show
                      when={!loadingAppeals()}
                      fallback={
                        <div class="flex flex-col items-center justify-center py-10 space-y-2">
                          <Loader2 class="animate-spin text-primary h-6 w-6" />
                          <span class="text-[10px] text-muted-foreground font-mono">Loading appeals...</span>
                        </div>
                      }
                    >
                      <Show
                        when={appeals().filter(a => {
                          if (appealFilterStatus() === "All") return true;
                          if (appealFilterStatus() === "Pending") return a.status === "Pending" || !a.status;
                          return a.status === appealFilterStatus();
                        }).length > 0}
                        fallback={
                          <div class="text-center py-12 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                            No active appeals found matching status: <strong class="text-primary">{appealFilterStatus()}</strong>
                          </div>
                        }
                      >
                        <div class="grid gap-6">
                          <For each={appeals().filter(a => {
                            if (appealFilterStatus() === "All") return true;
                            if (appealFilterStatus() === "Pending") return a.status === "Pending" || !a.status;
                            return a.status === appealFilterStatus();
                          })}>
                            {(appeal) => {
                              const filedDate = new Date(appeal.created_at);
                              const currentStatus = appeal.status || "Pending";
                              return (
                                <div
                                  class="liquid-glass rounded-2xl p-5 sm:p-6 border border-border/60 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 hover:border-border/80 transition duration-300 text-left"
                                  style={{
                                    "border-left": `4px solid ${currentStatus === "Resolved"
                                      ? "#10b981"
                                      : currentStatus === "Rejected"
                                        ? "#ef4444"
                                        : currentStatus === "Under Investigation"
                                          ? "#3b82f6"
                                          : "#f59e0b"
                                      }`
                                  }}
                                >
                                  <div class="flex-1 space-y-4">
                                    <div class="flex flex-wrap items-center gap-2">
                                      <span class="text-[9px] font-mono text-muted-foreground font-bold uppercase bg-foreground/[0.03] border border-border/60 rounded px-2.5 py-0.5">TICKET #{appeal.id}</span>
                                      <span class="text-[10px] font-mono text-muted-foreground">Filed: {filedDate.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                      <span class="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold">{appeal.card_type}</span>
                                    </div>

                                    <div class="grid sm:grid-cols-2 gap-4 bg-foreground/[0.01] border border-border/40 rounded-xl p-4">
                                      <div class="space-y-1.5">
                                        <span class="text-[9px] font-mono uppercase text-muted-foreground block">Client Profile</span>
                                        <div class="font-bold text-foreground text-xs sm:text-sm">{appeal.name}</div>
                                        <div class="flex items-center text-[10px] text-muted-foreground font-mono">
                                          <span>Phone: {appeal.phone}</span>
                                          <button onClick={() => { navigator.clipboard.writeText(appeal.phone); showNotification("Phone number copied!"); }} class="p-1 hover:bg-foreground/[0.05] rounded-md text-muted-foreground hover:text-primary transition shrink-0 ml-1 cursor-pointer"><Copy size={10} /></button>
                                        </div>
                                        <div class="flex items-center text-[10px] text-primary font-mono">
                                          <span class="truncate max-w-[170px]">Email: {appeal.email}</span>
                                          <button onClick={() => { navigator.clipboard.writeText(appeal.email); showNotification("Email copied!"); }} class="p-1 hover:bg-foreground/[0.05] rounded-md text-muted-foreground hover:text-primary transition shrink-0 ml-1 cursor-pointer"><Copy size={10} /></button>
                                        </div>
                                      </div>

                                      <div class="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border/40 pt-3 sm:pt-0 sm:pl-4">
                                        <span class="text-[9px] font-mono uppercase text-muted-foreground block">Payout Wallet / Address</span>
                                        <div class="flex items-center text-[11px] font-mono text-foreground select-all bg-foreground/[0.02] border border-border/60 rounded-md px-2.5 py-1.5 justify-between">
                                          <span class="truncate max-w-[130px] font-semibold text-positive" title={appeal.payout_address}>{appeal.payout_address}</span>
                                          <button onClick={() => { navigator.clipboard.writeText(appeal.payout_address); showNotification("Address copied!"); }} class="p-1 hover:bg-foreground/[0.05] rounded-md text-muted-foreground hover:text-primary transition shrink-0 ml-1.5 cursor-pointer"><Copy size={11} /></button>
                                        </div>
                                      </div>
                                    </div>

                                    <div class="space-y-1">
                                      <span class="text-[9px] font-mono uppercase text-muted-foreground block">Client Context Message</span>
                                      <div class="relative p-4 rounded-xl bg-foreground/[0.02] border border-border/40 text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap select-text">
                                        {appeal.details || <em class="opacity-30">No details provided.</em>}
                                      </div>
                                    </div>
                                  </div>

                                  <div class="flex flex-col justify-between items-start md:items-end gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                                    <button onClick={() => handleDeleteAppeal(appeal.id)} class="p-2 rounded-xl border border-negative/15 text-negative hover:bg-negative/5 transition cursor-pointer self-end"><Trash2 size={13} /></button>

                                    <div class="w-full space-y-2">
                                      <span class="text-[9px] font-mono uppercase text-muted-foreground block md:text-right">Set Resolution</span>
                                      <div class="flex flex-wrap md:justify-end gap-1.5">
                                        <For each={[
                                          { label: "Pending", style: "bg-accent/10 border-accent/15 text-accent hover:bg-accent/20" },
                                          { label: "Under Investigation", style: "bg-secondary/5 border-blue-500/20 text-secondary hover:bg-secondary/20" },
                                          { label: "Resolved", style: "bg-positive/5 border-positive/15 text-positive hover:bg-positive/20" },
                                          { label: "Rejected", style: "bg-negative/5 border-negative/15 text-negative hover:bg-negative/20" }
                                        ]}>
                                          {(opt) => {
                                            const isSel = currentStatus === opt.label;
                                            return (
                                              <button
                                                onClick={() => handleUpdateAppealStatus(appeal.id, opt.label)}
                                                class={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition duration-200 cursor-pointer ${isSel ? opt.style + " ring-1 ring-offset-1 ring-offset-background ring-primary/20 scale-102 font-black" : "bg-foreground/[0.01] border-border/80 text-muted-foreground hover:text-foreground"
                                                  }`}
                                              >
                                                {opt.label}
                                              </button>
                                            );
                                          }}
                                        </For>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                      </Show>
                    </Show>
                  </div>
                </div>
              </Match>
            </Switch>

          </div>
        </Show>
      </Show>

      {/* Fullscreen Photo Lightbox Overlay */}
      <Show when={zoomedImgUrl()}>
        <div
          onClick={() => setZoomedImgUrl(null)}
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-background p-2"
          >
            <img src={zoomedImgUrl()} alt="Zoomed Receipt" class="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <button
              onClick={() => setZoomedImgUrl(null)}
              class="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-md border border-white/10 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </Show>

      {/* Appeal Action Reason Prompt Modal */}
      <Show when={showAppealActionModal()}>
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            class="w-full max-w-lg bg-background/95 border border-border/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative transform scale-100 transition duration-300 text-left"
          >
            {/* Close button */}
            <button
              onClick={() => { setShowAppealActionModal(false); setAppealActionTarget(null); }}
              class="absolute top-4 right-4 p-1.5 hover:bg-foreground/[0.05] rounded-full text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <form onSubmit={handleConfirmAppealAction} class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="text-xl">
                  {appealActionTarget()?.status === "Resolved" ? "✅" : "🚫"}
                </span>
                <h3 class="text-base font-bold text-foreground">
                  {appealActionTarget()?.status === "Resolved"
                    ? "Resolve Appeal & Document Findings"
                    : "Reject Appeal & State Reason"}
                </h3>
              </div>

              <p class="text-xs text-muted-foreground leading-relaxed font-sans">
                {appealActionTarget()?.status === "Resolved"
                  ? "Describe the processing mistake identified and findings. This explanation will be sent as an official resolution email to the user."
                  : "State the reason for rejecting this appeal. Be precise, as this information will be emailed directly to the user."}
              </p>

              <div class="space-y-1.5">
                <label class="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                  {appealActionTarget()?.status === "Resolved"
                    ? "Explain Mistake & Findings (Required)"
                    : "Rejection Reason (Required)"}
                </label>
                <textarea
                  value={appealActionNotes()}
                  onInput={(e) => setAppealActionNotes(e.target.value)}
                  placeholder={
                    appealActionTarget()?.status === "Resolved"
                      ? "e.g., We identified a script error that skipped processing for this card. We have manually verified the card and correction payout has been sent..."
                      : "e.g., The card code provided was verified as already redeemed prior to your transaction submission..."
                  }
                  required
                  rows={4}
                  class="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.02] border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition resize-none placeholder-muted-foreground/60 font-sans"
                />
              </div>

              <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => { setShowAppealActionModal(false); setAppealActionTarget(null); }}
                  class="px-4 py-2 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] text-xs font-bold rounded-full transition cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={appealActionSubmitLoading()}
                  class="px-5 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-50 text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5 font-sans"
                >
                  <Show when={appealActionSubmitLoading()}>
                    <span class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  </Show>
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default AdminPage;
