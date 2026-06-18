import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/utils/api';
import type { UserAddress } from '@/src/utils/types';
import useAuthStore from '@/src/store/auth.store';

export function useAddresses() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<UserAddress[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get<UserAddress[]>('/user-addresses');
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation<UserAddress, Error, Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (dto) => {
      const res = await api.post<UserAddress>('/user-addresses', dto);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation<UserAddress, Error, { id: string; data: Partial<UserAddress> }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<UserAddress>(`/user-addresses/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/user-addresses/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
