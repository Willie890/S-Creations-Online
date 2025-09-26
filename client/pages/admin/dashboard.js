// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  if (!isAdmin) return null;

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ color: '#4A6B3A' }}>📊 Admin Dashboard</h1>
      <Link href="/admin/products" passHref>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4A6B3A',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginRight: '1rem',
        }}>
          Manage Products
        </button>
      </Link>
      <Link href="/admin/orders" passHref>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#D8B4E2',
          color: '#4A6B3A',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          View Orders
        </button>
      </Link>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#4A6B3A' }}>📦 Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0,
          }}>
            {orders.map(order => (
              <li key={order.id} style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '10px',
                marginBottom: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <strong>Order #{order.id}</strong> - {order.date}
                <br />
                Status: {order.status}
                <br />
                Customer: {order.customerName || 'Anonymous'}
                <br />
                <button
                  onClick={() => {
                    const updatedOrders = orders.map(o =>
                      o.id === order.id ? { ...o, status: 'Completed' } : o
                    );
                    localStorage.setItem('orders', JSON.stringify(updatedOrders));
                    alert(`Order #${order.id} marked as completed.`);
                  }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#4A6B3A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
