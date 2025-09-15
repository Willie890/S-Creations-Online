import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product,
  loading 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'clothing',
    stock: 0,
    images: [''],
    featured: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || 'clothing',
        stock: product.stock || 0,
        images: product.images || [''],
        featured: product.featured || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'clothing',
        stock: 0,
        images: [''],
        featured: false
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.images.some(img => !img.trim())) {
      newErrors.images = 'All image URLs are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              {errors.name && <Error>{errors.name}</Error>}
            </FormGroup>

            <FormGroup>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="home">Home Decor</option>
                <option value="electronics">Electronics</option>
                <option value="beauty">Beauty</option>
                <option value="other">Other</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.price && <Error>{errors.price}</Error>}
            </FormGroup>

            <FormGroup>
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
              {errors.stock && <Error>{errors.stock}</Error>}
            </FormGroup>

            <FormGroup fullWidth>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product description..."
              />
              {errors.description && <Error>{errors.description}</Error>}
            </FormGroup>

            <FormGroup fullWidth>
              <label>Product Images *</label>
              {formData.images.map((image, index) => (
                <ImageInputGroup key={index}>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <RemoveButton 
                      type="button" 
                      onClick={() => removeImageField(index)}
                    >
                      Remove
                    </RemoveButton>
                  )}
                </ImageInputGroup>
              ))}
              {errors.images && <Error>{errors.images}</Error>}
              <AddImageButton type="button" onClick={addImageField}>
                + Add Another Image
              </AddImageButton>
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Product
              </CheckboxLabel>
            </FormGroup>
          </FormGrid>

          <FormActions>
            <Button type="button" secondary onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ImageInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  input {
    flex: 1;
  }
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #c82333;
  }
`;

const AddImageButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:hover {
    background: #218838;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input {
    width: auto;
    margin: 0;
  }
`;

const Error = styled.span`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
`;
