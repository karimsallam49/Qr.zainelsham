export type ProductDTO= {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  variations: any[]; // تقدر تعرّفها لو في تفاصيل
  add_ons: AddOn[];
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  created_at: string;
  updated_at: string;
  attributes: any[];
  category_ids: CategoryId[];
  choice_options: any[];
  discount: number;
  discount_type: 'percent' | 'flat' | string;
  tax_type: 'percent' | 'flat' | string;
  set_menu: number;
  branch_id: number;
  colors: any | null;
  popularity_count: number;
  product_type: 'veg' | 'non_veg' | string;
  is_recommended: number;
  reviews_count?: number;
  calories:number;
  rating: any[];
  branch_product: BranchProduct;
}

export type AddOn ={
  id: number;
  name: string;
  price: number;
  tax: number;
  created_at: string;
  updated_at: string;
  translations: any[];
}

export type CategoryId = {
  id: string;
  position: number;
}

export type BranchProduct ={
  id: number;
  product_id: number;
  price: number;
  discount_type: 'percent' | 'flat' | string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: any[];
  created_at: string;
  updated_at: string;
  stock_type: 'unlimited' | 'limited' | string;
  stock: number;
  sold_quantity: number;
  halal_status: number;
}
export type ProductListResponse= {
  total_size: number;
  limit: string;
  offset: string;
  products: ProductDTO[];
}
