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
  }

  type FormInputProps = {
    id: string;
    label: string;
    type: string;
    handleFormChange: (
      e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ) => void;
    required: boolean;
    value: string;
    profile?: boolean;
  };

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
