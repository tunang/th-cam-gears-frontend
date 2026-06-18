import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  phone: z.string().regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ'),
  city: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  district: z.string().min(1, 'Quận/Huyện là bắt buộc'),
  ward: z.string().min(1, 'Phường/Xã là bắt buộc'),
  street: z.string().min(1, 'Địa chỉ cụ thể là bắt buộc'),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
