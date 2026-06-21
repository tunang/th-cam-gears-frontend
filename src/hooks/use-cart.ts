import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api";
import type { Cart } from "@/src/utils/types";
import useAuthStore from "@/src/store/auth.store";

export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get<Cart>("/cart");
      return res.data;
    },
    enabled: isAuthenticated,
    retry: false, // Don't retry on 401
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, { variantId: string; quantity: number }>({
    mutationFn: async (dto) => {
      const res = await api.post<Cart>("/cart/items", dto);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, { itemId: string; quantity: number }>({
    mutationFn: async ({ itemId, quantity }) => {
      const res = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, string>({
    mutationFn: async (itemId) => {
      const res = await api.delete<Cart>(`/cart/items/${itemId}`);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await api.delete("/cart");
    },
    onSuccess: () => {
      qc.setQueryData(["cart"], {
        id: null,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    },
  });
}

/** Helper: total item count in cart */
export function useCartItemCount(): number {
  const { data } = useCart();
  if (!data?.items) return 0;
  return data.items.reduce((sum, item) => sum + item.quantity, 0);
}
