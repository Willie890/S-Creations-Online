import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { theme } from '../../../styles/theme'
import Layout from '../../../components/Layout'
import Button from '../../../components/Button'
import { useCart } from '../../../context/CartContext'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!id) return

    async function fetchProduct() {
      try {
        const res = await axios.get(`/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>{error}</Layout>

  return (
    <Layout>
      <ProductContainer>
        <ImageGallery>
          <MainImage src={product.images[selectedImage]} alt={product.name} />
          <ThumbnailContainer>
            {product.images.map((img, index) => (
              <Thumbnail 
                key={index}
                src={img}
                alt={product.name}
                active={index === selectedImage}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </ThumbnailContainer>
        </ImageGallery>

        <ProductInfo>
          <h1>{product.name}</h1>
          <Category>{product.category}</Category>
          <Price>${product.price.toFixed(2)}</Price>
          <Description>{product.description}</Description>
          
          <QuantitySelector>
            <Button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button 
              onClick={() => setQuantity(prev => prev + 1)}
              disabled={quantity >= product.stock}
            >
              +
            </Button>
          </QuantitySelector>

          <Button 
            primary 
            onClick={() => addToCart(product, quantity)}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          <StockStatus>
            {product.stock > 0 
              ? `${product.stock} available in stock` 
              : 'Currently out of stock'}
          </StockStatus>
        </ProductInfo>
      </ProductContainer>
    </Layout>
  )
}

const ProductContainer = styled.div`
  display: flex;
  padding: 2rem;
  gap: 3rem;
  background-color: ${theme.colors.light};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`

const ImageGallery = styled.div`
  flex: 1;
  max-width: 600px;
`

const MainImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
`

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
  }
`

const ProductInfo = styled.div`
  flex: 1;
  max-width: 500px;
`

const Category = styled.p`
  color: ${theme.colors.secondary};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
`

const Price = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin: 1rem 0;
`

const Description = styled.p`
  line-height: 1.6;
  margin-bottom: 2rem;
  color: ${theme.colors.text};
`

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  span {
    width: 40px;
    text-align: center;
    font-weight: 600;
  }
`

const StockStatus = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: ${theme.colors.dark};
`
