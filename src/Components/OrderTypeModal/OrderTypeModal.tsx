import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Utensils, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useresturntData } from "../../context/ResturantConfid";
import { ResturantIMG } from "../../EndPoints/EndPoints";
import { useOrderType, type OrderType } from "../../context/OrderTypeContext/OrderTypeContext";
import "./OrderTypeModal.css";

interface OrderTypeModalProps {
  onSelect?: (type: OrderType) => void;
}

export const OrderTypeModal = ({ onSelect }: OrderTypeModalProps) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const { ResturantConfig } = useresturntData();
  const { orderType, setOrderType } = useOrderType();

  useEffect(() => {
    if (!orderType) {
      setShow(true);
    }
  }, [orderType]);

  const handleSelect = (type: OrderType) => {
    setOrderType(type);
    setShow(false);
    onSelect?.(type);
  };

  const logoSrc = ResturantConfig?.restaurant_logo
    ? `${ResturantIMG}/${ResturantConfig.restaurant_logo}`
    : null;

  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      backdropClassName="order-type-backdrop"
      dialogClassName="order-type-modal-dialog"
      contentClassName="order-type-modal-content"
    >
      <div className="order-type-header">
        {logoSrc && (
          <div className="order-type-logo-wrapper">
            <img
              src={logoSrc}
              alt={ResturantConfig?.restaurant_name || "Logo"}
              className="order-type-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <span className="order-type-badge">
          {ResturantConfig?.restaurant_name || t("welcome")}
        </span>
        <h4 className="order-type-title">{t("chooseOrderType")}</h4>
        <p className="order-type-subtitle">{t("chooseOrderTypeDesc")}</p>
      </div>

      <div className="order-type-cards-wrapper">
        <div
          className="order-type-card"
          onClick={() => handleSelect("dine_in")}
          role="button"
          tabIndex={0}
        >
          <div className="order-type-icon-wrapper">
            <Utensils size={28} strokeWidth={2.3} />
          </div>
          <h5 className="order-type-name">{t("dineIn")}</h5>
          <p className="order-type-desc">{t("dineInDesc")}</p>
        </div>

        <div
          className="order-type-card"
          onClick={() => handleSelect("takeaway")}
          role="button"
          tabIndex={0}
        >
          <div className="order-type-icon-wrapper">
            <ShoppingBag size={28} strokeWidth={2.3} />
          </div>
          <h5 className="order-type-name">{t("takeaway")}</h5>
          <p className="order-type-desc">{t("takeawayDesc")}</p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderTypeModal;
