import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartItems,
  $isCartOpen,
  $cartSubtotal,
  closeCartDrawer,
  updateItemQuantity,
  removeFromCart,
  openCheckoutModal,
} from '../stores/cartStore';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const items = useStore($cartItems);
  const subtotal = useStore($cartSubtotal);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fcfaf7] border-l border-[#261916]/15 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#261916]/10 flex items-center justify-between bg-[#f8f4ee]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#852f24]" />
              <h2 className="font-serif font-bold text-xl text-[#261916]">Your Book Bag</h2>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-2 rounded-full text-[#614f48] hover:text-[#261916] hover:bg-[#261916]/5 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#614f48]">
                <div className="w-16 h-16 rounded-full bg-[#852f24]/10 flex items-center justify-center mb-4 text-[#852f24]">
                  <ShoppingBag className="w-8 h-8 opacity-80" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#261916]">Your bag is empty</h3>
                <p className="text-xs mt-2 max-w-xs text-[#614f48]">
                  Handcrafted 1-month and 3-month planners are custom made by Grace right here in Fort Frances.
                </p>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#852f24] text-[#fbf8f3] font-serif text-sm font-medium hover:bg-[#6e241b] transition-colors cursor-pointer"
                >
                  Explore Planners
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl border border-[#261916]/10 bg-white shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-22 rounded-lg overflow-hidden shrink-0 border border-[#261916]/10 bg-[#f4eee2]">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.coverStyle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#852f24]/10 text-xs font-serif text-[#852f24] text-center p-1">
                        Custom
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-[#261916] line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8a766e] hover:text-[#852f24] p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-mono text-[#852f24] mt-0.5">
                        {item.coverStyle}
                      </p>

                      {item.customNotes && (
                        <p className="text-[11px] text-[#614f48] italic mt-1 line-clamp-2 bg-[#f8f4ee] px-2 py-0.5 rounded-sm">
                          “{item.customNotes}”
                        </p>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#261916]/5">
                      <div className="flex items-center border border-[#261916]/15 rounded-lg bg-[#fbf8f3] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#261916] hover:bg-[#852f24]/10 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-xs text-[#261916]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#261916] hover:bg-[#852f24]/10 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-mono font-bold text-sm text-[#261916]">
                        ${item.price * item.quantity} CAD
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#261916]/10 bg-[#f8f4ee] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm text-[#614f48]">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-base text-[#261916]">
                    ${subtotal} CAD
                  </span>
                </div>
                <p className="text-[11px] text-[#614f48] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#455a4a] shrink-0" />
                  <span>Free local pickup in Fort Frances or postal delivery</span>
                </p>
              </div>

              <button
                type="button"
                onClick={openCheckoutModal}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#852f24] hover:bg-[#6e241b] text-[#fbf8f3] font-serif font-bold text-base transition-colors shadow-md cursor-pointer"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#8a766e]">
                No credit card required upfront. Orders are confirmed via Interac e-Transfer.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
