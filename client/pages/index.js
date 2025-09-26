// client/pages/index.js
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import theme from '../styles/theme';

const products = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/product1.jpg' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/product2.jpg' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/product3.jpg' },
];

export default function Home() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: theme.spacing.md }}>Welcome to S-Creations</h1>
        <p style={{ fontSize: '1.2rem', color: theme.colors.secondary }}>
          Discover our amazing collection of products
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
}
