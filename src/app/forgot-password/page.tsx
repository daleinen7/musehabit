'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';

const formData = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'email',
    required: true,
  },
];

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: '',
  });
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.email) {
      // Call the sendPasswordResetEmail function
      await resetPassword(form.email);
      // Inform the user that a password reset email has been sent
      setSuccess(true);
    } else {
      // Handle the case where no email is provided
      console.error('Please enter your email address to reset your password.');
    }
  };

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center mt-16">
      <div className="max-w-47rem flex flex-col justify-center items-center w-full max-w-[20.8125rem]">
        {success ? (
          <h2>
            Password Reset Sent. Check the email associated with this account.
          </h2>
        ) : (
          <div>
            <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
              Forgot Your Password?
            </h2>
            <p className="font-satoshi mb-10">
              Need an account? It happens! We&apos;ll send password reset
              instructions to your email.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center gap-6 w-full"
            >
              {formData.map((item) => (
                <FormInput
                  key={item.id}
                  label={item.label}
                  type={item.type}
                  id={item.id}
                  value={form[item.id as keyof typeof form]} // Add index signature to allow indexing with a string
                  handleFormChange={handleFormChange}
                  required={item.required}
                />
              ))}
              <button type="submit" className="btn btn-primary w-full">
                Verify Email
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
