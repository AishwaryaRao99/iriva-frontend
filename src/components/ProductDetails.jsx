import { useEffect, useState } from "react";
import { getProductReviews, getReviewTags } from "../services/searchService";
import { addReview, deleteReview, getSavedProductStatus, removeSavedProduct, saveProduct, updateReview } from "../services/profileService";

const statusStyles = {
  Safe: "border-green-200 bg-green-50 text-green-900",
  Caution: "border-yellow-200 bg-yellow-50 text-yellow-900",
  Warning: "border-orange-200 bg-orange-50 text-orange-900",
  Harmful: "border-red-200 bg-red-50 text-red-900",
};

const iconMap = {
  "heart-icon": "❤️",
  "check-icon": "✓",
  "secure-icon": "🛡️",
  "warning-icon": "⚠️",
  "leaf-icon": "🍃",
  "globe-icon": "🌍",
  "doctor-icon": "🩺",
  "shield-icon": "🛡️",
  "bunny-icon": "🐰",
  "eye-icon": "👁️",
  "handshake-icon": "🤝",
  "link-icon": "🔗",
  "certified-icon": "✅",
  "snowflake-icon": "❄️",
  "tree-icon": "🌲",
  "water-icon": "💧",
  "flower-icon": "🌸",
  "recycle-icon": "♻️",
};

const getIcon = (icon) => iconMap[icon] || icon || "ℹ️";

const getAssessmentTone = (value) => {
  const normalizedValue = `${value || ""}`.toLowerCase();
  const tones = {
    green: {
      card: "border-green-200 bg-green-50",
      icon: "bg-green-100 text-green-600",
      value: "text-green-700",
      badge: "bg-green-100 text-green-700",
      dot: "bg-green-500",
    },
    amber: {
      card: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
    },
    red: {
      card: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-600",
      value: "text-red-700",
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500",
    },
    neutral: {
      card: "border-gray-200 bg-gray-50",
      icon: "bg-gray-100 text-gray-500",
      value: "text-gray-600",
      badge: "bg-gray-100 text-gray-600",
      dot: "bg-gray-500",
    },
  };

  if (normalizedValue === "high") return tones.green;
  if (normalizedValue === "moderate") return tones.amber;
  if (normalizedValue === "low") return tones.red;
  return tones.neutral;
};

/**
 * ProductDetails Component
 * Displays detailed product information including ingredients and ethical summary
 * Props:
 * - product (object) - product data
 * - onClose (function) - callback to close the details view
 * - backLabel (string) - label for the back button
 */
