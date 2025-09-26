// client/pages/admin/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../../utils/api';

export default function Admin({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(() => alert('Failed to load orders'));
  }, [user]);

  const markComplete = async (orderId) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status: 'completed' }),
    });
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'completed' } : o));
  };

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
          {order.status !== 'completed' && (
            <button onClick={() => markComplete(order._id)} className="btn-outline">
              Mark Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
