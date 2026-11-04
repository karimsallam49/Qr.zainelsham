import { useTranslation } from "react-i18next";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";

interface Props {
  product: ProductDTO;
  onOpen: (product: ProductDTO) => void;
}

const V2ProductCard = ({ product, onOpen }: Props) => {
  const { t, i18n } = useTranslation();

  const originalPrice = Number(product.price) || 0;
  const discountAmount =
    product.discount_type === "percent"
      ? (originalPrice * (Number(product.discount) || 0)) / 100
      : Number(product.discount) || 0;
  const discountedPrice =
    (product as any).final_price != null
      ? Number((product as any).final_price)
      : Math.max(originalPrice - discountAmount, 0);
  const hasOffer =
    (Number(product.discount) || 0) > 0 && originalPrice > 0;

  // الـ QR منيو view-only — الـ + يفتح تفاصيل المنتج
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(product);
  };

  if (product.status !== 1) return null;

  return (
    <>
      <div
        className="v2-pcard"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen(product)}
      >
        <div className="v2-pcard-media">
          {hasOffer && (product as any).offer_source === "happy_hour" && (
            <span className="v2-ribbon hh">
              {product.discount_type === "percent"
                ? `-${Math.round(Number(product.discount))}%`
                : `-${Number(product.discount).toFixed(0)}`}
            </span>
          )}
          <img
            loading="lazy"
            src={product.image ? `${ImageUrl}/${product.image}` : PlaceHolderImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceHolderImage;
            }}
            alt={product.name}
          />

          <div className="v2-pcard-cart" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="v2-add-btn"
              onClick={handleAdd}
              aria-label={t("addToCart") || "add"}
            >
              +
            </button>
          </div>
        </div>

        <div className="v2-pcard-body">
          <span className="v2-pcard-name">{product.name}</span>
          <div className="v2-pcard-price">
            {originalPrice > 0 ? (
              <>
                <span className="price-now">
                  {discountedPrice.toFixed(2)} {t("currency")}
                </span>
                {hasOffer && (
                  <del>
                    {originalPrice.toFixed(2)} {t("currency")}
                  </del>
                )}
              </>
            ) : (
              <span className="price-now">
                {i18n.language === "ar"
                  ? "السعر حسب الوزن"
                  : "Price by weight"}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default V2ProductCard;
