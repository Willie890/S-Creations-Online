import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductTable from '../../../components/admin/ProductTable';
import ProductModal from '../../../components/admin/ProductModal';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/admin/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('Failed to load products');
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
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setActionLoading(true);
      let updatedProduct;

      if (currentProduct) {
        // Update existing product
        const res = await axios.put(
          `/admin/products/${currentProduct._id}`,
          productData
        );
        updatedProduct = res.data.product;
        setProducts(products.map(p => 
          p._id === currentProduct._id ? updatedProduct : p
        ));
      } else {
        // Create new product
        const res = await axios.post('/admin/products', productData);
        updatedProduct = res.data.product;
        setProducts([...products, updatedProduct]);
      }
      
      setModalOpen(false);
      alert(`Product ${currentProduct ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Header>
        <div>
          <h1>Products Management</h1>
          <p>Manage your product inventory and listings</p>
        </div>
        <Button onClick={handleCreate} primary>
          + Add Product
        </Button>
      </Header>

      <ProductsInfo>
        <InfoCard>
          <InfoNumber>{products.length}</InfoNumber>
          <InfoLabel>Total Products</InfoLabel>
        </InfoCard>
        <InfoCard>
          <InfoNumber>
            {products.filter(p => p.stock > 0).length}
          </InfoNumber>
          <InfoLabel>In Stock</InfoLabel>
        </InfoCard>
        <InfoCard>
          <InfoNumber>
            {products.filter(p => p.stock === 0).length}
          </InfoNumber>
          <InfoLabel>Out of Stock</InfoLabel>
        </InfoCard>
        <InfoCard>
          <InfoNumber>
            {products.filter(p => p.featured).length}
          </InfoNumber>
          <InfoLabel>Featured</InfoLabel>
        </InfoCard>
      </ProductsInfo>

      <ProductTable 
        products={products} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        product={currentProduct}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid ${theme.colors.gray[200]};

  h1 {
    font-size: 2rem;
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    margin: 0;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const ProductsInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: ${theme.shadows.md};
  border-left: 4px solid ${theme.colors.primary};
`;

const InfoNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.div`
  color: ${theme.colors.gray[600]};
  font-weight: 600;
`;
