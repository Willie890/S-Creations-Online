import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import AdminLayout from '../../../components/admin/AdminLayout';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/admin/customers');
      setCustomers(res.data.customers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading customers...</p>
        </LoadingContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header>
        <h1>Customers Management</h1>
        <p>View and manage your customer database</p>
      </Header>

      <CustomersGrid>
        {customers.map(customer => (
          <CustomerCard key={customer._id}>
            <CustomerHeader>
              <CustomerAvatar>
                {customer.name.charAt(0).toUpperCase()}
              </CustomerAvatar>
              <CustomerInfo>
                <CustomerName>{customer.name}</CustomerName>
                <CustomerEmail>{customer.email}</CustomerEmail>
              </CustomerInfo>
            </CustomerHeader>
            
            <CustomerDetails>
              <DetailItem>
                <Label>Phone:</Label>
                <Value>{customer.phone || 'Not provided'}</Value>
              </DetailItem>
              <DetailItem>
                <Label>Orders:</Label>
                <Value>{customer.ordersCount || 0} orders</Value>
              </DetailItem>
              <DetailItem>
                <Label>Member since:</Label>
                <Value>{new Date(customer.createdAt).toLocaleDateString()}</Value>
              </DetailItem>
            </CustomerDetails>

            <CustomerActions>
              <ActionButton>View Orders</ActionButton>
              <ActionButton>Send Email</ActionButton>
            </CustomerActions>
          </CustomerCard>
        ))}
      </CustomersGrid>

      {customers.length === 0 && (
        <EmptyState>
          <h3>No customers found</h3>
          <p>Customers will appear here once they register.</p>
        </EmptyState>
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

const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CustomerCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${theme.shadows.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CustomerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CustomerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const CustomerInfo = styled.div``;

const CustomerName = styled.h3`
  margin: 0;
  color: ${theme.colors.dark};
  font-size: 1.1rem;
`;

const CustomerEmail = styled.p`
  margin: 0;
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const CustomerDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: ${theme.colors.gray[700]};
`;

const Value = styled.span`
  color: ${theme.colors.gray[600]};
`;

const CustomerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.colors.primary};
  background: transparent;
  color: ${theme.colors.primary};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.primary};
    color: white;
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
