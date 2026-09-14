import { useNavigate, useSearchParams } from "react-router-dom";
import "./Categoriesstyle.css";
import { SectionName } from "../../Components/SectionName/SectionName";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { cuisineListUrl } from "../../EndPoints/EndPoints";
import type { CuisineDTO } from "../../DTO/CuisineDTO";
import CuisineCard from "../../Components/CuisineCard/CuisineCard";
import { Col, Row } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

const AllCuisinePage = () => {
    const {currentLanguage}=useLanguage()
    const {data}=useFetch<CuisineDTO[] >(currentLanguage,cuisineListUrl)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const homePath = query ? `/?${query}` : "/";


  const { t } = useTranslation();
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SectionName title={t("All-cuisine")} />
        <button
          className="btn btn-link text-decoration-none fw-semibold"
          onClick={() => navigate(homePath)}
        >
          ← 
        </button>
      </div>

   <div className="categoriesbox-wrappe container">
      <Row className="g-3">
        {data &&
          data.map((el) => (
            <Col
              key={el.id}
              xs={6}   
              sm={6}
              md={4}  
              lg={3}   
            >
              <CuisineCard el={el} />
            </Col>
          ))}
      </Row>
    </div>
    </div>
  );
};

export default AllCuisinePage;
