import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatsCard from '../../../components/admin/StatsCard';
import RecentOrders from '../../../components/admin/RecentOrders';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout>
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading dashboard...</p>
      </LoadingContainer>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <ErrorContainer>
        <h2>{error}</h2>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </ErrorContainer>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <DashboardHeader>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </DashboardHeader>

      <StatsGrid>
        <StatsCard 
          title="Total Sales" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon="💰"
          color="#4CAF50"
          trend={12.5}
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon="📦"
          color="#2196F3"
          trend={8.2}
        />
        <StatsCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon="🛍️"
          color="#FFC107"
          trend={5.7}
        />
        <StatsCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon="👥"
          color="#9C27B0"
          trend={15.3}
        />
      </StatsGrid>

      <DashboardSection>
        <RecentOrders orders={stats.recentOrders} />
      </DashboardSection>

      <QuickActions>
        <h3>Quick Actions</h3>
        <ActionGrid>
          <ActionCard onClick={() => window.location.href = '/admin/products'}>
            <ActionIcon>➕</ActionIcon>
            <ActionText>Add New Product</ActionText>
          </ActionCard>
          <ActionCard onClick={() => window.location.href = '/admin/orders'}>
            <ActionIcon>📋</ActionIcon>
            <ActionText>View Orders</ActionText>
          </ActionCard>
          <ActionCard onClick={() => window.location.href = '/admin/customers'}>
            <ActionIcon>👥</ActionIcon>
            <ActionText>Manage Customers</ActionText>
          </ActionCard>
          <ActionCard onClick={() => window.location.href = '/shop'}>
            <ActionIcon>🏪</ActionIcon>
            <ActionText>View Store</ActionText>
          </ActionCard>
        </ActionGrid>
      </QuickActions>
    </AdminLayout>
  );
}

const DashboardHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.gray[600]};
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DashboardSection = styled.div`
  margin-bottom: 2rem;
`;

const QuickActions = styled.div`
  margin-top: 2rem;

  h3 {
    color: ${theme.colors.dark};
    margin-bottom: 1rem;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionCard = styled.div`
  background: white;
  border: 2px solid ${theme.colors.gray[200]};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ActionText = styled.p`
  font-weight: 600;
  color: ${theme.colors.dark};
  margin: 0;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;

  p {
    margin-top: 1rem;
    color: ${theme.colors.gray[600]};
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;

  h2 {
    color: ${theme.colors.error};
    margin-bottom: 1rem;
  }

  button {
    background: ${theme.colors.primary};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background: ${theme.colors.secondary};
    }
  }
`;
