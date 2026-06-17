import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'bg-white rounded-lg shadow-md border border-gray-200 p-6',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('mt-6 pt-4 border-t border-gray-200 flex gap-2', className)} {...props}>
    {children}
  </div>
);
