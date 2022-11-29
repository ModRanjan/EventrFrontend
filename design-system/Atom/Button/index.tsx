import Link from 'next/link';
import React from 'react';
import { Spinner } from '../Spinner';

type ButtonProps = {
  bgColor?: string;
  children: React.ReactNode | string;
  customClasses?: string;
  disabled?: boolean;
  display?: string;
  link?: string;
  loading?: boolean;
  onClick?: () => void;
  padding?: string;
  rounded?: string;
  textProperties?: string;
  width?: string;
};

export const Button = ({
  bgColor,
  children,
  customClasses,
  disabled,
  display,
  link,
  loading,
  onClick,
  padding,
  rounded,
  textProperties,
  width,
}: ButtonProps) => {
  const className = [
    bgColor ? bgColor : 'bg-white',
    'border border-gray-300',
    'font-medium',
    'focus:outline-none',
    'focus:ring-2 focus:ring-offset-2 focus:ring-black',
    display ? display : 'inline-flex items-center justify-center',
    'mx-auto',
    padding ? padding : 'px-2.5 py-1.5',
    rounded ? rounded : 'rounded-md',
    'shadow-sm',
    textProperties ? textProperties : 'text-sm text-gray-700',
    width ? width : 'w-full',
    'whitespace-nowrap',
    disabled || loading ? 'disabled cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');

  return link ? (
    <Link href={link}>
      <button
        className={customClasses || className}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      className={customClasses || className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}

      {loading && <Spinner />}
    </button>
  );
};