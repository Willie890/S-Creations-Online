import styled from 'styled-components'
import Button from '../Button'

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>{product.stock}</td>
            <td>
              <Button onClick={() => onEdit(product)}>Edit</Button>
              <Button onClick={() => onDelete(product._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f5f5f5;
  }
  
  button {
    margin-right: 0.5rem;
  }
`
