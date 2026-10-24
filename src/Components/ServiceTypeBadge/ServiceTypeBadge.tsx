import { Utensils, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOrderType } from "../../context/OrderTypeContext/OrderTypeContext";
import "./ServiceTypeBadge.css";

export const ServiceTypeBadge = ({ className = "" }: { className?: string }) => {
  const { orderType } = useOrderType();
  const { t } = useTranslation();

  if (!orderType) return null;

  const isDineIn =
    orderType === "hall" || orderType === "dine_in" || orderType === "dine-in";

  return (
    <div className={`service-type-badge ${className}`}>
      {isDineIn ? (
        <Utensils size={14} strokeWidth={2.4} />
      ) : (
        <ShoppingBag size={14} strokeWidth={2.4} />
      )}
      <span>{t(isDineIn ? "dineIn" : "takeaway")}</span>
    </div>
  );
};
