'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCategories } from '@/src/hooks/use-categories';

export default function CategoryMenu() {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, error } = useCategories();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
          aria-label="Mở danh mục"
        >
          <Menu className="h-5 w-5" style={{ color: 'var(--p-color-icon)' }} />
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-[fade-in_0.2s_ease]" 
        />
        <Dialog.Content
          className="fixed left-0 top-0 z-50 h-full w-[300px] max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0"
          style={{ background: 'var(--p-color-bg-surface)' }}
        >
          <div 
            className="flex h-16 items-center justify-between px-4 border-b"
            style={{ borderColor: 'var(--p-color-border-secondary)' }}
          >
            <Dialog.Title 
              className="text-lg font-semibold"
              style={{ color: 'var(--p-color-text)' }}
            >
              Danh mục sản phẩm
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" style={{ color: 'var(--p-color-icon)' }} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="overflow-y-auto p-2 h-[calc(100vh-64px)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--p-color-text-secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--p-color-text-secondary)' }}>Đang tải danh mục...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-center" style={{ color: 'var(--p-color-text-critical)' }}>
                Không thể tải danh mục. Vui lòng thử lại sau.
              </div>
            ) : data?.data.length === 0 ? (
              <div className="p-4 text-sm text-center" style={{ color: 'var(--p-color-text-secondary)' }}>
                Chưa có danh mục nào.
              </div>
            ) : (
              <nav className="flex flex-col gap-1">
                {data?.data.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    style={{ color: 'var(--p-color-text)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-nav-bg-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {category.name}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