export default function ProductDetails({ product, onClose, backLabel, isAuthenticated = true, onRequireAuthentication }) {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewTags, setReviewTags] = useState([]);
  const [selectedReviewTags, setSelectedReviewTags] = useState([]);
  const [reviewTagsLoading, setReviewTagsLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadSavedStatus = async () => {
      if (!product?.id || !isAuthenticated) {
        setIsSaved(false);
        return;
      }

      try {
        const savedStatus = await getSavedProductStatus(product.id);
        if (isCurrent) setIsSaved(savedStatus?.saved === true);
      } catch {
        if (isCurrent) setIsSaved(false);
      }
    };

    loadSavedStatus();
    return () => {
      isCurrent = false;
    };
  }, [product?.id, isAuthenticated]);

  useEffect(() => {
    let isCurrent = true;

    const loadReviews = async () => {
      if (!product?.id) {
        setReviews([]);
        return;
      }

      try {
        const productReviews = await getProductReviews(product.id);
        if (isCurrent) setReviews(productReviews);
      } catch (error) {
        if (isCurrent) setReviews([]);
      }
    };

    loadReviews();
    return () => {
      isCurrent = false;
    };
  }, [product?.id]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / totalReviews).toFixed(1) : "0.0";
  const ratingCounts = [0, 0, 0, 0, 0, 0];
  reviews.forEach((r) => (ratingCounts[Number(r.rating) || 0] += 1));
  const orderedReviews = [...reviews].sort((firstReview, secondReview) =>
    Number(secondReview.editable === true) - Number(firstReview.editable === true)
  );

  const handleStartReview = () => {
    if (!isAuthenticated) {
      onRequireAuthentication?.();
      return;
    }
    setShowReviewForm(true);
    loadReviewTags();
  };
  const handleCancelReview = () => {
    setShowReviewForm(false);
    setReviewError("");
    setNewReviewRating(5);
    setNewReviewText("");
    setSelectedReviewTags([]);
  };

  const loadReviewTags = async () => {
    setReviewError("");
    setReviewTagsLoading(true);
    try {
      setReviewTags(await getReviewTags(product.id));
    } catch (error) {
      setReviewTags([]);
      setReviewError(error.message || "Unable to load review tags.");
    } finally {
      setReviewTagsLoading(false);
    }
  };
  const handleSubmitReview = async (e) => {
    e?.preventDefault?.();
    setReviewError("");
    setReviewSubmitting(true);

    try {
      const createdReview = await addReview(product.id, {
        rating: Number(newReviewRating),
        text: newReviewText.trim(),
        tags: selectedReviewTags,
      });
      setReviews((prev) => [createdReview, ...prev]);
      handleCancelReview();
    } catch (error) {
      setReviewError(error.message || "Unable to submit your review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleStartEditReview = async (review) => {
    if (review?.editable !== true) return;

    setReviewError("");
    setEditingReviewId(review.id);
    setNewReviewRating(review.rating || 5);
    setNewReviewText(review.text || "");
    setSelectedReviewTags(Array.isArray(review.tags) ? review.tags : []);
    setShowReviewForm(false);
    if (reviewTags.length === 0) await loadReviewTags();
  };

  const handleUpdateReview = async (e) => {
    e?.preventDefault?.();
    setReviewError("");
    setReviewActionLoading(true);

    try {
      const updatedReview = await updateReview(editingReviewId, {
        rating: Number(newReviewRating),
        text: newReviewText.trim(),
        tags: selectedReviewTags,
      });
      setReviews((currentReviews) => currentReviews.map((review) =>
        review.id === editingReviewId ? { ...review, ...updatedReview } : review
      ));
      setEditingReviewId(null);
      setNewReviewText("");
      setNewReviewRating(5);
      setSelectedReviewTags([]);
    } catch (error) {
      setReviewError(error.message || "Unable to update your review.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (review?.editable !== true) return;

    if (!window.confirm("Delete this review?")) return;
    setReviewError("");
    setReviewActionLoading(true);

    try {
      await deleteReview(reviewId);
      setReviews((currentReviews) => currentReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      setReviewError(error.message || "Unable to delete your review.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!isAuthenticated) {
      onRequireAuthentication?.();
      return;
    }
    if (!product?.id || saveLoading) return;

    setSaveError("");
    setSaveLoading(true);
    try {
      if (isSaved) {
        await removeSavedProduct(product.id);
        setIsSaved(false);
      } else {
        await saveProduct(product.id);
        setIsSaved(true);
      }
    } catch (error) {
      setSaveError(error.message || "Unable to update saved products.");
    } finally {
      setSaveLoading(false);
    }
  };

  const title = product?.productName || product?.name || "Product Details";
  const description = product?.description || product?.summary || "";
  const category = product?.category || product?.categoryName || "Skincare";
  const ethicalScore = typeof product?.ethicalScore === "number" ? product.ethicalScore : product?.ethicalScore ?? null;

  // Use dynamic product values from backend data, with graceful empty-state handling.
  const ethicalSummary = Array.isArray(product?.ethicalSummary)
    ? product.ethicalSummary.map((item) => ({
        title: item?.title || "Untitled summary",
        description: item?.description || "No description available.",
        icon: getIcon(item?.icon),
      }))
    : [];

  const ingredientList = Array.isArray(product?.ingredients)
    ? product.ingredients
    : [];
  const productInsights = product?.productInsights || {};
  const findings = Array.isArray(productInsights.findings) ? productInsights.findings : [];
  const sources = Array.isArray(productInsights.sources) ? productInsights.sources : [];
  const ingredientSafety = product?.ingredientSafety || "";
  const informationQuality = product?.informationQuality || "";
  const evidenceQuality = product?.evidenceQuality || "";
  const ingredientSafetyTone = getAssessmentTone(ingredientSafety);
  const informationQualityTone = getAssessmentTone(informationQuality);
  const evidenceQualityTone = getAssessmentTone(evidenceQuality);

  const statusBadgeStyles = {
    Safe: "bg-green-100 text-green-900 border border-green-200",
    Caution: "bg-yellow-100 text-yellow-900 border border-yellow-200",
    Warning: "bg-orange-100 text-orange-900 border border-orange-200",
    Harmful: "bg-red-100 text-red-900 border border-red-200",
  };

  const tabs = [
    { id: "ingredients", label: "Ingredients" },
    { id: "insights", label: "Product Insights" },
    { id: "reviews", label: "Community Reviews" },
  ];

  const company = product?.company || product?.brand || product?.manufacturer || "";

  return (
    <section className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 xl:py-8 border-b border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-base sm:text-lg font-medium text-green-600 hover:text-green-800 focus:outline-none transition"
          aria-label="Go back"
        >
          <span className="text-xl">←</span>
          {backLabel || "Back"}
        </button>
      </div>

      {/* Main Content */}
      {/* Use product-page-padding to leave 20% left/right on desktop, 5% on mobile/tablet */}
      <div className="product-page-padding py-8 sm:py-10 xl:py-12">
        {/* Image + Details Container: keeps product image constrained in width so it doesn't stretch wide */}
        <div className="grid gap-4 lg:grid-cols-[1fr_640px] mb-8 auto-rows-max lg:auto-rows-fr">
          {/* Product Image: contained with square aspect ratio and larger desktop width */}
          <div className="lg:col-start-1 lg:self-stretch flex items-stretch">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm w-full">
              <img
                src={product?.imageUrl || "https://images.unsplash.com/photo-1618480066690-8457ab2b766e?w=800"}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Product Details: sticky on desktop, flows below image on mobile */}
          <aside className="lg:col-start-2 lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-200 p-8 pt-12 shadow-sm">
            {/* Company/Brand Label */}
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-2">{company || 'Brand'}</p>
            
            {/* Product Title */}
            <h2 className="text-4xl font-bold text-gray-900 mb-5">{title}</h2>

            {/* Product assessment tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className={`min-h-32.25 flex flex-col items-center justify-center rounded-xl border px-2 py-4 text-center ${ingredientSafetyTone.card}`}>
                <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${ingredientSafetyTone.icon}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className={`text-sm font-semibold ${ingredientSafetyTone.value}`}>{ingredientSafety || "Not provided"}</span>
                <span className="mt-2 text-xs text-gray-600">Ingredient Safety</span>
              </div>
              <div className={`min-h-32.25 flex flex-col items-center justify-center rounded-xl border px-2 py-4 text-center ${informationQualityTone.card}`}>
                <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${informationQualityTone.icon}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3 14.8 5l3.4.4.4 3.4 2 2.8-2 2.8-.4 3.4-3.4.4-2.8 2-2.8-2-3.4-.4-.4-3.4-2-2.8 2-2.8.4-3.4L9.2 5 12 3z" />
                    <path d="m9.5 12 1.7 1.7 3.5-3.5" />
                  </svg>
                </span>
                <span className={`text-sm font-semibold ${informationQualityTone.value}`}>{informationQuality || "Not provided"}</span>
                <span className="mt-2 text-xs text-gray-600">Information Quality</span>
              </div>
              <div className={`min-h-32.25 flex flex-col items-center justify-center rounded-xl border px-2 py-4 text-center ${evidenceQualityTone.card}`}>
                <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${evidenceQualityTone.icon}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 3h6" />
                    <path d="M10 3v7.5L4.8 19a1.5 1.5 0 0 0 1.3 2.2h11.8a1.5 1.5 0 0 0 1.3-2.2L14 10.5V3" />
                    <path d="M7 16h10" />
                  </svg>
                </span>
                <span className={`text-sm font-semibold ${evidenceQualityTone.value}`}>{evidenceQuality || "Not provided"}</span>
                <span className="mt-2 text-xs text-gray-600">Evidence Quality</span>
              </div>
            </div>

            {/* Product Description */}
            {description && <p className="text-base text-gray-700 leading-relaxed mb-7">{description}</p>}

            {/* Ethical Summary Heading */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ethical Summary</h3>
            
            {/* Ethical Summary Items */}
            {ethicalSummary.length > 0 ? (
              <div className="grid gap-3 mb-6">
                {ethicalSummary.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-6">No ethical summary data is available for this product.</p>
            )}

            {/* Save to Profile Button + Favorite */}
            <div className="flex gap-3 items-stretch">
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={saveLoading}
                className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none transition hover:bg-green-700 disabled:opacity-70"
              >
                {saveLoading ? "Saving..." : isSaved ? "Remove from Profile" : "Save to Profile"}
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={saveLoading}
                className={`shrink-0 p-3 text-gray-400 focus:outline-none transition border border-gray-200 rounded-lg disabled:opacity-70 ${isSaved ? "text-green-600" : "hover:text-green-600"}`}
                aria-label="Add to favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
            </div>
            {saveError && <p className="mt-2 text-sm text-red-600">{saveError}</p>}
          </aside>
        </div>

        {/* Ingredients/Tabs Section: full-width and separate from image+details container */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-4 text-base font-medium whitespace-nowrap transition focus:outline-none ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8">
                {activeTab === "ingredients" && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ingredient Breakdown</h3>
                    <p className="text-base text-gray-600 mb-6">
                      Review each ingredient to understand the product makeup and any risk details.
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {ingredientList.length > 0 ? (
                        ingredientList.map((ingredient) => {
                          const safetyStatus = ingredient.safetyStatus || ingredient.status || "Safe";
                          const inciValue = ingredient.inciName || ingredient.name;
                          return (
                            <div
                              key={`${ingredient.name}-${safetyStatus}`}
                              className={`w-full lg:w-[60%] rounded-xl border-2 p-4 transition ${
                                statusStyles[safetyStatus] || statusStyles.Safe
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="font-semibold text-gray-900 text-base">{ingredient.name}</p>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                                  statusBadgeStyles[safetyStatus] || statusBadgeStyles.Safe
                                }`}>
                                  {safetyStatus}
                                </span>
                              </div>
                              <p className="mt-1 font-mono text-xs text-gray-500">INCI: {inciValue}</p>
                              {ingredient.description && (
                                <p className="mt-3 text-base text-gray-700">{ingredient.description}</p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-600">No ingredient details are available for this product.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "insights" && (
                  <div className="w-full space-y-5">
                    <h3 className="text-2xl font-semibold text-gray-900">Product Insights</h3>

                    <section className="overflow-hidden rounded-xl border border-green-200">
                      <div className="flex items-center justify-between gap-4 border-b border-green-200 bg-green-50 px-5 py-4">
                        <div className="flex items-center gap-3 font-semibold text-gray-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 3 14.8 5l3.4.4.4 3.4 2 2.8-2 2.8-.4 3.4-3.4.4-2.8 2-2.8-2-3.4-.4-.4-3.4-2-2.8 2-2.8.4-3.4L9.2 5 12 3z" />
                            <path d="m9.5 12 1.7 1.7 3.5-3.5" />
                          </svg>
                          <span>Information Quality</span>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${informationQualityTone.badge}`}>
                          <span className={`h-2 w-2 rounded-full ${informationQualityTone.dot}`} />
                          {informationQuality || "Not provided"}
                        </span>
                      </div>
                      {productInsights.informationQualitySummary && (
                        <p className="px-5 py-4 text-sm leading-6 text-gray-600">{productInsights.informationQualitySummary}</p>
                      )}
                    </section>

                    <section className="overflow-hidden rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between gap-4 border-b border-amber-200 bg-amber-50 px-5 py-4">
                        <div className="flex items-center gap-3 font-semibold text-gray-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 3h6" />
                            <path d="M10 3v7.5L4.8 19a1.5 1.5 0 0 0 1.3 2.2h11.8a1.5 1.5 0 0 0 1.3-2.2L14 10.5V3" />
                            <path d="M7 16h10" />
                          </svg>
                          <span>Evidence Quality</span>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${evidenceQualityTone.badge}`}>
                          <span className={`h-2 w-2 rounded-full ${evidenceQualityTone.dot}`} />
                          {evidenceQuality || "Not provided"}
                        </span>
                      </div>
                      {productInsights.evidenceQualitySummary && (
                        <p className="px-5 py-4 text-sm leading-6 text-gray-600">{productInsights.evidenceQualitySummary}</p>
                      )}
                    </section>

                    <section className="overflow-hidden rounded-xl border border-gray-200">
                      <h4 className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 font-semibold text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                        </svg>
                        What we found
                      </h4>
                      {findings.length > 0 ? (
                        <ul className="space-y-3 px-5 py-4 text-sm text-gray-600">
                          {findings.map((finding, index) => (
                            <li key={`${finding}-${index}`} className="flex items-start gap-3">
                              <span className="text-green-500">✓</span>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-5 py-4 text-sm text-gray-500">No findings provided.</p>
                      )}
                    </section>

                    <section className="overflow-hidden rounded-xl border border-gray-200">
                      <h4 className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 font-semibold text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                        Sources
                      </h4>
                      <div className="flex flex-wrap gap-2 px-5 py-4">
                        {sources.length > 0 ? sources.map((source, index) => (
                          <span key={`${source}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                            {source}
                          </span>
                        )) : <p className="text-sm text-gray-500">No sources provided.</p>}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Community Reviews</h3>
                        <p className="text-gray-600 text-base mb-4">See what other customers say and share your experience.</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleStartReview}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none"
                        >
                          Add Review
                        </button>
                      </div>
                    </div>

                    {/* Ratings Summary */}
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="md:flex md:items-center md:gap-8">
                        <div className="md:shrink-0">
                          <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                          <div className="text-sm text-gray-500">Based on {totalReviews} reviews</div>
                        </div>

                        <div className="mt-4 md:mt-0 md:flex-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const star = 5 - i;
                            const count = ratingCounts[star] || 0;
                            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return (
                              <div key={star} className="flex items-center gap-4 my-2">
                                <div className="w-12 text-sm text-gray-600">{star} star</div>
                                <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                                  <div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                </div>
                                <div className="w-8 text-right text-sm text-gray-600">{count}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Add Review Form (revealed) */}
                    {showReviewForm && (
                      <form onSubmit={handleSubmitReview} className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                        <div className="flex flex-col gap-3">
                          <label className="text-sm font-medium text-gray-700">Your rating</label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(e.target.value)}
                            className="w-28 rounded-md border-gray-200"
                          >
                            <option value={5}>5 - Excellent</option>
                            <option value={4}>4 - Good</option>
                            <option value={3}>3 - Okay</option>
                            <option value={2}>2 - Poor</option>
                            <option value={1}>1 - Terrible</option>
                          </select>

                          <label className="text-sm font-medium text-gray-700">Your review</label>
                          <textarea
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            rows={4}
                            className="w-full rounded-md border-gray-200 p-3 text-sm text-gray-800"
                            placeholder="Share your experience with this product"
                            required
                          />

                          {reviewTagsLoading && <p className="text-sm text-gray-500">Loading review tags...</p>}
                          {!reviewTagsLoading && reviewTags.length > 0 && (
                            <fieldset className="flex flex-col gap-2">
                              <legend className="text-sm font-medium text-gray-700">Tags</legend>
                              <div className="flex flex-wrap gap-2">
                                {reviewTags.map((tag) => (
                                  <label key={tag} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
                                    <input
                                      type="checkbox"
                                      checked={selectedReviewTags.includes(tag)}
                                      onChange={() =>
                                        setSelectedReviewTags((currentTags) =>
                                          currentTags.includes(tag)
                                            ? currentTags.filter((currentTag) => currentTag !== tag)
                                            : [...currentTags, tag]
                                        )
                                      }
                                    />
                                    {tag}
                                  </label>
                                ))}
                              </div>
                            </fieldset>
                          )}

                          <div className="flex gap-3 mt-2">
                            <button type="submit" disabled={reviewSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-70">
                              {reviewSubmitting ? "Submitting..." : "Submit"}
                            </button>
                            <button type="button" onClick={handleCancelReview} className="px-4 py-2 rounded-md border border-gray-200">Cancel</button>
                          </div>
                          {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="mt-6 space-y-4">
                      {reviews.length > 0 ? (
                        orderedReviews.map((r) => (
                          <div key={r.id} className="rounded-lg border border-gray-200 p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{r.name || "Anonymous reviewer"}</div>
                                <div className="text-sm text-gray-500">{r.time}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-yellow-400 font-semibold">{Array.from({ length: r.rating }).map((_, idx) => '★')}</div>
                                <div className="text-sm text-gray-600">{r.rating}</div>
                                {r.editable === true && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditReview(r)}
                                      disabled={reviewActionLoading}
                                      className="p-1 text-gray-500 hover:text-green-600 disabled:opacity-50"
                                      aria-label="Edit review"
                                      title="Edit review"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-8.486 8.486a2 2 0 01-.708.414l-4 1a2 2 0 01-1.213-1.213l1-4a2 2 0 01.414-.708l8.486-8.486a2 2 0 012.828 0z" /></svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReview(r.id)}
                                      disabled={reviewActionLoading}
                                      className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                                      aria-label="Delete review"
                                      title="Delete review"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.5 2a1 1 0 00-1 1v1H4a1 1 0 100 2h.5v10a2 2 0 002 2h7a2 2 0 002-2V6H16a1 1 0 100-2h-3.5V3a1 1 0 01-1-1h-3zm1 2h1V3h-1v1zM8 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            {editingReviewId === r.id ? (
                              <form onSubmit={handleUpdateReview} className="mt-4 flex flex-col gap-3">
                                <select value={newReviewRating} onChange={(e) => setNewReviewRating(e.target.value)} className="w-28 rounded-md border-gray-200">
                                  <option value={5}>5 - Excellent</option>
                                  <option value={4}>4 - Good</option>
                                  <option value={3}>3 - Okay</option>
                                  <option value={2}>2 - Poor</option>
                                  <option value={1}>1 - Terrible</option>
                                </select>
                                <textarea value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} rows={3} className="w-full rounded-md border-gray-200 p-3 text-sm text-gray-800" required />
                                {!reviewTagsLoading && reviewTags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {reviewTags.map((tag) => (
                                      <label key={tag} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
                                        <input type="checkbox" checked={selectedReviewTags.includes(tag)} onChange={() => setSelectedReviewTags((currentTags) => currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag])} />
                                        {tag}
                                      </label>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <button type="submit" disabled={reviewActionLoading} className="rounded-md bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50">Save</button>
                                  <button type="button" onClick={() => setEditingReviewId(null)} className="rounded-md border border-gray-200 px-3 py-2 text-sm">Cancel</button>
                                </div>
                              </form>
                            ) : <p className="mt-3 text-gray-700 text-sm">{r.text}</p>}
                            {Array.isArray(r.tags) && r.tags.length > 0 && (
                              <div className="mt-3 flex gap-2 flex-wrap">
                                {r.tags.map((t) => (
                                  <span key={t} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No reviews yet. Be the first to add one.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
