import { useTranslation } from "react-i18next";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ImageUrl } from "../../EndPoints/EndPoints";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
// import { useTranslation } from "react-i18next";
import "./ProductCardStyle.css"
import { Badge } from "react-bootstrap";
type ProductsCardProps = {
  records: ProductDTO;
  setProductInfo?: (product: ProductDTO) => void   
  setopen?: (open: boolean) => void;
}
// const {t}=useTranslation()
export const ProductsCArd = ({records,setProductInfo,setopen}:ProductsCardProps) => {
  const {t,i18n}=useTranslation()

  const hasDiscount = Number(records.discount) > 0;
  const originalPrice = Number(records.price) || 0;
  const discountedPrice = hasDiscount
    ? records.discount_type === "percent"
      ? Math.max(0, originalPrice - (originalPrice * Number(records.discount)) / 100)
      : Math.max(0, originalPrice - Number(records.discount))
    : originalPrice;

  return (
     <div style={{cursor:"pointer"}} key={records.id} className="w-100 h-100"  onClick={()=>{
                    setProductInfo && setProductInfo(records)
                  
                    setopen && setopen(true)
                  }
                    
                }>
<div
  className="card position-relative h-100 shadow-sm product-card"
    style={{
            borderRadius: "20px",
            overflow: "hidden",
            cursor: "pointer",
            zIndex: "100",
            minHeight: "230px",
          }}
   onClick={()=>{
                    setProductInfo && setProductInfo(records)
                  
                    setopen && setopen(true)
                  }
                    
                }
  
>                <img
                   src={records.image ? `${ImageUrl}/${records.image}` : PlaceHolderImage}
  onError={(e) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = PlaceHolderImage;
  }}
                  alt={records.name}
                  className="card-img-top"
                  style={{ height: "120px"  }}
                />
       <div
            style={{ maxHeight: "50%" }}
            className="card-bod w-100 h-100 p-1 d-flex flex-column justify-content-between"
          >
           <p
              className="card-titl m-0 fw-bold w-100"
              style={{
                fontSize: "medium",
                height: "45%",
                overflow: "hidden",
                    whiteSpace: "wrap",
                textOverflow: "ellipsis",
                direction: i18n.language === "ar" ? "rtl" : "ltr",
              }}
            >
              {records.name}
            </p>

         {records.product_type === "veg" && (
              <p className="card-title fw-bold w-100 text-start t mt-1" style={{fontSize:"small"}}>
                {records.calories}{" "}
                <Badge bg="success" className="mx-0.5 p-1" style={{fontSize:"x-small"}}>
                  {t("calories")}
                </Badge>
              </p>
            )}


    <p
  className="card-text mb-0 text-danger fw-semibold "
  style={{  marginTop: "auto",  direction: i18n.language === "ar" ? "rtl" : "ltr", }}
>
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: "small",
      flexWrap: "wrap",
    }}
  >
    {originalPrice > 0
      ? hasDiscount
        ? (
          <>
            <del style={{ color: "#999", fontSize: "0.75rem", textDecoration: "line-through", lineHeight: 1 }}>
              {originalPrice.toFixed(2)}
            </del>
            <span style={{ fontWeight: 700, color: "#722914" }}>
              {discountedPrice.toFixed(2)} {t("currency")}
            </span>
          </>
        )
        : `${originalPrice.toFixed(2)} ${t("currency")}`
      : i18n.language === "ar"
      ? "السعر حسب الاختيار"
      : "Price according to selection"}
  </span>
</p>


                  <div  style={{
      right: i18n.language  === "en"  ? '0' : 'auto', 
      left: i18n.language  === "ar" ? '0' : 'auto', 
            borderRadius: i18n.language  === 'en' ? '10px 0 5px 0' : '0 10px 0 5px',
    }} className=" position-absolute card-bottom backgroundMainColor text-light mt-auto"> +</div>
                {
                  records.product_type==="veg"&&(

                    <span className=" position-absolute veg ">{t("diet")}</span>
                  )
                }
                </div>
              </div>
           
            </div>
  )
}
