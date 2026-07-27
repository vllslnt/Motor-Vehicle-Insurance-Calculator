import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Clock, PlusCircle } from 'lucide-react';
import { CalculatorData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import { ADDONS } from '@/lib/ojk-rates';

const coverageSchema = z.object({
  type: z.enum(['all-risk', 'tlo']),
  duration: z.number().min(1).max(5),
  addons: z.object({
    tpl: z.boolean(),
    paDriver: z.boolean(),
    paPassenger: z.boolean(),
  }),
});

type Step2Props = {
  data: CalculatorData['coverage'];
  onNext: (data: CalculatorData['coverage']) => void;
  onBack: () => void;
};

export function Step2Coverage({ data, onNext, onBack }: Step2Props) {
  const form = useForm<z.infer<typeof coverageSchema>>({
    resolver: zodResolver(coverageSchema),
    defaultValues: data,
  });

  const onSubmit = (values: z.infer<typeof coverageSchema>) => {
    onNext(values as CalculatorData['coverage']);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Pilih Pertanggungan</h2>
        <p className="text-muted-foreground">Pilih jenis perlindungan dan perluasan yang sesuai kebutuhan.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Jenis Pertanggungan */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-foreground">Jenis Perlindungan Utama</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All Risk Card */}
            <label className={cn(
              "relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all",
              form.watch('type') === 'all-risk' 
                ? "border-primary bg-primary/[0.02] shadow-sm" 
                : "border-border hover:border-primary/30"
            )}>
              <input 
                type="radio" 
                value="all-risk" 
                {...form.register('type')}
                className="absolute top-6 right-6 w-5 h-5 text-primary focus:ring-primary" 
              />
              <ShieldCheck className={cn(
                "w-10 h-10 mb-4",
                form.watch('type') === 'all-risk' ? "text-primary" : "text-muted-foreground"
              )} />
              <h3 className="font-bold text-lg mb-2 text-foreground">Komprehensif (All Risk)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Menjamin risiko kerugian secara keseluruhan, baik kerusakan sebagian (lecet, penyok) hingga kerusakan total atau kehilangan.
              </p>
            </label>

            {/* TLO Card */}
            <label className={cn(
              "relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all",
              form.watch('type') === 'tlo' 
                ? "border-primary bg-primary/[0.02] shadow-sm" 
                : "border-border hover:border-primary/30"
            )}>
              <input 
                type="radio" 
                value="tlo" 
                {...form.register('type')}
                className="absolute top-6 right-6 w-5 h-5 text-primary focus:ring-primary" 
              />
              <ShieldAlert className={cn(
                "w-10 h-10 mb-4",
                form.watch('type') === 'tlo' ? "text-primary" : "text-muted-foreground"
              )} />
              <h3 className="font-bold text-lg mb-2 text-foreground">Total Loss Only (TLO)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Menjamin risiko kerusakan di atas 75% dari harga kendaraan pada saat kejadian, atau kehilangan akibat pencurian.
              </p>
            </label>
          </div>
        </div>

        {/* Jangka Waktu */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Jangka Waktu Pertanggungan
          </label>
          <select
            {...form.register('duration', { valueAsNumber: true })}
            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
          >
            <option value={1}>1 Tahun</option>
            <option value={2}>2 Tahun</option>
            <option value={3}>3 Tahun</option>
            <option value={4}>4 Tahun</option>
            <option value={5}>5 Tahun</option>
          </select>
        </div>

        {/* Perluasan Jaminan (Add-ons) */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-foreground flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-muted-foreground" />
            Perluasan Jaminan (Opsional)
          </label>
          <div className="space-y-3">
            {([ 
              { id: 'tpl' as const, label: 'Tanggung Jawab Pihak Ketiga (TPL)', desc: 'Ganti rugi atas kerusakan harta benda atau cedera pihak ketiga.', price: ADDONS.tpl },
              { id: 'paDriver' as const, label: 'Kecelakaan Diri Pengemudi (PA)', desc: 'Santunan meninggal dunia / cacat tetap pengemudi.', price: ADDONS.paDriver },
              { id: 'paPassenger' as const, label: 'Kecelakaan Diri Penumpang (PA)', desc: 'Santunan meninggal dunia / cacat tetap penumpang.', price: ADDONS.paPassenger },
            ] as const).map((addon) => (
              <label 
                key={addon.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 cursor-pointer bg-card transition-colors"
              >
                <input 
                  type="checkbox" 
                  {...form.register(`addons.${addon.id}`)}
                  className="w-5 h-5 mt-0.5 rounded text-primary focus:ring-primary border-muted-foreground" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-foreground">{addon.label}</span>
                    <span className="font-bold text-primary">{formatRupiah(addon.price)}<span className="text-xs font-normal text-muted-foreground">/thn</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{addon.desc}</p>
                </div>
              </label>
            ))}
          </div>
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
            Lanjutkan
          </button>
        </div>
      </form>
    </motion.div>
  );
}
