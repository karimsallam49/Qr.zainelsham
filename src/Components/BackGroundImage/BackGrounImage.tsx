
import './BackGroundImage.css'; 
import { useresturntData } from '../../context/ResturantConfid';
import { useEffect, useState } from 'react';
import { usebranchData } from '../../context/BranchImages';
import { useTranslation } from 'react-i18next';
import { ServiceTypeBadge } from '../ServiceTypeBadge/ServiceTypeBadge';

export const BackGroundImage = () => {
  const { branchImages, Branchloading, Brancherror } = usebranchData();
  const { ResturantConfig, loading, error } = useresturntData();
  const [photo, setphoto] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    if (ResturantConfig?.base_urls?.branch_image_url && branchImages?.background_image) {
      const PhotoUrl = `${ResturantConfig.base_urls.branch_image_url}/${branchImages.background_image}`;
      setphoto(PhotoUrl);
    }
  }, [ResturantConfig, branchImages]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (Branchloading) return <p>Loading…</p>;
  if (Brancherror) return <p>{Brancherror}</p>;

  return (
    <div className="w-100 d-flex flex-column align-items-center rounded banner-conatiner" style={{ height: "300px" }}>
      <div className="img-container w-100 h-100 d-flex justify-content-center align-items-center">
        {photo && <img src={photo} className="w-100 h-100" style={{ objectFit: "cover" }} alt="" />}
        <div className="vat-note">{t("allPricesIncludeVat")}</div>
        <ServiceTypeBadge />
      </div>
    </div>
  );
};
