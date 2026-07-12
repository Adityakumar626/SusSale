export type UUID = string;

export interface Product {
  id: UUID;
  created_at: Date;
  user_id: UUID;
  url: string;
  name: string;
  current_price: number;
  currency: string;
  image_url: string;
  updated_at: Date;
}

export interface ProductProps {
  product: Product;
}

export interface ProductData {
  productName: string;
  currentPrice: number;
  currencyCode?: string;
  productImageUrl?: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

