"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  type AddressFormData,
} from "@/src/utils/address.schema";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/src/hooks/use-address";

export default function AddressPage() {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const addressString = `${data.street}, ${data.ward}, ${data.district}, ${data.city}`;

    if (editingId) {
      updateAddress.mutate(
        {
          id: editingId,
          data: {
            name: data.fullName,
            phone: data.phone,
            address: addressString,
            isDefault: data.isDefault,
          },
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            reset();
          },
        },
      );
    } else {
      addAddress.mutate(
        {
          name: data.fullName,
          phone: data.phone,
          address: addressString,
          label: "Nhà",
          isDefault: data.isDefault,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            reset();
          },
        },
      );
    }
  };

  const handleEditClick = (address: any) => {
    setEditingId(address.id);
    const parts = address.address.split(", ");
    let street = address.address;
    let ward = "";
    let district = "";
    let city = "";
    if (parts.length >= 4) {
      city = parts.pop() || "";
      district = parts.pop() || "";
      ward = parts.pop() || "";
      street = parts.join(", ");
    }

    reset({
      fullName: address.name,
      phone: address.phone,
      city,
      district,
      ward,
      street,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const setAsDefault = (id: string) => {
    updateAddress.mutate({ id, data: { isDefault: true } });
  };

  const removeAddress = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex justify-center items-center h-64">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--p-color-icon-secondary)" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--p-color-text)" }}
        >
          Địa chỉ của tôi
        </h1>

        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              onClick={() => {
                setEditingId(null);
                reset({
                  fullName: "",
                  phone: "",
                  city: "",
                  district: "",
                  ward: "",
                  street: "",
                  isDefault: false,
                });
              }}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--p-color-bg-fill-brand)",
                color: "var(--p-color-text-brand-on-bg-fill)",
                boxShadow: "var(--p-shadow-100)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--p-color-bg-fill-brand-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "var(--p-color-bg-fill-brand)";
              }}
            >
              <Plus className="h-4 w-4" />
              Thêm địa chỉ mới
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.2s_ease]" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-2xl data-[state=open]:animate-[appear-below_0.2s_ease]"
              style={{ background: "var(--p-color-bg-surface)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <Dialog.Title
                  className="text-lg font-semibold"
                  style={{ color: "var(--p-color-text)" }}
                >
                  {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="rounded-full p-1 transition-colors hover:bg-gray-100">
                    <X
                      className="h-5 w-5"
                      style={{ color: "var(--p-color-icon)" }}
                    />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      Họ và tên
                    </label>
                    <input
                      {...register("fullName")}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        background: "var(--p-color-input-bg-surface)",
                        borderColor: errors.fullName
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)",
                        color: "var(--p-color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--p-color-border-focus)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.fullName
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)";
                      }}
                      placeholder="Họ và tên"
                    />
                    {errors.fullName && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--p-color-text-critical)" }}
                      >
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      Số điện thoại
                    </label>
                    <input
                      {...register("phone")}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        background: "var(--p-color-input-bg-surface)",
                        borderColor: errors.phone
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)",
                        color: "var(--p-color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--p-color-border-focus)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.phone
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)";
                      }}
                      placeholder="Số điện thoại"
                    />
                    {errors.phone && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--p-color-text-critical)" }}
                      >
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      Tỉnh/Thành phố
                    </label>
                    <input
                      {...register("city")}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        background: "var(--p-color-input-bg-surface)",
                        borderColor: errors.city
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)",
                        color: "var(--p-color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--p-color-border-focus)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.city
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)";
                      }}
                      placeholder="Tỉnh/Thành phố"
                    />
                    {errors.city && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--p-color-text-critical)" }}
                      >
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--p-color-text)" }}
                    >
                      Quận/Huyện
                    </label>
                    <input
                      {...register("district")}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        background: "var(--p-color-input-bg-surface)",
                        borderColor: errors.district
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)",
                        color: "var(--p-color-text)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--p-color-border-focus)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.district
                          ? "var(--p-color-border-critical)"
                          : "var(--p-color-input-border)";
                      }}
                      placeholder="Quận/Huyện"
                    />
                    {errors.district && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--p-color-text-critical)" }}
                      >
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    Phường/Xã
                  </label>
                  <input
                    {...register("ward")}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--p-color-input-bg-surface)",
                      borderColor: errors.ward
                        ? "var(--p-color-border-critical)"
                        : "var(--p-color-input-border)",
                      color: "var(--p-color-text)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--p-color-border-focus)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.ward
                        ? "var(--p-color-border-critical)"
                        : "var(--p-color-input-border)";
                    }}
                    placeholder="Phường/Xã"
                  />
                  {errors.ward && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--p-color-text-critical)" }}
                    >
                      {errors.ward.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    Địa chỉ cụ thể
                  </label>
                  <input
                    {...register("street")}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--p-color-input-bg-surface)",
                      borderColor: errors.street
                        ? "var(--p-color-border-critical)"
                        : "var(--p-color-input-border)",
                      color: "var(--p-color-text)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--p-color-border-focus)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.street
                        ? "var(--p-color-border-critical)"
                        : "var(--p-color-input-border)";
                    }}
                    placeholder="Số nhà, Tên đường..."
                  />
                  {errors.street && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--p-color-text-critical)" }}
                    >
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isDefault")}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>

                <div className="pt-4 flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                      style={{
                        background: "var(--p-color-bg-surface)",
                        borderColor: "var(--p-color-border)",
                        color: "var(--p-color-text)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--p-color-bg-surface-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "var(--p-color-bg-surface)";
                      }}
                    >
                      Hủy
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={addAddress.isPending || updateAddress.isPending}
                    className="rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                    style={{
                      background: "var(--p-color-bg-fill-brand)",
                      color: "var(--p-color-text-brand-on-bg-fill)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--p-color-bg-fill-brand-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--p-color-bg-fill-brand)";
                    }}
                  >
                    {addAddress.isPending || updateAddress.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Hoàn thành"
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div
            className="rounded-lg border p-6"
            style={{
              background: "var(--p-color-bg-surface)",
              borderColor: "var(--p-color-border-secondary)",
              boxShadow: "var(--p-shadow-100)",
            }}
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin
                className="h-12 w-12 mb-4"
                style={{ color: "var(--p-color-icon-secondary)" }}
              />
              <p
                className="text-base font-medium mb-2"
                style={{ color: "var(--p-color-text)" }}
              >
                Bạn chưa có địa chỉ nào
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--p-color-text-secondary)" }}
              >
                Thêm địa chỉ để thanh toán nhanh chóng và dễ dàng hơn.
              </p>
            </div>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-lg border p-5 flex flex-col sm:flex-row gap-4 justify-between transition-all ${deleteAddress.isPending && deleteAddress.variables === address.id ? "opacity-50" : ""}`}
              style={{
                background: "var(--p-color-bg-surface)",
                borderColor: address.isDefault
                  ? "var(--p-color-border-focus)"
                  : "var(--p-color-border-secondary)",
                boxShadow: "var(--p-shadow-100)",
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className="font-semibold text-base"
                    style={{ color: "var(--p-color-text)" }}
                  >
                    {address.name}
                  </h3>
                  <div className="h-4 w-px bg-gray-300" />
                  <span
                    className="text-sm"
                    style={{ color: "var(--p-color-text-secondary)" }}
                  >
                    {address.phone}
                  </span>
                  {address.label && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: "var(--p-color-bg-surface-secondary)",
                        color: "var(--p-color-text-secondary)",
                        border: "1px solid var(--p-color-border-secondary)",
                      }}
                    >
                      {address.label}
                    </span>
                  )}
                  {address.isDefault && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: "var(--p-color-bg-surface-success)",
                        color: "var(--p-color-text-success)",
                        border: "1px solid var(--p-color-border-success)",
                      }}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Mặc định
                    </span>
                  )}
                </div>
                <div
                  className="text-sm space-y-1"
                  style={{ color: "var(--p-color-text-secondary)" }}
                >
                  <p>{address.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:flex-col sm:items-end justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "var(--p-color-text-link)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        "var(--p-color-text-link-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--p-color-text-link)";
                    }}
                  >
                    Cập nhật
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => removeAddress(address.id)}
                      disabled={
                        deleteAddress.isPending &&
                        deleteAddress.variables === address.id
                      }
                      className="text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ color: "var(--p-color-text-critical)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => setAsDefault(address.id)}
                    disabled={
                      updateAddress.isPending &&
                      updateAddress.variables?.id === address.id
                    }
                    className="rounded border px-3 py-1.5 text-xs font-medium transition-colors mt-auto disabled:opacity-50"
                    style={{
                      background: "var(--p-color-bg-surface)",
                      borderColor: "var(--p-color-border)",
                      color: "var(--p-color-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--p-color-bg-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--p-color-bg-surface)";
                    }}
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
