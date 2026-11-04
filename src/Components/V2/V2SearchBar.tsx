import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useFetch } from "../../Hooks/useFetch";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { ImageUrl, SearchSuggestionAPI } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";

interface SuggestionProduct {
  id: number;
  name: string;
  image?: string;
  price?: number;
  discount?: number;
  discount_type?: string;
  final_price?: number;
}

const V2SearchBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 400);
    return () => clearTimeout(id);
  }, [term]);

  // appendBranchId بيبعت service_type أوتوماتيك جوّه الـ URL
  const { data: suggestions, isFetching } = useFetch<SuggestionProduct[]>(
    currentLanguage === "ar" ? "ar" : "en",
    `${SearchSuggestionAPI}name=${encodeURIComponent(debounced)}`,
    { enabled: openSuggest && debounced.length > 0 }
  );

  // قفل الدروب داون لما ندوس بره
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!suggestRef.current?.contains(e.target as Node)) {
        setOpenSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResults = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setOpenSuggest(false);
    navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  const showDropdown = openSuggest && debounced.length > 0;

  return (
    <div className="v2-search-wrap" ref={suggestRef}>
      <div className="v2-search">
        <Search size={16} color="var(--v2-gold)" />
        <input
          type="text"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpenSuggest(true);
          }}
          onFocus={() => setOpenSuggest(true)}
          onKeyDown={(e) => e.key === "Enter" && goToResults(term)}
          placeholder={t("v2.searchPlaceholder")}
          aria-label={t("mobile_header.search")}
        />
      </div>

      {showDropdown && (
        <div className="v2-suggest" role="listbox">
          {isFetching ? (
            <div className="v2-suggest-empty">{t("v2.loadingDishes")}</div>
          ) : suggestions?.length ? (
            suggestions.map((s) => {
              // نفس منطق كروت المنتجات: final_price الأول، وبعدين حساب الخصم
              const price = Number(s.price) || 0;
              const disc = Number(s.discount) || 0;
              const computed =
                disc > 0
                  ? s.discount_type === "percent"
                    ? price * (1 - disc / 100)
                    : price - disc
                  : price;
              const final =
                s.final_price != null
                  ? Number(s.final_price)
                  : Math.max(computed, 0);
              const img = s.image
                ? s.image.startsWith("http")
                  ? s.image
                  : `${ImageUrl}/${s.image}`
                : PlaceHolderImage;
              return (
                <div
                  key={s.id}
                  className="v2-suggest-item"
                  role="option"
                  aria-selected="false"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToResults(s.name)}
                >
                  <img
                    src={img}
                    alt={s.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PlaceHolderImage;
                    }}
                  />
                  <div className="v2-suggest-info">
                    <span className="v2-suggest-name">{s.name}</span>
                    {price > 0 && (
                      <span className="v2-suggest-price">
                        {disc > 0 && <del>{price.toFixed(2)}</del>}
                        {final.toFixed(2)} {t("currency")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="v2-suggest-empty">{t("v2.noResults")}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default V2SearchBar;
