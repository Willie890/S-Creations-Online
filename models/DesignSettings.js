const mongoose = require('mongoose');

const designSettingsSchema = new mongoose.Schema({
  // Color Scheme
  colors: {
    primary: { type: String, default: '#6a5acd' },
    secondary: { type: String, default: '#ff6b6b' },
    accent: { type: String, default: '#4ecdc4' },
    background: { type: String, default: '#ffffff' },
    surface: { type: String, default: '#f8f9fa' },
    text: { type: String, default: '#1a1a1a' },
    textSecondary: { type: String, default: '#666666' },
    border: { type: String, default: '#e0e0e0' },
    success: { type: String, default: '#10b981' },
    warning: { type: String, default: '#f59e0b' },
    error: { type: String, default: '#ef4444' }
  },
  
  // Typography
  typography: {
    headingFont: { type: String, default: 'Inter, system-ui, sans-serif' },
    bodyFont: { type: String, default: 'Inter, system-ui, sans-serif' },
    baseSize: { type: String, default: '16px' },
    scale: { type: String, default: '1.25' }, // Major third scale
    fontWeight: {
      light: { type: Number, default: 300 },
      normal: { type: Number, default: 400 },
      medium: { type: Number, default: 500 },
      semibold: { type: Number, default: 600 },
      bold: { type: Number, default: 700 }
    }
  },
  
  // Layout & Spacing
  layout: {
    maxWidth: { type: String, default: '1400px' },
    containerPadding: { type: String, default: '1rem' },
    sectionGap: { type: String, default: '6rem' },
    borderRadius: {
      sm: { type: String, default: '4px' },
      md: { type: String, default: '8px' },
      lg: { type: String, default: '12px' },
      xl: { type: String, default: '16px' },
      full: { type: String, default: '9999px' }
    }
  },
  
  // Components Visibility
  components: {
    // Header & Navigation
    showSearch: { type: Boolean, default: true },
    showCart: { type: Boolean, default: true },
    showUserMenu: { type: Boolean, default: true },
    
    // Hero Section
    heroStyle: { 
      type: String, 
      enum: ['split', 'full', 'minimal', 'creative'], 
      default: 'split' 
    },
    showHeroBadge: { type: Boolean, default: true },
    showHeroActions: { type: Boolean, default: true },
    
    // Featured Sections
    showFeaturedProducts: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
    showPromoBanners: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    
    // Product Cards
    productCardStyle: {
      type: String,
      enum: ['standard', 'minimal', 'creative', 'elegant'],
      default: 'standard'
    },
    showProductBadges: { type: Boolean, default: true },
    showProductWishlist: { type: Boolean, default: true },
    showQuickAdd: { type: Boolean, default: true },
    
    // Footer
    showNewsletter: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true }
  },
  
  // Animations & Effects
  animations: {
    level: { 
      type: String, 
      enum: ['minimal', 'standard', 'enhanced'], 
      default: 'standard' 
    },
    duration: {
      fast: { type: String, default: '0.2s' },
      standard: { type: String, default: '0.4s' },
      slow: { type: String, default: '0.6s' }
    },
    enableHoverEffects: { type: Boolean, default: true },
    enablePageTransitions: { type: Boolean, default: true },
    enableScrollAnimations: { type: Boolean, default: true }
  },
  
  // Custom CSS
  customCSS: {
    header: { type: String, default: '' },
    hero: { type: String, default: '' },
    products: { type: String, default: '' },
    footer: { type: String, default: '' },
    global: { type: String, default: '' }
  },
  
  // Business Information
  business: {
    name: { type: String, default: 'S-Creations' },
    tagline: { type: String, default: 'Where Fashion Meets Art' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    contact: {
      email: { type: String, default: 'hello@s-creations.com' },
      phone: { type: String, default: '+1 (234) 567-890' },
      address: { type: String, default: '123 Creative Street, Art District, NY 10001' }
    }
  },
  
  // Social Media
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    pinterest: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  
  // SEO & Meta
  seo: {
    title: { type: String, default: 'S-Creations - Where Fashion Meets Art' },
    description: { type: String, default: 'Discover handcrafted clothing, curated textiles, and studio-made accessories — designed for creatives who live color and craft.' },
    keywords: { type: String, default: 'fashion, art, handmade, clothing, crafts, creative' },
    ogImage: { type: String, default: '' }
  },
  
  // Maintenance Mode
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'We are currently performing maintenance. Please check back soon.' },
    allowedIPs: [{ type: String }]
  }
}, {
  timestamps: true
});

// Static method to get current design settings
designSettingsSchema.statics.getCurrent = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    await settings.save();
  }
  return settings;
};

// Method to generate CSS variables
designSettingsSchema.methods.generateCSSVariables = function() {
  return `
    :root {
      /* Colors */
      --color-primary: ${this.colors.primary};
      --color-secondary: ${this.colors.secondary};
      --color-accent: ${this.colors.accent};
      --color-background: ${this.colors.background};
      --color-surface: ${this.colors.surface};
      --color-text: ${this.colors.text};
      --color-text-secondary: ${this.colors.textSecondary};
      --color-border: ${this.colors.border};
      --color-success: ${this.colors.success};
      --color-warning: ${this.colors.warning};
      --color-error: ${this.colors.error};
      
      /* Typography */
      --font-family-heading: ${this.typography.headingFont};
      --font-family-body: ${this.typography.bodyFont};
      --font-size-base: ${this.typography.baseSize};
      
      /* Layout */
      --max-width: ${this.layout.maxWidth};
      --container-padding: ${this.layout.containerPadding};
      --section-gap: ${this.layout.sectionGap};
      
      /* Border Radius */
      --border-radius-sm: ${this.layout.borderRadius.sm};
      --border-radius-md: ${this.layout.borderRadius.md};
      --border-radius-lg: ${this.layout.borderRadius.lg};
      --border-radius-xl: ${this.layout.borderRadius.xl};
      --border-radius-full: ${this.layout.borderRadius.full};
      
      /* Animations */
      --animation-duration-fast: ${this.animations.duration.fast};
      --animation-duration-standard: ${this.animations.duration.standard};
      --animation-duration-slow: ${this.animations.duration.slow};
    }
  `;
};

module.exports = mongoose.model('DesignSettings', designSettingsSchema);
