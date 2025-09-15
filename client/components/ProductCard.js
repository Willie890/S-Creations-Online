import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from './common/Button';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card>
      <Link href={`/${product._id}`}>
        <CardLink>
          <ImageContainer>
            <ProductImage 
              src={product.images[0]} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {product.stock === 0 && (
              <OutOfStockBadge>Out of Stock</OutOfStockBadge>
            )}
            {product.featured && (
              <FeaturedBadge>Featured</FeaturedBadge>
            )}
          </ImageContainer>
          
          <CardContent>
            <Category>{product.category}</Category>
            <ProductName>{product.name}</ProductName>
            <Description>{product.description.substring(0, 100)}...</Description>
            
            <PriceSection>
              <Price>${product.price.toFixed(2)}</Price>
              <Rating>
                ⭐ {product.ratings.toFixed(1)} ({product.numOfReviews})
              </Rating>
            </PriceSection>
          </CardContent>
        </CardLink>
      </Link>

      <CardActions>
        <Button 
          primary 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          fullWidth
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
}

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: 12px;
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CardLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const OutOfStockBadge = styled.span`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  background: ${theme.colors.error};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${theme.colors.accent};
  color: ${theme.colors.dark};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const Category = styled.span`
  display: inline-block;
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.sm};
`;

const ProductName = styled.h3`
  color: ${theme.colors.dark};
  margin: ${theme.spacing.xs} 0;
  font-size: 1.2rem;
  line-height: 1.4;
`;

const Description = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: ${theme.spacing.sm} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
`;

const Price = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const Rating = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.gray[600]};
`;

const CardActions = styled.div`
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
`;
