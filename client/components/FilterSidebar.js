import { useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme'; // if inside components/ — or '../styles/theme' if in pages/

export default function FilterSidebar({ categories, filters, setFilters }) {
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? 'all' : category
    }));
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setFilters(prev => ({
      ...prev,
      priceRange: newRange
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleSearchChange = (search) => {
    setFilters(prev => ({
      ...prev,
      search
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 1000],
      sortBy: 'newest',
      search: ''
    });
    setPriceRange([0, 1000]);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h3>Filters</h3>
        <ClearButton onClick={clearFilters}>Clear All</ClearButton>
      </SidebarHeader>

      <FilterSection>
        <h4>Search</h4>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </FilterSection>

      <FilterSection>
        <h4>Categories</h4>
        <CategoryList>
          <CategoryItem
            active={filters.category === 'all'}
            onClick={() => handleCategoryChange('all')}
          >
            All Categories
          </CategoryItem>
          {categories.map(category => (
            <CategoryItem
              key={category}
              active={filters.category === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </CategoryItem>
          ))}
        </CategoryList>
      </FilterSection>

      <FilterSection>
        <h4>Price Range</h4>
        <PriceRange>
          <PriceDisplay>
            ${priceRange[0]} - ${priceRange[1]}
          </PriceDisplay>
          <RangeInput
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
          />
          <RangeLabels>
            <span>$0</span>
            <span>$1000</span>
          </RangeLabels>
        </PriceRange>
      </FilterSection>

      <FilterSection>
        <h4>Sort By</h4>
        <SortOptions>
          <SortOption
            active={filters.sortBy === 'newest'}
            onClick={() => handleSortChange('newest')}
          >
            Newest First
          </SortOption>
          <SortOption
            active={filters.sortBy === 'price-low'}
            onClick={() => handleSortChange('price-low')}
          >
            Price: Low to High
          </SortOption>
          <SortOption
            active={filters.sortBy === 'price-high'}
            onClick={() => handleSortChange('price-high')}
          >
            Price: High to Low
          </SortOption>
          <SortOption
            active={filters.sortBy === 'name'}
            onClick={() => handleSortChange('name')}
          >
            Name: A to Z
          </SortOption>
        </SortOptions>
      </FilterSection>
    </Sidebar>
  );
}

const Sidebar = styled.div`
  width: 300px;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border-radius: 12px;
  box-shadow: ${theme.shadows.md};
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    position: static;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.gray[200]};

  h3 {
    margin: 0;
    color: ${theme.colors.dark};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${theme.spacing.xl};

  h4 {
    margin: 0 0 ${theme.spacing.md} 0;
    color: ${theme.colors.dark};
    font-size: 1rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: 6px;
  font-size: 0.9rem;

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const CategoryItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: ${theme.spacing.sm};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  background-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.white : theme.colors.gray[700]};
  font-weight: ${props => props.active ? '600' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.gray[100]};
  }
`;

const PriceRange = styled.div`
  padding: ${theme.spacing.sm} 0;
`;

const PriceDisplay = styled.div`
  text-align: center;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${theme.colors.gray[300]};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.xs};
  font-size: 0.8rem;
  color: ${theme.colors.gray[600]};
`;

const SortOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SortOption = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: ${theme.spacing.sm};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  background-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.white : theme.colors.gray[700]};
  font-weight: ${props => props.active ? '600' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.gray[100]};
  }
`;
