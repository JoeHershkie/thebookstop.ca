import React from 'react';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderConfirmationModal from './OrderConfirmationModal';

export default function CartIsland() {
  return (
    <>
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
    </>
  );
}
