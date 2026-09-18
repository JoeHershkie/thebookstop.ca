import React from 'react';
import { useStore } from '@nanostores/react';
import { $cartCount, toggleCartDrawer } from '../stores/cartStore';
import { ShoppingBag } from 'lucide-react';

export default function CartToggle() {
  const count = useStore($cartCount);

  return (
    <button
      onClick={toggleCartDrawer}
      type="button"
      className="relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#852f24]/30 bg-[#fbf8f3] text-[#261916] hover:bg-[#852f24] hover:text-[#fbf8f3] hover:border-[#852f24] transition-all duration-200 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#852f24]/40"
      aria-label={`Shopping cart with ${count} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      <span className="font-serif text-sm font-medium hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-mono font-bold rounded-full bg-[#852f24] text-[#fbf8f3] group-hover:bg-[#fbf8f3] group-hover:text-[#852f24] transition-colors">
          {count}
        </span>
      )}
    </button>
  );
}
