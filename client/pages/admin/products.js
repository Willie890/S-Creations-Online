import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductTable from '../../components/admin/ProductTable';
import Button from '../../components/common/Button'; // Fixed import path
import ProductModal from '../../components/admin/ProductModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (currentProduct) {
        // Update existing product
        const res = await axios.put(
          `/api/admin/products/${currentProduct._id}`,
          productData
        );
        setProducts(products.map(p => 
          p._id === currentProduct._id ? res.data : p
        ));
      } else {
        // Create new product
        const res = await axios.post('/api/admin/products', productData);
        setProducts([...products, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <AdminLayout>
      <Header>
        <h1>Products</h1>
        <Button onClick={handleCreate}>Add Product</Button>
      </Header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable 
          products={products} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        product={currentProduct}
      />
    </AdminLayout>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    color: #2F4F4F;
  }
`;
