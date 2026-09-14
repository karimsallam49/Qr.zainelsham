import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import BannerSkeleton from "../../scelton/BannerSkeleton";
import { useFetch } from "../../Hooks/useFetch";
import { BannnerUrl } from "../../EndPoints/EndPoints";
import type { BannerDTO, ProductDTO } from "../../DTO/BannerDTO";
import { ProductModal } from "../ProductsDetails/ProductModal";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerStyle.css";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

const BannerComponent = ({ BannerType }: { BannerType: "ads" | string }) => {
  const { currentLanguage }=useLanguage()
  const { data, isLoading, error } = useFetch<BannerDTO[]>(currentLanguage,BannnerUrl);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const direction = i18n.language === "ar";

  const currentData = useMemo(
    () => data?.filter((banner) => banner.banner_type === BannerType) ?? [],
    [data, BannerType]
  );

  const dataInMobile = useMemo(() => {
    const target = windowWidth < 968 ? "mobile" : "desktop";
    return currentData.filter((b) => b.dimension_type === target);
  }, [currentData, windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBannerSelected = (banner: BannerDTO) => {
    if (banner.category_id) navigate(`/category/${banner.category_id}/${banner.title}`);
    else {
      setSelectedProduct(banner.product);
      setShowModal(true);
    }
  };

  if (isLoading) return BannerType === "ads" ? null : <BannerSkeleton />;
  if (error) return <p>{t("error_fetching_data")}</p>;
  if (dataInMobile.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: BannerType === "ads" ? 2 : 1,
    slidesToScroll: 1,
    rtl: direction,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: BannerType === "ads" ? 2 : 1,
        },
      },
    ],
  };

  return (
    <div className={`banner-wrapper-fixed ${BannerType==="ads"?"ads-wrapper":"genral-warrper"}`}>
      <Slider {...settings} className="banner-slider-fixed">
        {dataInMobile.map((banner,index) => (
          <div key={index} style={{ gap: "12px" }} className="banner-slide-fixed p-1 h-100">
            <img
              onClick={() => handleBannerSelected(banner)}
              className="banner-image-fixed"
              src={direction ? banner.image_ar_url ?? banner.image_url : banner.image_url}
              alt={banner.title}
            />
          </div>
        ))}
      </Slider>

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default BannerComponent;
