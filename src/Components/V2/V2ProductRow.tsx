import { useTranslation } from "react-i18next";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";

interface Props {
  product: ProductDTO;
  onOpen: (product: ProductDTO) => void;
}

const V2ProductRow = ({ product, onOpen }: Props) => {
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

  // الـ QR منيو view-only — مفيش كارت، الـ + يفتح تفاصيل المنتج
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(product);
  };

  if (product.status !== 1) return null;

  return (
    <>
      <div
        className="v2-product-row"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen(product)}
      >
        <div className="v2-product-thumb">
          <img
            loading="lazy"
            src={(product as any).image_thumb_full_path ?? (product as any).image_md_full_path ?? (product.image ? `${ImageUrl}/${product.image}` : PlaceHolderImage)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceHolderImage;
            }}
            alt={product.name}
          />
        </div>

        <div className="v2-product-body">
          <span className="v2-product-name">
            {product.name}
            {product.product_type === "veg" && (
              <span className="v2-product-badge">{t("diet")}</span>
            )}
          </span>
          {product.description && (
            <p className="v2-product-desc">{product.description}</p>
          )}
          <div className="v2-product-price">
            {originalPrice > 0 ? (
              <>
                {product.discount > 0 && (
                  <del>
                    {originalPrice.toFixed(2)} {t("currency")}
                  </del>
                )}
                <span>
                  {discountedPrice.toFixed(2)} {t("currency")}
                </span>
              </>
            ) : (
              <span>
                {i18n.language === "ar"
                  ? "السعر حسب الاختيار"
                  : "Price on selection"}
              </span>
            )}
          </div>
        </div>

        <div className="v2-product-side">
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
    </>
  );
};

export default V2ProductRow;
