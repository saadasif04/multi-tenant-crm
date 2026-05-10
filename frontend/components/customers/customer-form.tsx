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
  onSubmit: (data: FormData) => void;
};

export function CustomerForm({ defaultValues, onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input placeholder="Name" {...register('name')} />
      <Input placeholder="Email" {...register('email')} />
      <Input placeholder="Phone" {...register('phone')} />

      <Button type="submit">Save</Button>
    </form>
  );
}