import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, RotateCcw, ShieldCheck, Calendar, Car, User } from 'lucide-react';
import { CalculatorData } from '@/lib/types';
import { formatRupiah } from '@/lib/format';
import { calculatePremium, getVehicleTypeLabel, ADDONS } from '@/lib/ojk-rates';
import { toast } from '@/hooks/use-toast';

type Step5Props = {
  data: CalculatorData;
  onReset: () => void;
};

/**
 * Adds N calendar years to a date, correctly handling leap years.
 * e.g. addYears(new Date('2024-02-29'), 1) → 2025-02-28
 */
function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/** Formats a Date as a full Indonesian locale string, e.g. "1 Januari 2026" */
function formatDateId(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const ADDON_LABELS: { key: 'tpl' | 'paDriver' | 'paPassenger'; label: string }[] = [
  { key: 'tpl',         label: 'Tanggung Jawab Pihak Ketiga (TPL)' },
  { key: 'paDriver',    label: 'Kecelakaan Diri Pengemudi (PA)' },
  { key: 'paPassenger', label: 'Kecelakaan Diri Penumpang (PA)' },
];

export function Step5PolicyIssuance({ data, onReset }: Step5Props) {
  const [policyNumber, setPolicyNumber] = useState('');

  useEffect(() => {
    // Generate a deterministic-looking mock policy number on mount
    const year = new Date().getFullYear();
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    setPolicyNumber(`POL-${year}-${suffix}`);
  }, []);

  const result = calculatePremium(
    data.vehicle.tsi,
    data.coverage.type,
    data.vehicle.type,
    data.vehicle.region,
    data.coverage.duration,
    data.coverage.addons,
  );

  const startDate = data.policyholder.startDate;
  const endDate   = addYears(startDate, data.coverage.duration);
  const isMultiYear = data.coverage.duration > 1;

  const selectedAddons = ADDON_LABELS.filter(({ key }) => data.coverage.addons[key]);

  const handleDownload = () => {
    toast({
      title: 'Fitur segera hadir',
      description: 'Unduhan dokumen polis PDF akan tersedia pada versi berikutnya.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Polis Diterbitkan!</h2>
        <p className="text-muted-foreground leading-relaxed">
          Pengajuan Anda telah diproses. Dokumen polis resmi akan dikirimkan ke{' '}
          <strong className="text-foreground">{data.policyholder.email}</strong>{' '}
          dalam 1×24 jam kerja.
        </p>
      </div>

      {/* Policy card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-6">

        {/* Card header */}
        <div className="bg-primary/5 px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Ringkasan Polis</span>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Aktif
          </span>
        </div>

        {/* Policy number + status */}
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Nomor Polis</div>
            <div className="font-mono font-bold text-lg tracking-wider text-primary">
              {policyNumber}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Diterbitkan:{' '}
            <span className="font-medium text-foreground">
              {formatDateId(new Date())}
            </span>
          </div>
        </div>

        {/* Grid details */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Pemegang Polis */}
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Pemegang Polis
            </div>
            <div className="font-semibold text-foreground">{data.policyholder.name}</div>
            <div className="text-sm text-muted-foreground">{data.policyholder.phone}</div>
          </div>

          {/* Kendaraan */}
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" /> Kendaraan
            </div>
            <div className="font-semibold text-foreground">
              {data.vehicle.brand} ({data.vehicle.year})
            </div>
            <div className="text-sm text-muted-foreground">
              {getVehicleTypeLabel(data.vehicle.type)} · Wilayah {data.vehicle.region}
            </div>
          </div>

          {/* Jenis Pertanggungan */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Jenis Pertanggungan</div>
            <div className="font-semibold text-foreground">
              {data.coverage.type === 'all-risk'
                ? 'Komprehensif (All Risk)'
                : 'Total Loss Only (TLO)'}
            </div>
            {selectedAddons.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {selectedAddons.map(({ key, label }) => (
                  <li key={key} className="text-xs text-muted-foreground">
                    + {label} — {formatRupiah(ADDONS[key])}/thn
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Nilai Pertanggungan */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Nilai Pertanggungan (TSI)</div>
            <div className="font-semibold text-primary text-lg">
              {formatRupiah(data.vehicle.tsi)}
            </div>
          </div>

          {/* Masa Berlaku */}
          <div className="sm:col-span-2">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Masa Berlaku Polis
            </div>
            <div className="font-semibold text-foreground">
              {formatDateId(startDate)}{' '}
              <span className="text-muted-foreground font-normal">s.d.</span>{' '}
              {formatDateId(endDate)}
            </div>
            <div className="text-sm text-muted-foreground">
              {data.coverage.duration} tahun
            </div>
          </div>

        </div>

        {/* Footer: premium summary */}
        <div className="border-t border-border px-5 py-4 space-y-2">
          {/* Annual premium */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Estimasi Premi Per Tahun</span>
            <span className="font-semibold tabular-nums">
              {formatRupiah(result.annualTotalMin)} – {formatRupiah(result.annualTotalMax)}
            </span>
          </div>
          {/* Total premium (only shown when duration > 1 year) */}
          {isMultiYear && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-medium">
                Total Estimasi Premi ({data.coverage.duration} Tahun)
              </span>
              <span className="font-bold tabular-nums text-primary">
                {formatRupiah(result.totalMin)} – {formatRupiah(result.totalMax)}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleDownload}
          data-testid="button-download-policy"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-12 px-6 gap-2 border border-border"
        >
          <Download className="w-4 h-4" /> Unduh Polis (PDF)
        </button>
        <button
          onClick={onReset}
          data-testid="button-new-calculation"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 gap-2 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Mulai Kalkulator Baru
        </button>
      </div>

    </motion.div>
  );
}
