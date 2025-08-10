import styled from 'styled-components'
import Link from 'next/link'

export default function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return <p>No recent orders</p>
  }

  return (
    <div>
      <h2>Recent Orders</h2>
      <OrdersList>
        {orders.map(order => (
          <OrderItem key={order._id}>
            <Link href={`/admin/orders/${order._id}`}>
              <OrderLink>
                <div>
                  <strong>Order #{order.orderNumber}</strong>
                  <p>{order.user?.name || 'Guest'}</p>
                </div>
                <div>
                  <p>${order.total.toFixed(2)}</p>
                  <Status status={order.status}>{order.status}</Status>
                </div>
              </OrderLink>
            </Link>
          </OrderItem>
        ))}
      </OrdersList>
    </div>
  )
}

const OrdersList = styled.div`
  margin-top: 1rem;
`

const OrderItem = styled.div`
  margin-bottom: 1rem;
`

const OrderLink = styled.a`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => 
    props.status === 'completed' ? '#4CAF50' : 
    props.status === 'shipped' ? '#2196F3' : '#FFC107'};
  color: white;
`
