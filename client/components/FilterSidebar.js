// client/components/FilterSidebar.js
import theme from '../styles/theme';

export default function FilterSidebar() {
  return (
    <div
      style={{
        width: '250px',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.light,
        borderRight: `1px solid ${theme.colors.secondary}`,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <h3 style={{ marginBottom: theme.spacing.md }}>Filters</h3>
      <div>
        <h4>Price Range</h4>
        <input type="range" min="0" max="500" defaultValue="250" />
      </div>
      <div style={{ marginTop: theme.spacing.md }}>
        <h4>Categories</h4>
        <label>
          <input type="checkbox" /> Electronics
        </label>
        <br />
        <label>
          <input type="checkbox" /> Clothing
        </label>
      </div>
    </div>
  );
}
