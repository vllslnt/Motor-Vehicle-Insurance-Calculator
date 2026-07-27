import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Car, MapPin, Calendar, Tag } from 'lucide-react';
import { CalculatorData } from '@/lib/types';
import { formatRupiah, parseRupiah } from '@/lib/format';
import { cn } from '@/lib/utils';

const vehicleSchema = z.object({
  brand: z.string().min(2, {
    message: "Merek & model harus diisi (min. 2 karakter)",
  }),

  year: z.string().min(4, {
    message: "Tahun harus dipilih",
  }),

  type: z.enum(["non-commercial", "bus", "truck", "heavy"], {
    error: "Jenis kendaraan harus dipilih",
  }),

  tsi: z.coerce.number().min(10_000_000, {
    message: "Harga pertanggungan minimal Rp 10.000.000",
  }),

  region: z.coerce.number().min(1, {
    message: "Wilayah harus dipilih",
  }).max(3),
});

type FormValues = z.infer<typeof vehicleSchema>;

type Step1Props = {
  data: CalculatorData['vehicle'];
  onNext: (data: CalculatorData['vehicle']) => void;
};

export function Step1VehicleInfo({ data, onNext }: Step1Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: data.brand,
      year: data.year,
      type: data.type,
      tsi: data.tsi,
      region: data.region,
    },
  });

  /**
   * tsiDisplay drives the visible text in the TSI input.
   * – Empty when tsi === 0 so the placeholder is visible.
   * – Raw number while the user is actively typing.
   * – Formatted Rupiah string after blur.
   */
  const [tsiDisplay, setTsiDisplay] = useState<string>(
    data.tsi > 0 ? formatRupiah(data.tsi) : '',
  );

  const onSubmit = (values: FormValues) => {
  console.log("SUBMITTED");
  console.log(values);

  onNext(values as CalculatorData["vehicle"]);
};

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 27 }, (_, i) => (currentYear - i).toString());

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Informasi Kendaraan</h2>
        <p className="text-muted-foreground">Lengkapi data kendaraan yang akan diasuransikan.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Merek & Tahun */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Merek & Model */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Car className="w-4 h-4 text-muted-foreground" />
              Merek & Model Kendaraan
            </label>
            <input
              {...form.register('brand')}
              placeholder="Contoh: Toyota Avanza 1.3 G"
              data-testid="input-brand"
              className={cn(
                'flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors',
                form.formState.errors.brand && 'border-destructive focus-visible:ring-destructive',
              )}
            />
            {form.formState.errors.brand && (
              <p className="text-xs text-destructive">{form.formState.errors.brand.message}</p>
            )}
          </div>

          {/* Tahun */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Tahun Kendaraan
            </label>
            <select
              {...form.register('year')}
              data-testid="select-year"
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Harga Pertanggungan (TSI) — uses Controller for proper RHF registration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            Harga Pertanggungan (Nilai Kendaraan Saat Ini)
          </label>
          <Controller
            name="tsi"
            control={form.control}
            render={({ field }) => (
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 200.000.000"
                data-testid="input-tsi"
                value={tsiDisplay}
                onFocus={() => {
                  // Show raw number while editing so the user can modify it easily.
                  // Empty string when value is 0 so placeholder is visible.
                  setTsiDisplay(field.value > 0 ? String(field.value) : '');
                }}
                onChange={(e) => {
                  const raw = parseRupiah(e.target.value);
                  setTsiDisplay(e.target.value);
                  field.onChange(raw);
                }}
                onBlur={() => {
                  field.onBlur();
                  setTsiDisplay(field.value > 0 ? formatRupiah(field.value) : '');
                }}
                className={cn(
                  'flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-lg font-semibold placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors text-primary',
                  form.formState.errors.tsi &&
                    'border-destructive text-destructive focus-visible:ring-destructive',
                )}
              />
            )}
          />
          {form.formState.errors.tsi ? (
            <p className="text-xs text-destructive">{form.formState.errors.tsi.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Masukkan nilai pasar kendaraan saat ini (tanpa titik atau koma).
            </p>
          )}
        </div>

        {/* Jenis Kendaraan */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Jenis Kendaraan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { id: 'non-commercial' as const, label: 'Roda 4 (Non-Bus/Truk)' },
                { id: 'bus'            as const, label: 'Bus / Minibus' },
                { id: 'truck'          as const, label: 'Truk / Pick-up' },
                { id: 'heavy'          as const, label: 'Roda 6+' },
              ] as const
            ).map((type) => (
              <label
                key={type.id}
                data-testid={`radio-type-${type.id}`}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all select-none',
                  form.watch('type') === type.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <input
                  type="radio"
                  value={type.id}
                  {...form.register('type')}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{type.label}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.type && (
            <p className="text-xs text-destructive">{form.formState.errors.type.message}</p>
          )}
        </div>

        {/* Wilayah */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Wilayah Plat Nomor Kendaraan
          </label>
          <div className="space-y-2">
            {[
              { id: 1, title: 'Wilayah 1', desc: 'Banten, DKI Jakarta, Jawa Barat, Jawa Tengah' },
              { id: 2, title: 'Wilayah 2', desc: 'Jawa Timur, Bali, Nusa Tenggara Barat' },
              { id: 3, title: 'Wilayah 3', desc: 'Luar Wilayah 1 dan 2' },
            ].map((region) => (
              <label
                key={region.id}
                data-testid={`radio-region-${region.id}`}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all select-none',
                  form.watch('region') === region.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <input
                  type="radio"
                  checked={form.watch("region") === region.id}
                  onChange={() => form.setValue("region", region.id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })}
                />
                <div>
                  <div className="text-sm font-semibold">{region.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{region.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            data-testid="button-next-step1"
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Lanjutkan ke Pertanggungan
          </button>
        </div>

      </form>
    </motion.div>
  );
}
