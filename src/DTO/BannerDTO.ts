export interface BannerDTO {
  id: number;
  title: string;
  image_url: string;
  image_ar_url: string | null;
  product_id: number | null;
  category_id: number | null;
  dimension_type: "mobile" | "desktop" | string;
  banner_type: "ads" | string;
  status: number;
  created_at: string;
  updated_at: string;
  product: ProductDTO | null;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string | null;
  image: string;
  price: number;
  variations: any[];
  add_ons: any[];
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  created_at: string;
  updated_at: string;
  attributes: any[];
  category_ids: CategoryPositionDTO[];
  choice_options: any[];
  discount: number;
  discount_type: "percent" | "amount" | string;
  tax_type: "percent" | "amount" | string;
  set_menu: number;
  is_bucket: boolean;
  piece_qty: number;
  free_inclusions: string | null;
  branch_id: number;
  colors: string | null;
  popularity_count: number;
  product_type: "veg" | "non_veg" | string;
  is_recommended: number;
  rating: any[];
  branch_product: BranchProductDTO | null;
  translations: any[];
}

export interface BranchProductDTO {
  id: number;
  product_id: number;
  price: number;
  discount_type: "percent" | "amount" | string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: any[];
  created_at: string;
  updated_at: string;
  stock_type: "unlimited" | "limited" | string;
  stock: number;
  sold_quantity: number;
  halal_status: number;
}

export interface CategoryPositionDTO {
  id: string;
  position: number;
}
