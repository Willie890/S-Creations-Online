// client/pages/order-confirmation.js
export default function Confirmation() {
  return (
    <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <p>Your order has been placed.</p>
      <p>You’ll receive a tracking link via email once shipped.</p>
      <a href="/shop" className="btn" style={{ marginTop: '2rem' }}>Continue Shopping</a>
    </div>
  );
}
