"use client";

import { SectionName } from "../SectionName/SectionName";
import { ProductsCArd } from "../ProductsCards/ProductsCArd";
import { useFetch } from "../../Hooks/useFetch";
import { recommendedProductUrL } from "../../EndPoints/EndPoints";
import type { ProductDTO, ProductListResponse } from "../../DTO/ProductsDTO";

import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./RecommindationSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ProductModal } from "../ProductsDetails/ProductModal";

const RecommindationSection = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const []=useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedproduct, setSelectedproduct] = useState<ProductDTO >();
  const { data, isLoading, error } = useFetch<ProductListResponse>(
    currentLanguage,
    recommendedProductUrL
  );

  if (isLoading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error)
    return <p className="text-danger text-center">حدث خطأ أثناء تحميل التوصيات</p>;

  if (!data || data.products.length === 0)
    return <p className="text-center text-muted">لا توجد توصيات حالياً</p>;

  // أسهم التنقل المخصصة
  // const NextArrow = (props: any) => {
  //   const { onClick } = props;
  //   return (
  //     <div className="custom-nav-btn next-arrow" onClick={onClick}>
  //       <FaChevronRight />
  //     </div>
  //   );
  // };

  // const PrevArrow = (props: any) => {
  //   const { onClick } = props;
  //   return (
  //     <div className="custom-nav-btn prev-arrow" onClick={onClick}>
  //       <FaChevronLeft />
  //     </div>
  //   );
  // };
const totalProducts = data?.products?.length || 0;

  
const settings = {
  dots: false,
  infinite: totalProducts > 1, 
  speed: 800,
  slidesToShow: totalProducts > 4 ? 5 : totalProducts-1 || 1,
  slidesToScroll: 1,
  centerMode: totalProducts > 4 ,
  autoplay: totalProducts > 1,
  autoplaySpeed: 3000,
  // nextArrow: <NextArrow />,
  // prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: Math.min(4, totalProducts || 1),
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: Math.min(3, totalProducts || 1),
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: Math.min(2, totalProducts || 1),
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow:  1,
      },
    },
  ],
};
  return (
    <div className="w-100  ">
      <SectionName title={t("Recommendation")} />
    <div
      className="recommendations-section w-100 py-2"
      style={{ height: "350px", padding: "2rem" }}
      >

      <div className="position-relative h-100 w-100" style={{maxHeight:"70%",margin:"1rem 0"}}>
        <Slider className="recommm-swiper w-100 h-100" {...settings}>
          {data.products.map((product,index) => (
            <div className="w-100 h-100" key={product.id} style={{ padding: "0 10px ",backgroundColor:"red" }}>
              <ProductsCArd    
               key={index}
                setProductInfo={setSelectedproduct}
                setopen={setShowModal}  records={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
       {showModal && selectedproduct && (
          <ProductModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            product={selectedproduct}
          />
        )}
          </div>
  );
};

export default RecommindationSection;
