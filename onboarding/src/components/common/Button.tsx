import React from 'react';

interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps<T extends React.ElementType> = ButtonBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonBaseProps | 'as'>;

const Button = <T extends React.ElementType = 'button'>(
  props: ButtonProps<T>
) => {
  const {
    as,
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    className: outerClassName,
    ...rest
  } = props;

  const Component = as || 'button';

  const variantClasses = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-600',
    secondary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600 dark:focus:ring-teal-600',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-600',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 ease-in-out
    flex items-center justify-center
    ${isLoading || (rest as any).disabled ? 'opacity-70 cursor-not-allowed' : ''}
    ${outerClassName || ''}
  `;

  const isButton = Component === 'button';
  const disabledProp = isButton
    ? { disabled: (rest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading }
    : {};

  return (
    <Component className={combinedClassName} {...rest} {...disabledProp}>
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Component>
  );
};

Button.displayName = 'Button';

export default Button;
