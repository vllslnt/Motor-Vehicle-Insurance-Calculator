import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, CalendarDays, CreditCard } from 'lucide-react';
import { CalculatorData } from '@/lib/types';
import { cn } from '@/lib/utils';

const policyholderSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  ktp: z.string().length(16, { message: 'Nomor KTP harus tepat 16 digit angka' }).regex(/^\d+$/, { message: 'Hanya boleh berisi angka' }),
  phone: z.string().min(10, { message: 'Nomor telepon tidak valid' }).regex(/^\d+$/, { message: 'Hanya boleh berisi angka' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  address: z.string().min(10, { message: 'Alamat lengkap harus diisi (min 10 karakter)' }),
  startDate: z.string().min(1, { message: 'Tanggal mulai harus diisi' }),
});

type Step3Props = {
  data: CalculatorData['policyholder'];
  onNext: (data: CalculatorData['policyholder']) => void;
  onBack: () => void;
};

export function Step3PolicyholderData({ data, onNext, onBack }: Step3Props) {
  // Format Date to YYYY-MM-DD for input type="date"
  const defaultDate = data.startDate instanceof Date 
    ? data.startDate.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const form = useForm<z.infer<typeof policyholderSchema>>({
    resolver: zodResolver(policyholderSchema),
    defaultValues: {
      ...data,
      startDate: defaultDate,
    },
  });

  const onSubmit = (values: z.infer<typeof policyholderSchema>) => {
    onNext({
      ...values,
      startDate: new Date(values.startDate),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Data Pemegang Polis</h2>
        <p className="text-muted-foreground">Informasi pribadi sesuai kartu identitas yang berlaku.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Nama Lengkap (Sesuai KTP)
            </label>
            <input 
              {...form.register('name')}
              className={cn(
                "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors",
                form.formState.errors.name && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          {/* Nomor KTP */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Nomor KTP (NIK)
            </label>
            <input 
              {...form.register('ktp')}
              maxLength={16}
              className={cn(
                "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors",
                form.formState.errors.ktp && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {form.formState.errors.ktp && <p className="text-xs text-destructive">{form.formState.errors.ktp.message}</p>}
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Nomor WhatsApp / HP
            </label>
            <input 
              {...form.register('phone')}
              placeholder="0812..."
              className={cn(
                "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors",
                form.formState.errors.phone && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Alamat Email
            </label>
            <input 
              type="email"
              {...form.register('email')}
              className={cn(
                "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors",
                form.formState.errors.email && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Alamat Lengkap
          </label>
          <textarea 
            {...form.register('address')}
            rows={3}
            className={cn(
              "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors resize-none",
              form.formState.errors.address && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {form.formState.errors.address && <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>}
        </div>

        {/* Tanggal Mulai */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            Tanggal Mulai Pertanggungan
          </label>
          <input 
            type="date"
            {...form.register('startDate')}
            className={cn(
              "flex h-11 w-full md:w-1/2 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors",
              form.formState.errors.startDate && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {form.formState.errors.startDate && <p className="text-xs text-destructive">{form.formState.errors.startDate.message}</p>}
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground h-11 px-8"
          >
            Kembali
          </button>
          <button 
            type="submit"
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Kalkulasi Premi
          </button>
        </div>
      </form>
    </motion.div>
  );
}
