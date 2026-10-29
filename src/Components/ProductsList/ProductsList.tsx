import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { useTranslation } from "react-i18next";
import "./ProductsList.css";

type ProductsCardProps = {
  records: ProductDTO;
  setProductInfo?: (product: ProductDTO) => void;
  setopen?: (open: boolean) => void;
};

export const ProducList = ({ records, setProductInfo, setopen }: ProductsCardProps) => {
  const { t } = useTranslation();
  const hasDiscount = Number(records.discount) > 0;
  const discountedPrice = hasDiscount
    ? records.discount_type === "percent"
      ? Math.max(0, records.price - (records.price * Number(records.discount)) / 100)
      : Math.max(0, records.price - Number(records.discount))
    : records.price;

  return (
    <div
      className="product-list-card"
      onClick={() => {
        setProductInfo && setProductInfo(records);
        setopen && setopen(true);
      }}
    >
      <div className="product-image">
        <img
          src={records.image ? `${ImageUrl}/${records.image}` : PlaceHolderImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PlaceHolderImage;
          }}
          alt={records.name}
        />
      </div>

      <div className="product-info">
        <p className="product-name">{records.name}</p>
        <p
          className="product-price"
          style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
        >
          {hasDiscount ? (
            <>
              <del
                style={{
                  color: "#999",
                  fontSize: "0.8rem",
                  textDecoration: "line-through",
                  lineHeight: 1,
                }}
              >
                {records.price.toFixed(2)}
              </del>
              <span style={{ fontWeight: 700 }}>
                {discountedPrice.toFixed(2)} {t("currency")}
              </span>
            </>
          ) : (
            `${records.price.toFixed(2)} ${t("currency")}`
          )}
        </p>
      </div>
    </div>
  );
};
