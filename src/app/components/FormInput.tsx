import React, { ChangeEvent } from 'react';

type FormInputProps = {
  id: string;
  label: string;
  type: string;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value: string;
  profile?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  handleFormChange,
  required,
  value,
  profile,
}) => {
  if (type === 'text' || type === 'password' || type === 'email') {
    return (
      <label htmlFor={id} key={id} className="flex flex-col gap-2 w-full">
        {label}
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleFormChange}
          required={required}
          className="text-black p-[0.625rem] border border-black rounded-md w-full"
        />
      </label>
    );
  } else if (type === 'file') {
    return (
      <label
        htmlFor={id}
        className="rounded border-[1px] border-black px-[1rem] py-[0.625rem] text-[1.125rem] hover:bg-gray-200 cursor-pointer"
      >
        {label}
        <input
          type={type}
          id={id}
          onChange={handleFormChange}
          accept="image/*"
          className="hidden"
        />
      </label>
    );
  } else if (type === 'textarea') {
    return (
      <label htmlFor={id} key={id} className="flex flex-col gap-2 w-full">
        {label}
        <textarea
          id={id}
          value={value}
          onChange={handleFormChange as (e: React.ChangeEvent<unknown>) => void}
          required={required}
          className="text-black p-[0.625rem] border border-black rounded-md w-full"
        />
      </label>
    );
  } else if (type === 'checkbox') {
    return (
      <label htmlFor={id} key={id} className="flex items-center gap-2">
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleFormChange}
          required={required}
          className="text-black p-[0.625rem] border border-black rounded-md"
        />
        {label}
      </label>
    );
  }

  if (profile) {
    return (
      <label htmlFor={id} key={id} className="flex flex-col gap-2">
        {label}
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleFormChange}
          required={required}
          className="text-black p-[0.625rem] border border-black rounded-md w-full"
        />
      </label>
    );
  }
};
export default FormInput;
