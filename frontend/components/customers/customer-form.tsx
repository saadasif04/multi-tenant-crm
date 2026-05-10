'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FormData = {
  name: string;
  email: string;
  phone?: string;
};

type Props = {
  defaultValues?: FormData;
  onSubmit: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
};

export function CustomerForm({
  defaultValues,
  onSubmit,
  loading = false,
  error = null,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const submitHandler = async (data: FormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4"
    >
      {/* NAME */}
      <div className="space-y-1">
        <Input
          placeholder="Full name"
          {...register('name', {
            required: 'Name is required',
          })}
          disabled={loading}
        />
        {errors.name && (
          <p className="text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <Input
          placeholder="Email address"
          {...register('email', {
            required: 'Email is required',
          })}
          disabled={loading}
        />
        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PHONE */}
      <div className="space-y-1">
        <Input
          placeholder="Phone (optional)"
          {...register('phone')}
          disabled={loading}
        />
      </div>

      {/* GLOBAL ERROR */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* BUTTON */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Customer'}
      </Button>
    </form>
  );
}