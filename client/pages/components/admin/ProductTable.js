import styled from 'styled-components';
import Button from '../common/Button';

export default function ProductTable({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <LoadingState>
        <p>Loading products...</p>
      </LoadingState>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState>
        <h3>No products found</h3>
        <p>Click "Add Product" to create your first product</p>
      </EmptyState>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <ProductInfo>
                  <ProductImage 
                    src={product.images[0]} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div>
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>
                      {product.description.substring(0, 60)}...
                    </ProductDescription>
                  </div>
                </ProductInfo>
              </td>
              <td>
                <CategoryBadge>{product.category}</CategoryBadge>
              </td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <StockStatus stock={product.stock}>
                  {product.stock}
                </StockStatus>
              </td>
              <td>
                <StatusBadge active={product.stock > 0}>
                  {product.stock > 0 ? 'Active' : 'Out of Stock'}
                </StatusBadge>
              </td>
              <td>
                <ActionButtons>
                  <Button 
                    size="small" 
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    danger 
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </Button>
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #eee;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ProductDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const StockStatus = styled.span`
  font-weight: 600;
  color: ${props => props.stock > 10 ? '#4caf50' : props.stock > 0 ? '#ff9800' : '#f44336'};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.active ? '#4caf5020' : '#f4433620'};
  color: ${props => props.active ? '#4caf50' : '#f44336'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }
`;
