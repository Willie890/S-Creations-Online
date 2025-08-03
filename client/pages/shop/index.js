import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { theme } from '../../styles/theme'
import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import FilterSidebar from '../../components/FilterSidebar'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'newest'
  })

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products')
        setProducts(res.data)
        setFilteredProducts(res.data)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(p => p.category))]
        setCategories(uniqueCategories)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category)
    }
    
    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )
    
    // Sort products
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    
    setFilteredProducts(result)
  }, [filters, products])

  if (loading) return <LoadingSpinner />

  return (
    <Layout>
      <Head>
        <title>S-Creations | Shop</title>
      </Head>
      
      <ShopContainer>
        <FilterSidebar 
          categories={categories} 
          filters={filters}
          setFilters={setFilters}
        />
        
        <ProductGrid>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <EmptyMessage>No products match your filters</EmptyMessage>
          )}
        </ProductGrid>
      </ShopContainer>
    </Layout>
  )
}

const ShopContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background-color: ${theme.colors.light};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  flex: 1;
  padding: 0 2rem;
`

const EmptyMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.2rem;
  color: ${theme.colors.dark};
`
