export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  imageUrls: string[];
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  options: Record<string, string>; // e.g. { color: 'Black', size: 'M' }
  createdAt: string;
  updatedAt: string;
}

export interface CartItemVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  options: Record<string, string>;
  product: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
  };
  inventory: {
    quantity: number;
  } | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: CartItemVariant;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
  totalItems?: number;
  totalAmount?: number;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  method: 'SEPAY' | 'COD';
  content: string;
  transactionId: string | null;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: string;
  variant: CartItemVariant;
}

export interface Order {
  id: string;
  orderNumber: string;
  platform: string;
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'LOST' | 'RETURING' | 'RETURNED' | 'REFUNDED';
  totalAmount: string;
  trackingNumber: string | null;
  orderDate: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: Payment | null;
}