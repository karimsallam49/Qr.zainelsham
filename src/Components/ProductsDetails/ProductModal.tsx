import { memo, useMemo, useState } from "react";
import { Modal, Image, Badge } from "react-bootstrap";
import "./Productmodule.css";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  show: boolean;
  handleClose: () => void;
  product: any;
}

export const ProductModal = memo(({ show, handleClose, product }: ProductModalProps) => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar";
const [selectedVariations, setSelectedVariations] = useState<any[]>([]);

  const CurrentPhoto = useMemo(() => product.product_type === "veg", [product.product_type]);

  const imageSrc = useMemo(() => `${ImageUrl}/${product.image}`, [product.image]);

// const variationsTotal = selectedVariations.reduce((sum, v) => {
//   const value = product.variations
//     ?.find((vr: any) => vr.name === v.name)
//     ?.values.find((val: any) => val.label === v.values.label[0]);
//   return sum + (Number(value?.optionPrice) || 0);
// }, 0);

// const basePrice = Number(product.price) || 0;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="w-100"
      dialogClassName="bottom-sheet-modal w-100"
      backdropClassName="custom-backdrop w-100"
      contentClassName="bottom-sheet-content"
    >
      <Modal.Body
        className="align-items-center justify-content-center"
        style={{ paddingBottom: "2rem", padding: "1rem" }}
      >
        <div className="d-flex flex-column justify-content-between align-items-center mb-3">
          <div className="w-100 d-flex align-items-center justify-content-center mb-3">
            <Image
              className="ModalImage"
              style={{
                maxHeight: 200,
                width: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PlaceHolderImage;
              }}
              src={imageSrc}
              alt={product.name}
              fluid
            />
          </div>

          <div
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
            className="w-100 rounded-4 d-flex flex-column align-items-start justify-content-center p-3"
          >
            <h6 className="fw-bold">{product.name}</h6>
             <p className="text-muted text-start mb-0">
            <span style={{ display: "inline-block", width: "100px", fontSize: "small" }}>
              {Number(product.price) > 0
                ? `${product.price.toFixed(2)} ${t("currency")}`
                : i18n.language === "ar"
                ? "السعر حسب الاختيار"
                : "Price according to selection"}
            </span>
          </p>
          </div>
        </div>

        <div className="product-info-body">
          <div className="rounded-4 p-3 mb-3">
            <div className="d-flex align-items-start justify-content-between w-100">
              <span className="text-dark d-flex justify-content-start mb-2">
                {t("details")}
              </span>
              <div className="d-flex justify-content-between align-items-center">
                {CurrentPhoto && (
                  <span
                    className="position-absolute veg-modal"
                    style={{ [direction ? "left" : "right"]: "5%" }}
                  >
                    {t("diet")}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-2 text-muted">{product.description}</p>

            {CurrentPhoto && (
              <>
                {product.calories}{" "}
                <Badge bg="success" className="mx-1">
                  {t("calories")}
                </Badge>
              </>
            )}
          </div>

          {Array.isArray(product.variations) && product.variations.length > 0 && (
  <div className="p-3  rounded-4 w-100 mb-4 variations-section">

   {product.variations.map((variation: any, vIndex: number) => (
  <div key={vIndex} className="mb-3">
    <p className="fw-semibold mb-2">
      {i18n.language === "ar" ? variation.ar_name : variation.name}
    </p>

    <div className="d-flex flex-wrap gap-2">
      {variation.values.map((value: any, valIndex: number) => {
        const isSelected =
          selectedVariations[vIndex]?.values?.label?.[0] === value.label;

        return (
          <div
            key={valIndex}
            className={`${isSelected ? "backgroundMainColor text-light " : ""}variation-box p-2 border rounded text-center d-flex align-items-center justify-content-center gap-2 flex-column`}
            style={{
              flex: "0 0 calc(50% - 0.5rem)", 
              cursor: "pointer",
              
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              const updated = [...selectedVariations];
              updated[vIndex] = {
                name: variation.name,
                values: { label: [value.label] },
              };
              setSelectedVariations(updated);
            }}
          >
            {/* {value.imageFullPath && (
              <img
                src={value.imageFullPath}
                alt={value.label}
                className="variation-option-img mb-1"
                style={{ width: "100%", objectFit: "cover", borderRadius: 4 }}
              />
            )} */}
            <div className="d-flex align-items-center justify-content-center gap-1 ">
              <div>

              {i18n.language === "ar" ? value.ar_label : value.label}
            </div>
             {value.optionPrice && (
              <div
                className={`fw-semibod ${isSelected ? "text-light" : "text-muted"}`}
                style={{margin:"0 .3rem"}}
              >
                {value.optionPrice} {t("currency")}
              </div>
            )}
            </div>
          </div>
        );
      })}
    </div>
        </div>
      ))}

        </div>
      )}

          {product.add_ons?.length > 0 ? (
            <div className="p-3 addition rounded-4 p-3 w-100 mb-4">
              <h6 className="fw-bold  mb-3">{t("addons")}</h6>
              {product.add_ons.map((addon: any) => (
                <div
                  key={addon.id}
                  className="d-flex justify-content-between align-items-center mb-3 p-2 rounded addon-item"
                >
                  <span className="fw-bold">{addon.name}</span>
                  <span className="text-muted">
                    {addon.price.toFixed(2)} {t("currency")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-light p-3 rounded w-100 mb-4">
              <h6 className="fw-bold text-end mb-3">{t("noAddons")}</h6>
            </div>
          )}
           
        </div>
      </Modal.Body>
    </Modal>
  );
});
