import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'newest',
    search: ''
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('/products');
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
        
        const uniqueCategories = [...new Set(res.data.products.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, products]);

  if (loading) return (
    <Layout>
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    </Layout>
  );

  return (
    <Layout>
      <Head>
        <title>S-Creations | Shop</title>
        <meta name="description" content="Browse our collection of handmade products" />
      </Head>
      
      <ShopContainer>
        <FilterSidebar 
          categories={categories} 
          filters={filters}
          setFilters={setFilters}
        />
        
        <MainContent>
          <PageHeader>
            <h1>Our Products</h1>
            <ResultsCount>{filteredProducts.length} products found</ResultsCount>
          </PageHeader>
          
          <ProductGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <EmptyMessage>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </EmptyMessage>
            )}
          </ProductGrid>
        </MainContent>
      </ShopContainer>
    </Layout>
  );
}

const ShopContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  padding: ${theme.spacing.xl} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0 ${theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  
  h1 {
    color: ${theme.colors.dark};
    margin: 0;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    text-align: center;
  }
`;

const ResultsCount = styled.p`
  color: ${theme.colors.gray[600]};
  font-weight: 500;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
`;

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.gray[600]};
  
  h3 {
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;
