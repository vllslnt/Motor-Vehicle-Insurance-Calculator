import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Info, FileText, CheckCircle2, ChevronRight, Car } from 'lucide-react';
import { CalculatorData } from '@/lib/types';
import { formatRupiah } from '@/lib/format';
import { calculatePremium, getVehicleTypeLabel, ADDONS } from '@/lib/ojk-rates';

type Step4Props = {
  data: CalculatorData;
  onNext: () => void;
  onBack: () => void;
};

const REGION_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Wilayah 1 — Banten, DKI Jakarta, Jawa Barat, Jawa Tengah',
  2: 'Wilayah 2 — Jawa Timur, Bali, Nusa Tenggara Barat',
  3: 'Wilayah 3 — Luar Wilayah 1 dan 2',
};

export function Step4PremiumCalc({ data, onNext, onBack }: Step4Props) {
  const result = useMemo(() => {
    return calculatePremium(
      data.vehicle.tsi,
      data.coverage.type,
      data.vehicle.type,
      data.vehicle.region,
      data.coverage.duration,
      data.coverage.addons,
    );
  }, [data]);

  const isMultiYear = data.coverage.duration > 1;
  const coverageLabel = data.coverage.type === 'all-risk'
    ? 'Komprehensif (All Risk)'
    : 'Total Loss Only (TLO)';

  const hasAddons =
    data.coverage.addons.tpl ||
    data.coverage.addons.paDriver ||
    data.coverage.addons.paPassenger;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Kalkulasi Premi</h2>
        <p className="text-muted-foreground">
          Estimasi premi berdasarkan regulasi Otoritas Jasa Keuangan.
        </p>
      </div>

      <div className="space-y-6">

        {/* OJK Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-1">
              SE OJK No. 6/SEOJK.05/2017 — {coverageLabel}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Berdasarkan harga pertanggungan yang diinput, kendaraan masuk ke dalam{' '}
              <strong>Kategori {result.category}</strong>. OJK menetapkan tarif {coverageLabel} untuk
              Kategori {result.category} di{' '}
              <strong>Wilayah {data.vehicle.region}</strong> antara{' '}
              <strong>
                {result.minRate}% – {result.maxRate}%
              </strong>{' '}
              per tahun.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h5 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Car className="w-4 h-4" /> Data Kendaraan
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Merek & Model</span>
                <span className="font-medium text-right">{data.vehicle.brand} ({data.vehicle.year})</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Jenis</span>
                <span className="font-medium text-right">{getVehicleTypeLabel(data.vehicle.type)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Wilayah</span>
                <span className="font-medium text-right">Wilayah {data.vehicle.region}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Harga Pertanggungan (TSI)</span>
                <span className="font-semibold text-primary text-right">{formatRupiah(data.vehicle.tsi)}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h5 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Pertanggungan
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Jenis Perlindungan</span>
                <span className="font-medium text-right">{coverageLabel}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Jangka Waktu</span>
                <span className="font-medium">{data.coverage.duration} Tahun</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Mulai Polis</span>
                <span className="font-medium">
                  {data.policyholder.startDate.toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Kategori OJK</span>
                <span className="font-medium">Kategori {result.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Region note for vehicle types without region-varying rates */}
        {data.vehicle.type !== 'non-commercial' && (
          <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">
            <strong>Catatan:</strong> Tarif OJK untuk {getVehicleTypeLabel(data.vehicle.type)} berlaku
            seragam di semua wilayah Indonesia (tidak berbeda per wilayah).
          </div>
        )}

        {/* Detail Calculation Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/30">
            <h3 className="font-bold text-lg">Rincian Kalkulasi Premi</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {REGION_LABELS[data.vehicle.region]}
            </p>
          </div>

          <div className="p-5 space-y-5">

            {/* Annual base premium */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-foreground">
                Premi Dasar Per Tahun
              </h4>
              <div className="space-y-2 text-sm pl-4 border-l-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Tarif Minimum ({result.minRate}%) × TSI
                  </span>
                  <span className="font-medium tabular-nums">{formatRupiah(result.annualBaseMin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Tarif Maksimum ({result.maxRate}%) × TSI
                  </span>
                  <span className="font-medium tabular-nums">{formatRupiah(result.annualBaseMax)}</span>
                </div>
              </div>
            </div>

            {/* Addons */}
            {hasAddons && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">
                  Perluasan Jaminan Per Tahun
                </h4>
                <div className="space-y-2 text-sm pl-4 border-l-2 border-primary/20">
                  {data.coverage.addons.tpl && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tanggung Jawab Pihak Ketiga (TPL)</span>
                      <span className="font-medium tabular-nums">{formatRupiah(ADDONS.tpl)}</span>
                    </div>
                  )}
                  {data.coverage.addons.paDriver && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kecelakaan Diri Pengemudi (PA)</span>
                      <span className="font-medium tabular-nums">{formatRupiah(ADDONS.paDriver)}</span>
                    </div>
                  )}
                  {data.coverage.addons.paPassenger && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kecelakaan Diri Penumpang (PA)</span>
                      <span className="font-medium tabular-nums">{formatRupiah(ADDONS.paPassenger)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Annual total */}
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Total Estimasi Premi Per Tahun</span>
                <span className="font-bold tabular-nums">
                  {formatRupiah(result.annualTotalMin)}
                  {' '}<span className="text-muted-foreground font-normal">–</span>{' '}
                  {formatRupiah(result.annualTotalMax)}
                </span>
              </div>
            </div>

            {/* Multi-year total */}
            {isMultiYear && (
              <>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">
                    Total untuk {data.coverage.duration} Tahun
                  </h4>
                  <div className="space-y-2 text-sm pl-4 border-l-2 border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Premi Dasar ({data.coverage.duration} × Premi Tahunan Min)
                      </span>
                      <span className="font-medium tabular-nums">{formatRupiah(result.baseMin)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Premi Dasar ({data.coverage.duration} × Premi Tahunan Maks)
                      </span>
                      <span className="font-medium tabular-nums">{formatRupiah(result.baseMax)}</span>
                    </div>
                    {hasAddons && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Perluasan Jaminan ({data.coverage.duration} Tahun)
                        </span>
                        <span className="font-medium tabular-nums">{formatRupiah(result.addonTotal)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Grand total */}
            <div className="pt-2 border-t border-dashed border-border">
              <div className="bg-primary/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-primary/15">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {isMultiYear
                      ? `Total Estimasi Premi (${data.coverage.duration} Tahun)`
                      : 'Total Estimasi Premi'}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-primary tabular-nums">
                    {formatRupiah(result.totalMin)}
                    {' '}<span className="text-foreground/40 font-normal">–</span>{' '}
                    {formatRupiah(result.totalMax)}
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">
                    Sesuai Regulasi OJK
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          * Premi aktual akan ditentukan oleh perusahaan asuransi melalui proses underwriting, dan berada
          dalam rentang batas bawah dan batas atas yang ditetapkan OJK di atas.
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground h-11 px-8"
          >
            Kembali
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 gap-2 group shadow-sm"
          >
            Ajukan Polis <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
