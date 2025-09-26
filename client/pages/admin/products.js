// client/pages/admin/products.js
import { useEffect, useState } from 'react';

export default function AdminProducts({ user }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/products', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setProducts);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      price: parseFloat(price),
      image,
      category,
      sizes: sizes.split(',').map(s => s.trim()),
      description,
    };

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(newProduct),
    });

    // Reset form
    setName(''); setPrice(''); setImage(''); setCategory(''); setSizes(''); setDescription('');
    // Refresh list
    fetch('/api/products', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setProducts);
  };

  if (!user?.isAdmin) return <p>Access denied.</p>;

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Manage Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="Sizes (comma separated)" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <button type="submit" className="btn">Add Product</button>
      </form>

      <h2>Existing Products</h2>
      {products.map(p => (
        <div key={p._id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <strong>{p.name}</strong> - ${p.price}
        </div>
      ))}
    </div>
  );
}
