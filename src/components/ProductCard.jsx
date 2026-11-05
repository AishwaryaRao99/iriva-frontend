const assessments = [
  { key: "ingredientSafety", label: "Ingredient Safety" },
  { key: "informationQuality", label: "Information" },
  { key: "evidenceQuality", label: "Evidence" },
];

const getAssessmentStyle = (value) => {
  const normalizedValue = `${value || ""}`.toLowerCase();

  if (["high", "safe", "good"].includes(normalizedValue)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["moderate", "caution"].includes(normalizedValue)) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  if (["low", "warning", "harmful"].includes(normalizedValue)) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-gray-200 bg-gray-50 text-gray-600";
};

export default function ProductCard({
  id,
  productName,
  name,
  description,
  imageUrl,
  image,
  company,
  brand,
  manufacturer,
  ingredientSafety,
  informationQuality,
  evidenceQuality,
  transparencyScore,
  ethicalScore,
  onInteraction,
  onViewDetails,
}) {
  const title = productName || name || "Product";
  const productImage = imageUrl || image;
  const productCompany = company || brand || manufacturer;

  const handleCardClick = () => {
    onInteraction?.();
    onViewDetails?.({
      id,
      productName: title,
      description,
      imageUrl: productImage,
      company: productCompany,
      ingredientSafety,
      informationQuality,
      evidenceQuality,
      transparencyScore,
      ethicalScore,
    });
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      aria-label={`View details for ${title}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#dce5df] bg-white text-left shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      {productImage ? (
        <img
          src={productImage}
          className="aspect-[3/2] w-full object-cover"
          alt={title}
        />
      ) : (
        <div className="aspect-[3/2] w-full bg-gray-100" aria-hidden="true" />
      )}

      <div className="flex min-h-[74px] w-full items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          {productCompany && (
            <p className="mb-1 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
              {productCompany}
            </p>
          )}
          <h3 className="truncate font-semibold text-gray-900">{title}</h3>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dce5df] text-gray-800 transition group-hover:border-emerald-300 group-hover:text-emerald-700"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </span>
      </div>

      <div className="grid w-full grid-cols-3 border-t border-[#dce5df]">
        {assessments.map(({ key, label }, index) => {
          const value = typeof ({ ingredientSafety, informationQuality, evidenceQuality })[key] === "string"
            ? ({ ingredientSafety, informationQuality, evidenceQuality })[key].trim()
            : "";
          const displayedValue = value || "Not provided";

          return (
            <div
              key={key}
              className={`min-w-0 px-2.5 py-3 sm:px-3 ${
                index < assessments.length - 1 ? "border-r border-[#dce5df]" : ""
              }`}
            >
              <p className="mb-2 truncate text-[9px] font-medium uppercase tracking-[0.08em] text-slate-600 sm:text-[10px]">
                {label}
              </p>
              <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getAssessmentStyle(value)}`}>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                <span className="truncate">{displayedValue}</span>
              </span>
            </div>
          );
        })}
      </div>
    </button>
  );
}
