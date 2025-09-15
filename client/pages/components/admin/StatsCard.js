import styled from 'styled-components';
import { theme } from '../../styles/theme';

export default function StatsCard({ title, value, icon, color, trend }) {
  return (
    <Card color={color}>
      <IconWrapper color={color}>
        {icon}
      </IconWrapper>
      <Content>
        <Title>{title}</Title>
        <Value>{value}</Value>
        {trend && (
          <Trend trend={trend > 0}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </Trend>
        )}
      </Content>
    </Card>
  );
}

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${theme.shadows.md};
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${props => props.color};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${props => props.color};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  color: ${theme.colors.gray[600]};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Value = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${theme.colors.dark};
  margin: 0;
`;

const Trend = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.trend ? theme.colors.success : theme.colors.error};
  margin-top: 0.25rem;
  display: inline-block;
`;
