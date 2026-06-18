'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, ChevronDown, User, MapPin, Package, LogOut } from 'lucide-react';
import useAuthStore from '@/src/store/auth.store';
import { useLogout } from '@/src/hooks/use-auth';
import { useCartItemCount } from '@/src/hooks/use-cart';
import CategoryMenu from './category-menu';
import CartDrawer from './cart-drawer';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  
  const cartItemCount = useCartItemCount();
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null;
  }

  const handleCartClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setCartOpen(true);
    }
  };

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b"
      style={{ 
        background: 'var(--p-color-bg-surface)', 
        borderColor: 'var(--p-color-border-secondary)'
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu -> Categories */}
          <CategoryMenu />
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'var(--p-color-bg-fill-brand)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white"/>
              </svg>
            </div>
            <span 
              className="hidden sm:block text-lg font-bold tracking-tight"
              style={{ color: 'var(--p-color-text)' }}
            >
              TH Cam Gears
            </span>
          </Link>
        </div>

        {/* Right side: Cart & Auth */}
        <div className="flex items-center gap-4">
          {/* Cart Toggle */}
          <button
            onClick={handleCartClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--p-color-icon)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="h-5 w-5" />
            {isAuthenticated && cartItemCount > 0 && (
              <span 
                className="absolute right-0 top-0 flex h-4 w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ 
                  background: 'var(--p-color-bg-fill-critical)', 
                  color: 'white',
                  border: '1.5px solid var(--p-color-bg-surface)'
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
          
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

          {isAuthenticated && user ? (
            <div className="relative hidden sm:flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors"
                style={{ color: 'var(--p-color-text)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-sm font-medium">{user.fullName}</span>
                <ChevronDown className="h-4 w-4" style={{ color: 'var(--p-color-icon-secondary)' }} />
              </button>

              {profileOpen && (
                <div 
                  className="absolute right-0 top-full mt-1 w-56 rounded-md border shadow-lg py-1 z-50 animate-[appear-below_0.15s_ease]"
                  style={{ 
                    background: 'var(--p-color-bg-surface)',
                    borderColor: 'var(--p-color-border-secondary)',
                    boxShadow: 'var(--p-shadow-300)'
                  }}
                >
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                    style={{ color: 'var(--p-color-text)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <User className="h-4 w-4" style={{ color: 'var(--p-color-icon-secondary)' }} />
                    Thông tin tài khoản
                  </Link>
                  <Link
                    href="/profile/address"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                    style={{ color: 'var(--p-color-text)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: 'var(--p-color-icon-secondary)' }} />
                    Địa chỉ của tôi
                  </Link>
                  <Link
                    href="/profile/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                    style={{ color: 'var(--p-color-text)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Package className="h-4 w-4" style={{ color: 'var(--p-color-icon-secondary)' }} />
                    Đơn hàng
                  </Link>
                  <div className="my-1 border-t" style={{ borderColor: 'var(--p-color-border-secondary)' }} />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logoutMutation.mutate();
                    }}
                    disabled={logoutMutation.isPending}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors text-left"
                    style={{ color: 'var(--p-color-text-critical)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-critical)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 hidden sm:flex">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                style={{ color: 'var(--p-color-text)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
                style={{ 
                  background: 'var(--p-color-bg-fill-brand)', 
                  color: 'var(--p-color-text-brand-on-bg-fill)' 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-fill-brand-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--p-color-bg-fill-brand)'; }}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
