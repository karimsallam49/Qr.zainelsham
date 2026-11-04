import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useFetch } from "../../Hooks/useFetch";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { useOrderType } from "../../context/OrderTypeContext/OrderTypeContext";
import { BannnerUrl } from "../../EndPoints/EndPoints";
import type { BannerDTO } from "../../DTO/BannerDTO";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../ProductsDetails/ProductModal";
import BannerSkeleton from "../../scelton/BannerSkeleton";
import PlaceHolderImage from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";

const V2HeroSlider = () => {
  const { currentLanguage } = useLanguage();
  const { data: BannerData, isLoading: BannerLoading } = useFetch<BannerDTO[]>(
    currentLanguage,
    BannnerUrl
  );
  const { t, i18n } = useTranslation();
  const { orderType } = useOrderType();
  const navigate = useNavigate();
  const direction = i18n.language === "ar";

  const sliderRef = useRef<Slider | null>(null);
  const [slides, setSlides] = useState<BannerDTO[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const banners = useMemo(
    () => BannerData?.filter((b) => b.banner_type === "banner") ?? [],
    [BannerData]
  );

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 968;
      setSlides(
        banners.filter((b) =>
          isMobile
            ? b.dimension_type === "mobile"
            : b.dimension_type === "desktop"
        )
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [banners]);

  const handleBannerSelected = (banner: BannerDTO) => {
    if (banner.category_id) {
      navigate(`/category/${banner.category_id}/${banner.title}`);
    } else if (banner.product) {
      setSelectedProduct(banner.product as unknown as ProductDTO);
      setShowModal(true);
    }
  };

  if (BannerLoading) return <BannerSkeleton />;
  if (slides.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    lazyLoad: "ondemand" as const,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: direction,
    fade: false,
  };

  return (
    <section className="v2-hero">
      <span className="v2-corner tl" />
      <span className="v2-corner tr" />
      <span className="v2-corner bl" />
      <span className="v2-corner br" />

      {/* بادج نوع الطلب على الطرف + الضريبة في النص (بتتخفى في التيك أواي) */}
      <div className="v2-hero-badges">
        {orderType === "takeaway" ? (
          <span className="v2-hero-badge dine">
            <ShoppingBag /> {t("takeaway")}
          </span>
        ) : (
          <span className="v2-hero-badge dine">
            <UtensilsCrossed /> {t("dineIn")}
          </span>
        )}
        {orderType !== "takeaway" && (
          <span className="v2-hero-badge vat">{t("vatNote")}</span>
        )}
      </div>

      <Slider ref={sliderRef} {...settings}>
        {slides.map((banner) => {
          const linked = Boolean(banner.category_id) || Boolean(banner.product);
          return (
            <div
              key={banner.id}
              className="v2-hero-slide"
              role={linked ? "button" : undefined}
              style={linked ? { cursor: "pointer" } : undefined}
              onClick={() => linked && handleBannerSelected(banner)}
            >
              <img
                loading="lazy"
                src={
                  direction
                    ? banner.image_ar_url ?? banner.image_url
                    : banner.image_url
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceHolderImage;
                }}
                alt={banner.title}
              />
            </div>
          );
        })}
      </Slider>

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default V2HeroSlider;
