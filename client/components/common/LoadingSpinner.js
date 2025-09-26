// client/components/common/LoadingSpinner.js
'use client';

import React from 'react';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`flex justify-center items-center ${className}`}
    >
      <div
        className={`${spinnerSize} animate-spin rounded-full border-4 border-t-transparent border-gray-300 dark:border-gray-600`}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export const SmallSpinner = () => <LoadingSpinner size="sm" />;
export const LargeSpinner = () => <LoadingSpinner size="lg" />;
