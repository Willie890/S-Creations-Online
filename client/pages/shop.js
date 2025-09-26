// client/pages/shop.js
import Layout from '../components/Layout';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import theme from '../styles/theme';

const products = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/product1.jpg' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/product2.jpg' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/product3.jpg' },
  { id: 4, name: 'Product 4', price: 39.99, image: '/product4.jpg' },
  { id: 5, name: 'Product 5', price: 59.99, image: '/product5.jpg' },
  { id: 6, name: 'Product 6', price: 24.99, image: '/product6.jpg' },
];

export default function Shop() {
  return (
    <Layout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
        <FilterSidebar />
        <div style={{ marginLeft: '250px', padding: theme.spacing.md, width: '100%' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: theme.spacing.lg }}>Shop All Products</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
