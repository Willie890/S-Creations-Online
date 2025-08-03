import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import AdminLayout from '../../components/admin/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import RecentOrders from '../../components/admin/RecentOrders'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get('/api/admin/stats')
        setStats(res.data)
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <AdminLayout>Loading...</AdminLayout>

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
        />
        <StatsCard 
          title="Orders" 
          value={stats.totalOrders} 
          icon="📦"
          color="#2196F3"
        />
        <StatsCard 
          title="Products" 
          value={stats.totalProducts} 
          icon="🛍️"
          color="#FFC107"
        />
        <StatsCard 
          title="Customers" 
          value={stats.totalCustomers} 
          icon="👥"
          color="#9C27B0"
        />
      </StatsGrid>

      <RecentOrders orders={stats.recentOrders} />
    </AdminLayout>
  )
}

const DashboardHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: ${theme.colors.dark};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.text};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`
