// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { HeaderUrl } from "../../EndPoints/EndPoints";
import { memo, useEffect, useState } from "react";
// import LanguageSwitcher from "../LanguageSwitchButton/LanguageSwitcher";
import Zainlogo from "../../assets/zainupdatedlogo.jpeg"
import { usebranchData } from "../../context/BranchImages";
import { useresturntData } from "../../context/ResturantConfid";

const HeaderComponentBase = () => {
  const { branchImages } = usebranchData();
  const { ResturantConfig, loading, error } = useresturntData();
  const [photo, setphoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (ResturantConfig?.base_urls?.branch_image_url && branchImages?.header_image) {
      const PhotoUrl = `${ResturantConfig.base_urls.branch_image_url}/${branchImages.header_image}`;
      setphoto(PhotoUrl);
    }
  }, [ResturantConfig, branchImages]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="d-flex flex-column align-items-center position-relative justify-content-center text-white w-100"
      style={{ padding: ".5rem" }}
    >
      <div
        style={{
          width: "160px",
          border: "5px solid #722914",
          position: "absolute",
          right: "5%",
          top: "-100px",
        }}
        className="resturant-logo rounded-circle d-flex justify-content-center align-items-center overflow-hidden"
      >
        <img
          src={photo ?? Zainlogo}
          alt="شعار المطعم"
          className="rounded-circle"
          style={{ width: "100%", objectFit: "cover", transform: "scale(.99)" }}
        />
      </div>
    </div>
  );
};

export const HeaderComponent = memo(HeaderComponentBase);
