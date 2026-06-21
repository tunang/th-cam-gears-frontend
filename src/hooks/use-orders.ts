import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/src/utils/api';
import type { Order, PaginatedResponse } from '@/src/utils/types';
import useAuthStore from '@/src/store/auth.store';

export interface CheckoutResult {
  order: {
    id: string;
    orderNumber: string;
  };
  payment: {
    id: string;
    amount: string;
    content: string;
    status: string;
    paymentLink: string | null;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface CheckoutDto {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: 'SEPAY' | 'COD';
  note?: string;
}

export function useCheckout() {
  return useMutation<CheckoutResult, Error, CheckoutDto>({
    mutationFn: async (dto) => {
      const res = await api.post<CheckoutResult>('/orders/checkout', dto);
      return res.data;
    },
  });
}

export function useSavePaymentLink() {
  return useMutation<void, Error, { orderId: string; paymentLink: string }>({
    mutationFn: async ({ orderId, paymentLink }) => {
      await api.patch(`/orders/${orderId}/payment-link`, { paymentLink });
    },
  });
}

export function useMyOrders(page = 1, size = 10) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['my-orders', page, size],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Order>>('/orders/my', {
        params: { page, size },
      });
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useOrderPayment(orderId: string, enabled = true) {
  return useQuery<CheckoutResult['payment']>({
    queryKey: ['payment', orderId],
    queryFn: async () => {
      const res = await api.get<CheckoutResult['payment']>(`/payment/${orderId}`);
      return res.data;
    },
    enabled: !!orderId && enabled,
  });
}

export function useOrder(orderId: string, enabled = true) {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await api.get<Order>(`/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId && enabled,
  });
}
