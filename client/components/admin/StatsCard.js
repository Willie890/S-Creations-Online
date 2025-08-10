import styled from 'styled-components'

export default function StatsCard({ title, value, icon, color }) {
  return (
    <Card color={color}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  )
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-top: 4px solid ${props => props.color};
`

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const Title = styled.h3`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`

const Value = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
`
