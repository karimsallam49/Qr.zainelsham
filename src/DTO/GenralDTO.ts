import type { ProductDTO } from "./ProductsDTO";

export type Props = {
  APIURL: string;
  SelectedProduct: (product: ProductDTO) => void;
  setShowModal?: (show: boolean) => void;
};

