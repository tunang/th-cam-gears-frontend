import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api";
import type {
  Product,
  ProductVariant,
  PaginatedResponse,
} from "@/src/utils/types";

export function useProducts(page = 1, size = 12) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", page, size],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Product>>("/products", {
        params: { page, size },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductVariants(id: string) {
  return useQuery<ProductVariant[]>({
    queryKey: ["product-variants", id],
    queryFn: async () => {
      const res = await api.get<ProductVariant[]>(`/products/${id}/variants`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export interface ProductsByCategoryResponse extends PaginatedResponse<Product> {
  category: { id: string; name: string; description: string | null };
}

export function useProductsByCategory(categoryId: string, page = 1, size = 12) {
  return useQuery<ProductsByCategoryResponse>({
    queryKey: ["products-by-category", categoryId, page, size],
    queryFn: async () => {
      const res = await api.get<ProductsByCategoryResponse>(
        `/products/category/${categoryId}`,
        { params: { page, size } },
      );
      return res.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}
