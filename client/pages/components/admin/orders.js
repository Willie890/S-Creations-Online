import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/admin/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdateLoading(true);
      const res = await axios.put(`/admin/orders/${orderId}`, {
        status: newStatus
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? res.data.order : order
      ));
      
      alert('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading orders...</p>
        </LoadingContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header>
        <div>
          <h1>Orders Management</h1>
          <p>Manage and track customer orders</p>
        </div>
        <OrderStats>
          <StatItem>
            <StatNumber>{orders.length}</StatNumber>
            <StatLabel>Total Orders</StatLabel>
          </StatItem>
        </OrderStats>
      </Header>

      <Filters>
        <FilterButton 
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Orders
        </FilterButton>
        <FilterButton 
          active={filter === 'pending'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </FilterButton>
        <FilterButton 
          active={filter === 'processing'}
          onClick={() => setFilter('processing')}
        >
          Processing
        </FilterButton>
        <FilterButton 
          active={filter === 'shipped'}
          onClick={() => setFilter('shipped')}
        >
          Shipped
        </FilterButton>
        <FilterButton 
          active={filter === 'completed'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </FilterButton>
        <FilterButton 
          active={filter === 'cancelled'}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </FilterButton>
      </Filters>

      <OrdersTable>
        <TableHeader>
          <th>Order #</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </TableHeader>
        
        <TableBody>
          {filteredOrders.map(order => (
            <TableRow key={order._id}>
              <td>
                <OrderNumber>#{order.orderNumber}</OrderNumber>
              </td>
              <td>
                <CustomerInfo>
                  <CustomerName>{order.user?.name || 'Guest'}</CustomerName>
                  <CustomerEmail>{order.user?.email || 'No email'}</CustomerEmail>
                </CustomerInfo>
              </td>
              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td>
                <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
              </td>
              <td>
                <StatusBadge status={getStatusColor(order.status)}>
                  {order.status}
                </StatusBadge>
              </td>
              <td>
                <ActionButtons>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </Button>
                  <StatusSelect
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    disabled={updateLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </StatusSelect>
                </ActionButtons>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </OrdersTable>

      {filteredOrders.length === 0 && (
        <EmptyState>
          <h3>No orders found</h3>
          <p>There are no orders matching your current filter.</p>
        </EmptyState>
      )}

      {selectedOrder && (
        <OrderModal onClose={() => setSelectedOrder(null)} order={selectedOrder} />
      )}
    </AdminLayout>
  );
}

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    margin: 0;
  }
`;

const OrderStats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.sm};
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const StatLabel = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.gray[300]};
  background: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : theme.colors.gray[700]};
  border-radius: 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${props => props.active ? theme.colors.primary : theme.colors.primary}20;
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
`;

const TableHeader = styled.thead`
  background: ${theme.colors.gray[100]};
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: ${theme.colors.dark};
    border-bottom: 2px solid ${theme.colors.gray[200]};
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background: ${theme.colors.gray[50]};
    }
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }

  td {
    padding: 1rem;
  }
`;

const OrderNumber = styled.span`
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const CustomerInfo = styled.div``;

const CustomerName = styled.div`
  font-weight: 600;
  color: ${theme.colors.dark};
`;

const CustomerEmail = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.gray[600]};
`;

const OrderTotal = styled.span`
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.status}20;
  color: ${props => props.status};
  text-transform: capitalize;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;

  p {
    margin-top: 1rem;
    color: ${theme.colors.gray[600]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: ${theme.shadows.md};

  h3 {
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    margin: 0;
  }
`;

// Order Modal Component (simplified version)
const OrderModal = ({ order, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Order #{order.orderNumber}</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        {/* Order details would go here */}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: ${theme.colors.dark};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${theme.colors.gray[600]};

  &:hover {
    color: ${theme.colors.dark};
  }
`;
