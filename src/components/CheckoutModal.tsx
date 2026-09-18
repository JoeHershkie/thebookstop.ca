import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartItems,
  $cartSubtotal,
  $isCheckoutOpen,
  closeCheckoutModal,
  clearCart,
  setConfirmedOrder,
} from '../stores/cartStore';
import { X, CheckCircle2, Truck, MapPin, AlertCircle, Loader2 } from 'lucide-react';

export default function CheckoutModal() {
  const isOpen = useStore($isCheckoutOpen);
  const items = useStore($cartItems);
  const subtotal = useStore($cartSubtotal);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'shipping'>('pickup');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCheckoutModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock scroll
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    if (fulfillmentType === 'shipping' && !shippingAddress.trim()) {
      setErrorMessage('Please provide your shipping mailing address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        fulfillmentType,
        shippingAddress: fulfillmentType === 'shipping' ? shippingAddress.trim() : undefined,
        notes: notes.trim() || undefined,
        items,
        subtotal,
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order. Please try again.');
      }

      // Order success!
      setConfirmedOrder({
        ...payload,
        orderId: data.orderId,
        createdAt: data.createdAt || new Date().toISOString(),
      });

      clearCart();
      closeCheckoutModal();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again or message Grace directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCheckoutModal}
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center sm:p-0">
        <div className="relative bg-[#fcfaf7] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg w-full border border-[#261916]/15">
          
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-[#261916]/10 bg-[#f8f4ee] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#261916]">Complete Your Order</h3>
              <p className="text-xs text-[#614f48] mt-0.5">
                Review your items & enter your contact info
              </p>
            </div>
            <button
              type="button"
              onClick={closeCheckoutModal}
              className="p-2 rounded-full text-[#614f48] hover:text-[#261916] hover:bg-[#261916]/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Order Summary Miniature */}
            <div className="p-3.5 rounded-xl bg-[#f4eee2] border border-[#261916]/10 space-y-2">
              <div className="text-xs font-serif font-bold text-[#261916] uppercase tracking-wider">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </div>
              <div className="divide-y divide-[#261916]/5 text-xs text-[#614f48]">
                {items.map((item) => (
                  <div key={item.id} className="py-1.5 flex justify-between">
                    <span>
                      {item.quantity}x {item.title} ({item.coverStyle})
                    </span>
                    <span className="font-mono font-medium text-[#261916]">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#261916]/10 flex justify-between font-bold text-sm text-[#261916]">
                <span>Total Due:</span>
                <span className="font-mono text-[#852f24]">${subtotal} CAD</span>
              </div>
            </div>

            {/* Contact Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-serif font-bold text-[#261916] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#261916]/20 bg-white text-sm text-[#261916] focus:outline-none focus:border-[#852f24] focus:ring-1 focus:ring-[#852f24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#261916] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#261916]/20 bg-white text-sm text-[#261916] focus:outline-none focus:border-[#852f24] focus:ring-1 focus:ring-[#852f24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#261916] uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(807) 555-0123"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#261916]/20 bg-white text-sm text-[#261916] focus:outline-none focus:border-[#852f24] focus:ring-1 focus:ring-[#852f24]"
                  />
                </div>
              </div>
            </div>

            {/* Fulfillment Selection */}
            <div>
              <label className="block text-xs font-serif font-bold text-[#261916] uppercase tracking-wider mb-2">
                Delivery / Pickup Method *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#852f24] bg-[#852f24]/10'
                      : 'border-[#261916]/15 bg-white hover:border-[#852f24]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#852f24]" />
                    <span className="font-serif font-bold text-xs text-[#261916]">Local Pickup</span>
                  </div>
                  <p className="text-[11px] text-[#614f48] mt-1">
                    Fort Frances, ON / at our next market booth.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('shipping')}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    fulfillmentType === 'shipping'
                      ? 'border-[#852f24] bg-[#852f24]/10'
                      : 'border-[#261916]/15 bg-white hover:border-[#852f24]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#852f24]" />
                    <span className="font-serif font-bold text-xs text-[#261916]">Postal Shipping</span>
                  </div>
                  <p className="text-[11px] text-[#614f48] mt-1">
                    Canada Post delivery to your home.
                  </p>
                </button>
              </div>

              {/* Shipping Notice & Address Input */}
              {fulfillmentType === 'shipping' && (
                <div className="mt-3 p-3 rounded-xl bg-[#c28731]/10 border border-[#c28731]/30 space-y-2">
                  <div className="text-xs font-medium text-[#261916]">
                    <strong>Note:</strong> Shipping fee will be confirmed via email.
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#614f48] mb-1">
                      Mailing Address, City, Postal Code:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="123 Scott St, Fort Frances, ON P9A 1G7"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#261916]/20 bg-white text-xs text-[#261916] focus:outline-none focus:border-[#852f24]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-serif font-bold text-[#261916] uppercase tracking-wider mb-1">
                Special Notes for Grace{' '}
                <span className="text-[11px] font-normal text-[#614f48]">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gift wrapping request, specific pickup date, etc."
                className="w-full px-3.5 py-2 rounded-xl border border-[#261916]/20 bg-white text-xs text-[#261916] focus:outline-none focus:border-[#852f24]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#852f24] hover:bg-[#6e241b] text-[#fbf8f3] font-serif font-bold text-base transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order & View e-Transfer Details</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#614f48] mt-2">
                By confirming, your order will be reserved for 24 hours awaiting Interac e-Transfer.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
