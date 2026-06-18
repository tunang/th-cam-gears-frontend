'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/src/utils/api';
import type { Category, PaginatedResponse } from '@/src/utils/types';
import type { AxiosError } from 'axios';

interface ApiError {
  message: string;
  statusCode: number;
}

export function useCategories() {
  return useQuery<PaginatedResponse<Category>, AxiosError<ApiError>>({
    queryKey: ['categories'],
    queryFn: async () => {
      // Fetching up to 100 categories for the menu
      const response = await api.get<PaginatedResponse<Category>>('/categories', {
        params: { page: 1, size: 100 }
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}
