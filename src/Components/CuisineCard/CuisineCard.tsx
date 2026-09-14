import { Card } from "react-bootstrap";
import Categoryplaceholder from "../../assets/WhatsApp Image 2025-10-08 at 16.02.14.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CuisineDTO } from "../../DTO/CuisineDTO";
import { useresturntData } from "../../context/ResturantConfid";

const CuisineCard = ({ el }: { el: CuisineDTO }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const {ResturantConfig}=useresturntData()
  const ImageUrl= ResturantConfig?.base_urls.cuisine_image_url
  const query = searchParams.toString();
  const to = query
    ? `/CuisineProductsPage/${el.id}?${query}`
    : `/CuisineProductsPage/${el.id}`;

  return (
    <Card
      className=" shadow-sm  overflow-hidden rounded-4"
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onClick={() =>
        navigate(to, {
          state: { name: el.name, image: `${ImageUrl}/${el.image}` },
        })
      }
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={el.image ? `${ImageUrl}/${el.image}` : Categoryplaceholder}
          onError={(e) => (e.currentTarget.src = Categoryplaceholder)}
          className="w-100 object-fit-cover"
          style={{
            height: "140px", 
            objectFit: "cover",
          }}
        />

           <Card.Body className="text-center p-2"

          style={{
            fontWeight: "600",
            fontSize: "1.1rem",
            backdropFilter: "blur(2px)",
          }}
        >
          {el.name}
        </Card.Body>
      </div>
    </Card>
  );
};

export default CuisineCard;
