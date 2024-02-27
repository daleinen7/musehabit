import React from 'react';
import Link from 'next/link';
import link from 'next/link';
import { type } from 'os';
import { text } from 'stream/consumers';

type ButtonProps = {
  link?: string;
  text: string;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
  large?: boolean;
  secondary?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  link,
  text,
  onClick,
  type,
  large,
  secondary,
}) => {
  const buttonClass = `inline-flex cursor-pointer text-center items-center justify-center rounded-[3px] border-2 px-3 focus-visible:text-color-100 focus-visible:bg-color-600 active:bg-color-600 active:text-color-100 w-fit
  ${
    large
      ? 'py-5 large-button min-w-[18.75rem] sm:min-w-0 sm:w-full'
      : 'py-[0.25rem]'
  }
  ${
    secondary
      ? 'bg-white text-color border-color hover:text-color hover:bg-color-200 hover:border-color focus-visible:border-color-200'
      : 'bg-color-400 text-white border-color-400 hover:text-color hover:bg-color-100 hover:border-color-100 focus-visible:border-color-100'
  }
  `;

  return (
    <>
      {link ? (
        link[0] !== '/' ? (
          <a href={link} className={buttonClass}>
            {text}
          </a>
        ) : (
          <Link href={link} className={buttonClass}>
            {text}
          </Link>
        )
      ) : (
        <button onClick={onClick} type={type} className={buttonClass}>
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
