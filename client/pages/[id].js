import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError('Product not found');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <Layout>
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    </Layout>
  );

  if (error) return (
    <Layout>
      <ErrorContainer>
        <h2>{error}</h2>
        <Button onClick={() => router.push('/shop')}>
          Back to Shop
        </Button>
      </ErrorContainer>
    </Layout>
  );

  return (
    <Layout>
      <ProductContainer>
        <ImageGallery>
          <MainImage 
            src={product.images[selectedImage]} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <ThumbnailContainer>
            {product.images.map((img, index) => (
              <Thumbnail 
                key={index}
                src={img}
                alt={product.name}
                active={index === selectedImage}
                onClick={() => setSelectedImage(index)}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            ))}
          </ThumbnailContainer>
        </ImageGallery>

        <ProductInfo>
          <Breadcrumb>
            <span onClick={() => router.push('/shop')}>Shop</span>
            <span> / </span>
            <span>{product.category}</span>
            <span> / </span>
            <span>{product.name}</span>
          </Breadcrumb>

          <ProductHeader>
            <h1>{product.name}</h1>
            <Category>{product.category}</Category>
          </ProductHeader>

          <Price>${product.price.toFixed(2)}</Price>
          
          <Rating>
            {'⭐'.repeat(Math.floor(product.ratings))}
            <span>({product.numOfReviews} reviews)</span>
          </Rating>

          <Description>{product.description}</Description>
          
          <QuantitySelector>
            <label>Quantity:</label>
            <QuantityControls>
              <Button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                secondary
              >
                -
              </Button>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
                  setQuantity(value);
                }}
                min="1"
                max={product.stock}
              />
              <Button 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
                secondary
              >
                +
              </Button>
            </QuantityControls>
          </QuantitySelector>

          <ActionButtons>
            <Button 
              primary 
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              fullWidth
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </ActionButtons>

          <StockStatus stock={product.stock}>
            {product.stock > 0 
              ? `${product.stock} available in stock` 
              : 'Currently out of stock'}
          </StockStatus>

          <ProductMeta>
            <MetaItem>
              <strong>Category:</strong> {product.category}
            </MetaItem>
            <MetaItem>
              <strong>SKU:</strong> {product._id}
            </MetaItem>
          </ProductMeta>
        </ProductInfo>
      </ProductContainer>
    </Layout>
  );
}

const ProductContainer = styled.div`
  display: flex;
  padding: ${theme.spacing.xl};
  gap: ${theme.spacing.xxl};
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.xl};
    padding: ${theme.spacing.lg};
  }
`;

const ImageGallery = styled.div`
  flex: 1;
  max-width: 600px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.lg};
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  max-width: 500px;
`;

const Breadcrumb = styled.div`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
  font-size: 0.9rem;

  span {
    cursor: pointer;
    
    &:hover {
      color: ${theme.colors.primary};
    }
    
    &:last-child {
      color: ${theme.colors.dark};
      cursor: default;
      
      &:hover {
        color: ${theme.colors.dark};
      }
    }
  }
`;

const ProductHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Category = styled.span`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Price = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin: ${theme.spacing.lg} 0;
`;

const Rating = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  span {
    margin-left: ${theme.spacing.sm};
    color: ${theme.colors.gray[600]};
    font-size: 0.9rem;
  }
`;

const Description = styled.p`
  line-height: 1.8;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text};
  font-size: 1.1rem;
`;

const QuantitySelector = styled.div`
  margin: ${theme.spacing.xl} 0;
  
  label {
    display: block;
    margin-bottom: ${theme.spacing.sm};
    font-weight: 600;
    color: ${theme.colors.dark};
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  padding: ${theme.spacing.sm};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: 5px;
  font-weight: 600;
  
  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  margin: ${theme.spacing.xl} 0;
`;

const StockStatus = styled.p`
  color: ${props => props.stock > 0 ? theme.colors.success : theme.colors.error};
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
`;

const ProductMeta = styled.div`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.gray[100]};
  border-radius: 8px;
  border-left: 4px solid ${theme.colors.primary};
`;

const MetaItem = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: ${theme.colors.gray[700]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  
  h2 {
    color: ${theme.colors.error};
    margin-bottom: ${theme.spacing.xl};
  }
`;
