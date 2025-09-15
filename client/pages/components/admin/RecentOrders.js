import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '../../styles/theme';

export default function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState>
        <h3>No recent orders</h3>
        <p>Orders will appear here once they are placed</p>
      </EmptyState>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'processing': return theme.colors.primary;
      case 'shipped': return theme.colors.accent;
      case 'pending': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.gray[500];
    }
  };

  return (
    <RecentOrdersContainer>
      <Header>
        <h2>Recent Orders</h2>
        <Link href="/admin/orders">
          <ViewAllLink>View All →</ViewAllLink>
        </Link>
      </Header>
      
      <OrdersList>
        {orders.map(order => (
          <OrderItem key={order._id}>
            <Link href={`/admin/orders/${order._id}`}>
              <OrderLink>
                <OrderInfo>
                  <OrderNumber>#{order.orderNumber}</OrderNumber>
                  <CustomerName>{order.user?.name || 'Guest Customer'}</CustomerName>
                  <OrderDate>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </OrderDate>
                </OrderInfo>
                
                <OrderDetails>
                  <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
                  <Status status={getStatusColor(order.status)}>
                    {order.status}
                  </Status>
                </OrderDetails>
              </OrderLink>
            </Link>
          </OrderItem>
        ))}
      </OrdersList>
    </RecentOrdersContainer>
  );
}

const RecentOrdersContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${theme.shadows.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${theme.colors.gray[200]};

  h2 {
    color: ${theme.colors.dark};
    margin: 0;
    font-size: 1.3rem;
  }
`;

const ViewAllLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.md};
  }
`;

const OrderLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: ${theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const CustomerName = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const OrderDate = styled.div`
  color: ${theme.colors.gray[500]};
  font-size: 0.8rem;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
  font-size: 1.1rem;
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.status}20;
  color: ${props => props.status};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${theme.colors.gray[600]};

  h3 {
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
  }
`;
