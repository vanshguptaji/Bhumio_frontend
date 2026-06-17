import React from 'react';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
  ...props
}) => {
  const styles = {
    info: 'bg-blue-50 border-l-4 border-blue-400 text-blue-700',
    success: 'bg-green-50 border-l-4 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700',
    danger: 'bg-red-50 border-l-4 border-red-400 text-red-700',
  };

  return (
    <div className={clsx('p-4 rounded', styles[type], className)} {...props}>
      <div className="flex">
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="text-sm mt-1">{message}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current opacity-50 hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
