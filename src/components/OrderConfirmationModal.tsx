import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $confirmedOrder, setConfirmedOrder } from '../stores/cartStore';
import {
  CheckCircle,
  Copy,
  Check,
  Mail,
  Phone,
  HelpCircle,
  PackageCheck,
  X,
} from 'lucide-react';

export default function OrderConfirmationModal() {
  const order = useStore($confirmedOrder);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('graciep910@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center sm:p-0">
        <div className="relative bg-[#fcfaf7] rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-xl w-full border border-[#261916]/15">
          
          {/* Header Banner */}
          <div className="bg-[#852f24] text-[#fbf8f3] p-6 text-center relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#fbf8f3]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close confirmation"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-3 text-[#fbf8f3]">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-2xl">Order Placed Successfully!</h3>
            <p className="text-xs text-[#fbf8f3]/80 mt-1">
              Thank you, {order.customerName}. Your order reference is{' '}
              <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                {order.orderId}
              </span>
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Interac e-Transfer Instructions Box */}
            <div className="p-5 rounded-2xl bg-[#f4eee2] border-2 border-[#852f24]/30 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#852f24]" />
                <h4 className="font-serif font-bold text-base text-[#261916]">
                  How to Complete Your Payment (Interac e-Transfer)
                </h4>
              </div>

              <p className="text-xs text-[#614f48] leading-relaxed">
                To finalize and hold your handcrafted planner order, please send an Interac e-Transfer from your online banking to Grace:
              </p>

              <div className="bg-white p-4 rounded-xl border border-[#261916]/10 space-y-3">
                <div className="flex items-center justify-between border-b border-[#261916]/5 pb-2">
                  <span className="text-xs text-[#614f48]">Recipient Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#261916]">
                      graciep910@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1 text-[#852f24] hover:bg-[#852f24]/10 rounded transition-colors cursor-pointer"
                      title="Copy email"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#261916]/5 pb-2">
                  <span className="text-xs text-[#614f48]">Recipient Name:</span>
                  <span className="font-serif font-medium text-sm text-[#261916]">
                    Grace (The Book Stop)
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#261916]/5 pb-2">
                  <span className="text-xs text-[#614f48]">Transfer Amount:</span>
                  <span className="font-mono font-bold text-base text-[#852f24]">
                    ${order.subtotal} CAD
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#614f48]">e-Transfer Message:</span>
                  <span className="font-mono font-bold text-xs bg-[#f4eee2] px-2 py-1 rounded text-[#261916]">
                    {order.orderId}
                  </span>
                </div>
              </div>

              {order.fulfillmentType === 'shipping' && (
                <div className="p-3 bg-[#c28731]/10 rounded-xl border border-[#c28731]/30 text-xs text-[#261916]">
                  <strong>Shipping notice:</strong> Shipping fee will be confirmed via email before dispatching.
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-sm text-[#261916] uppercase tracking-wider">
                What happens next?
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#614f48]">
                <div className="p-3 bg-white rounded-xl border border-[#261916]/10">
                  <strong className="block text-[#261916] font-medium mb-1">1. Confirmation Email</strong>
                  Grace receives your order specifics and will mark it paid once the transfer arrives.
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#261916]/10">
                  <strong className="block text-[#261916] font-medium mb-1">2. Handcrafted Assembly</strong>
                  Your planner is assembled, bound, and packaged with care in Fort Frances.
                </div>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="border-t border-[#261916]/10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#614f48]">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#852f24]" />
                <span>Questions or need changes?</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+18072713557"
                  className="flex items-center gap-1 text-[#852f24] hover:underline font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+1 (807) 271-3557</span>
                </a>
                <a
                  href="mailto:graciep910@gmail.com"
                  className="flex items-center gap-1 text-[#852f24] hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Grace</span>
                </a>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3.5 rounded-full bg-[#261916] hover:bg-[#852f24] text-[#fbf8f3] font-serif font-bold text-sm transition-colors cursor-pointer"
            >
              Done & Return to Homepage
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
