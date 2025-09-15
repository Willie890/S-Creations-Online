// client/components/common/Button.js
'use client';

import React from 'react';

const Button = React.forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
      size = 'md',        // 'sm' | 'md' | 'lg'
      fullWidth = false,
      disabled = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

    // Variant classes
    const variantClasses = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-400',
      secondary:
        'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-400',
      outline:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-400',
      success:
        'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-400',
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Full width
    const widthClass = fullWidth ? 'w-full' : '';

    // Disabled
    const disabledClass = disabled ? 'cursor-not-allowed opacity-70' : '';

    const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        className={finalClassName}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
