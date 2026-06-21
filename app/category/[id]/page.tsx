"use client";

import { useState, use } from "react";
import { useProductsByCategory } from "@/src/hooks/use-products";
import ProductCard from "@/src/components/product-card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProductsByCategory(id, page, 12);
  const router = useRouter();

  const handleAuthRequired = () => {
    router.push("/login");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--p-color-text)" }}
        >
          {data?.category?.name || "Danh mục sản phẩm"}
        </h1>
        {data?.category?.description && (
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--p-color-text-secondary)" }}
          >
            {data.category.description}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "var(--p-color-text-secondary)" }}
          />
        </div>
      ) : error ? (
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            background: "var(--p-color-bg-surface-critical)",
            color: "var(--p-color-text-critical)",
          }}
        >
          Đã xảy ra lỗi khi tải danh mục. Vui lòng thử lại sau.
        </div>
      ) : data?.data.length === 0 ? (
        <div
          className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center"
          style={{ borderColor: "var(--p-color-border)" }}
        >
          <p
            className="text-base font-medium"
            style={{ color: "var(--p-color-text-secondary)" }}
          >
            Chưa có sản phẩm nào trong danh mục này
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.lastPage > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors disabled:opacity-50"
                style={{
                  borderColor: "var(--p-color-border)",
                  background: "var(--p-color-bg-surface)",
                  color: "var(--p-color-icon)",
                }}
                onMouseEnter={(e) => {
                  if (page > 1)
                    e.currentTarget.style.background =
                      "var(--p-color-bg-surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-surface)";
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span
                className="text-sm font-medium"
                style={{ color: "var(--p-color-text)" }}
              >
                Trang {page} / {data.meta.lastPage}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(data.meta.lastPage, p + 1))
                }
                disabled={page === data.meta.lastPage}
                className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors disabled:opacity-50"
                style={{
                  borderColor: "var(--p-color-border)",
                  background: "var(--p-color-bg-surface)",
                  color: "var(--p-color-icon)",
                }}
                onMouseEnter={(e) => {
                  if (page < data.meta.lastPage)
                    e.currentTarget.style.background =
                      "var(--p-color-bg-surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "var(--p-color-bg-surface)";
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
