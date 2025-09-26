// client/pages/[id].js
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import theme from '../styles/theme';

const products = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/product1.jpg', description: 'This is product 1 description.' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/product2.jpg', description: 'This is product 2 description.' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/product3.jpg', description: 'This is product 3 description.' },
];

export default function ProductPage({ params }) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: theme.spacing.xl, padding: theme.spacing.md }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: theme.borderRadius.md }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: theme.spacing.md }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', color: theme.colors.primary, fontWeight: 'bold', marginBottom: theme.spacing.md }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ marginBottom: theme.spacing.lg }}>{product.description}</p>
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: products.map((product) => ({ params: { id: product.id.toString() } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: { params },
  };
}
