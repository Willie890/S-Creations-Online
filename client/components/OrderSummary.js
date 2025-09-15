// client/components/OrderSummary.js
'use client';

import React from 'react';

export default function OrderSummary({ items = [], subtotal = 0, shipping = 5, tax = 0 }) {
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items in cart</p>
        )}
      </div>
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
