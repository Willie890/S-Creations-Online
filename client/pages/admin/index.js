// client/pages/admin/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Admin({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setOrders);
  }, [user]);

  if (!user?.isAdmin) {
    return <p style={{ textAlign: 'center', padding: '3rem' }}>Access denied.</p>;
  }

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" className="btn">Manage Products</Link>
      </div>

      <h2>Recent Orders</h2>
      {orders.map(order => (
        <div key={order._id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <button
            onClick={async () => {
              await fetch(`/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ status: 'completed' }),
              });
              setOrders(orders.map(o => o._id === order._id ? { ...o, status: 'completed' } : o));
            }}
            className="btn-outline"
          >
            Mark Complete
          </button>
        </div>
      ))}
    </div>
  );
}
