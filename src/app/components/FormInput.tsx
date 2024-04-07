import React, { ChangeEvent } from 'react';

type FormInputProps = {
  id: string;
  label: string;
  type: string;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value: string;
  profile?: boolean;
  name?: string;
  error?: undefined | string;
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  handleFormChange,
  required,
  value,
  name,
  profile,
  error,
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
          className="text-white bg-medium-gray p-[0.625rem] border border-light-gray rounded-md w-full"
        />
        {error && <p className="text-coral">{error}</p>}
      </label>
    );
  } else if (type === 'file') {
    return (
      <label
        htmlFor={id}
        className="rounded border-[1px] border-light-gray px-[1rem] py-[0.625rem] text-[1.125rem] hover:bg-gray-200 cursor-pointer"
      >
        {label}
        <input
          type={type}
          id={id}
          onChange={handleFormChange}
          accept="image/*"
          className="hidden"
        />
        {error && <p className="text-coral">{error}</p>}
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
          className="text-white p-[0.625rem] border border-light-gray bg-medium-gray rounded-md w-full"
        />
        {error && <p className="text-coral">{error}</p>}
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
          className="text-white p-[0.625rem] border border-light-gray rounded-md"
        />
        {label}
      </label>
    );
  } else if (type === 'radio') {
    return (
      <label htmlFor={id} key={id} className="flex items-center gap-2">
        <input
          type={type}
          id={id}
          name={name}
          checked={value === id} // Assuming value of radio button is its ID
          onChange={handleFormChange}
          required={required}
          className="text-white p-[0.625rem] border border-light-gray rounded-md"
          value={id} // Assigning the value as the ID of the radio button
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
          className="text-white p-[0.625rem] border border-light-gray bg-medium-gray rounded-md w-full"
        />
      </label>
    );
  }
};
export default FormInput;
