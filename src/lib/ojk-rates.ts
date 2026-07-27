/**
 * OJK Motor Vehicle Insurance Premium Rates
 *
 * Source: Surat Edaran Otoritas Jasa Keuangan Nomor 6/SEOJK.05/2017
 * (SE OJK No. 6/SEOJK.05/2017) tentang Penetapan Tarif Premi dan
 * Kontribusi pada Lini Usaha Asuransi Kendaraan Bermotor.
 *
 * This module exports all regulated rate tables and the calculatePremium()
 * function used by Step 4 of the insurance calculator.
 */

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Coverage type: Komprehensif (All Risk) or Total Loss Only */
export type CoverageType = 'all-risk' | 'tlo';

/** OJK vehicle region (Wilayah) as defined in SE OJK No. 6/SEOJK.05/2017 */
export type Region = 1 | 2 | 3;

/**
 * Vehicle type categories used to select the correct OJK rate table.
 * - non-commercial: Kendaraan Bermotor Roda 4 Bukan Bus, Minibus, dan Truk (passenger cars)
 * - bus:            Kendaraan Bermotor Bus / Minibus
 * - truck:          Kendaraan Bermotor Truk / Pick-up
 * - heavy:          Kendaraan Bermotor Roda 6 atau lebih (heavy/multi-axle)
 */
export type VehicleType = 'non-commercial' | 'bus' | 'truck' | 'heavy';

/** OJK price category ID (1–5) based on Total Sum Insured */
export type CategoryId = 1 | 2 | 3 | 4 | 5;

/**
 * Rate table shape: category → region → [minRate%, maxRate%] per year.
 * For vehicle types where rates do not vary by region, all three region
 * entries carry the same tuple.
 */
type RateTable = Record<CategoryId, Record<Region, [number, number]>>;

// ---------------------------------------------------------------------------
// Price categories (Kategori Harga Pertanggungan)
// ---------------------------------------------------------------------------

/**
 * TSI thresholds (in IDR) that determine which OJK rate category applies.
 * Category 5 has no upper bound (max: Infinity).
 */
export const CATEGORIES: { id: CategoryId; min: number; max: number; label: string }[] = [
  { id: 1, min: 0,           max: 125_000_000, label: 'Kategori 1 (≤ Rp 125 juta)' },
  { id: 2, min: 125_000_001, max: 200_000_000, label: 'Kategori 2 (Rp 125 – 200 juta)' },
  { id: 3, min: 200_000_001, max: 400_000_000, label: 'Kategori 3 (Rp 200 – 400 juta)' },
  { id: 4, min: 400_000_001, max: 800_000_000, label: 'Kategori 4 (Rp 400 – 800 juta)' },
  { id: 5, min: 800_000_001, max: Infinity,    label: 'Kategori 5 (> Rp 800 juta)' },
];

// ---------------------------------------------------------------------------
// Rate tables — Roda 4 Bukan Bus, Minibus, dan Truk (Passenger Cars)
// Source: Lampiran SE OJK No. 6/SEOJK.05/2017, Tabel I
// Rates vary by region for this vehicle class.
// ---------------------------------------------------------------------------

/** All Risk — passenger cars */
export const ALL_RISK_RATES_PASSENGER: RateTable = {
  1: { 1: [3.82, 4.20], 2: [3.26, 3.59], 3: [2.53, 2.78] },
  2: { 1: [2.67, 2.94], 2: [2.47, 2.72], 3: [2.69, 2.96] },
  3: { 1: [2.18, 2.40], 2: [2.08, 2.29], 3: [1.79, 1.97] },
  4: { 1: [1.20, 1.32], 2: [1.20, 1.32], 3: [1.14, 1.25] },
  5: { 1: [1.05, 1.16], 2: [1.05, 1.16], 3: [1.05, 1.16] },
};

/** TLO — passenger cars */
export const TLO_RATES_PASSENGER: RateTable = {
  1: { 1: [0.47, 0.56], 2: [0.63, 0.69], 3: [0.53, 0.58] },
  2: { 1: [0.63, 0.69], 2: [0.44, 0.53], 3: [0.43, 0.47] },
  3: { 1: [0.41, 0.46], 2: [0.38, 0.42], 3: [0.30, 0.34] },
  4: { 1: [0.25, 0.30], 2: [0.25, 0.30], 3: [0.23, 0.27] },
  5: { 1: [0.20, 0.24], 2: [0.20, 0.24], 3: [0.20, 0.24] },
};

// ---------------------------------------------------------------------------
// Rate tables — Bus / Minibus
// Source: Lampiran SE OJK No. 6/SEOJK.05/2017, Tabel II
// Rates are uniform across all regions for this vehicle class.
// ---------------------------------------------------------------------------

/** All Risk — bus / minibus */
export const ALL_RISK_RATES_BUS: RateTable = {
  1: { 1: [2.31, 2.54], 2: [2.31, 2.54], 3: [2.31, 2.54] },
  2: { 1: [2.00, 2.20], 2: [2.00, 2.20], 3: [2.00, 2.20] },
  3: { 1: [1.56, 1.72], 2: [1.56, 1.72], 3: [1.56, 1.72] },
  4: { 1: [1.05, 1.16], 2: [1.05, 1.16], 3: [1.05, 1.16] },
  5: { 1: [0.77, 0.85], 2: [0.77, 0.85], 3: [0.77, 0.85] },
};

/** TLO — bus / minibus */
export const TLO_RATES_BUS: RateTable = {
  1: { 1: [0.42, 0.49], 2: [0.42, 0.49], 3: [0.42, 0.49] },
  2: { 1: [0.47, 0.56], 2: [0.47, 0.56], 3: [0.47, 0.56] },
  3: { 1: [0.38, 0.42], 2: [0.38, 0.42], 3: [0.38, 0.42] },
  4: { 1: [0.22, 0.26], 2: [0.22, 0.26], 3: [0.22, 0.26] },
  5: { 1: [0.18, 0.20], 2: [0.18, 0.20], 3: [0.18, 0.20] },
};

// ---------------------------------------------------------------------------
// Rate tables — Truk / Pick-up
// Source: Lampiran SE OJK No. 6/SEOJK.05/2017, Tabel III
// ---------------------------------------------------------------------------

/** All Risk — truck / pick-up */
export const ALL_RISK_RATES_TRUCK: RateTable = {
  1: { 1: [2.08, 2.29], 2: [2.08, 2.29], 3: [2.08, 2.29] },
  2: { 1: [1.56, 1.72], 2: [1.56, 1.72], 3: [1.56, 1.72] },
  3: { 1: [1.28, 1.41], 2: [1.28, 1.41], 3: [1.28, 1.41] },
  4: { 1: [1.05, 1.16], 2: [1.05, 1.16], 3: [1.05, 1.16] },
  5: { 1: [0.85, 0.94], 2: [0.85, 0.94], 3: [0.85, 0.94] },
};

/** TLO — truck / pick-up */
export const TLO_RATES_TRUCK: RateTable = {
  1: { 1: [0.38, 0.42], 2: [0.38, 0.42], 3: [0.38, 0.42] },
  2: { 1: [0.38, 0.42], 2: [0.38, 0.42], 3: [0.38, 0.42] },
  3: { 1: [0.33, 0.37], 2: [0.33, 0.37], 3: [0.33, 0.37] },
  4: { 1: [0.20, 0.22], 2: [0.20, 0.22], 3: [0.20, 0.22] },
  5: { 1: [0.17, 0.19], 2: [0.17, 0.19], 3: [0.17, 0.19] },
};

// ---------------------------------------------------------------------------
// Rate tables — Kendaraan Bermotor Roda 6 atau lebih (Heavy / Multi-axle)
// Source: Lampiran SE OJK No. 6/SEOJK.05/2017, Tabel IV
// ---------------------------------------------------------------------------

/** All Risk — heavy / multi-axle (roda 6+) */
export const ALL_RISK_RATES_HEAVY: RateTable = {
  1: { 1: [1.96, 2.16], 2: [1.96, 2.16], 3: [1.96, 2.16] },
  2: { 1: [1.64, 1.80], 2: [1.64, 1.80], 3: [1.64, 1.80] },
  3: { 1: [1.28, 1.41], 2: [1.28, 1.41], 3: [1.28, 1.41] },
  4: { 1: [1.05, 1.16], 2: [1.05, 1.16], 3: [1.05, 1.16] },
  5: { 1: [0.77, 0.85], 2: [0.77, 0.85], 3: [0.77, 0.85] },
};

/** TLO — heavy / multi-axle (roda 6+) */
export const TLO_RATES_HEAVY: RateTable = {
  1: { 1: [0.30, 0.34], 2: [0.30, 0.34], 3: [0.30, 0.34] },
  2: { 1: [0.30, 0.34], 2: [0.30, 0.34], 3: [0.30, 0.34] },
  3: { 1: [0.27, 0.30], 2: [0.27, 0.30], 3: [0.27, 0.30] },
  4: { 1: [0.18, 0.20], 2: [0.18, 0.20], 3: [0.18, 0.20] },
  5: { 1: [0.15, 0.17], 2: [0.15, 0.17], 3: [0.15, 0.17] },
};

// ---------------------------------------------------------------------------
// Optional add-on flat premiums (per year, in IDR)
// ---------------------------------------------------------------------------

/**
 * Flat annual add-on premiums (Perluasan Jaminan) in IDR.
 * These are indicative market rates; actual amounts may differ by insurer.
 */
export const ADDONS = {
  /** Tanggung Jawab Pihak Ketiga / Third Party Liability */
  tpl: 75_000,
  /** Kecelakaan Diri Pengemudi / Personal Accident – Driver */
  paDriver: 50_000,
  /** Kecelakaan Diri Penumpang / Personal Accident – Passenger */
  paPassenger: 150_000,
} as const;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the correct pair of [allRisk, tlo] rate tables for a given vehicle type.
 */
function getRateTables(vehicleType: VehicleType): { allRisk: RateTable; tlo: RateTable } {
  switch (vehicleType) {
    case 'bus':   return { allRisk: ALL_RISK_RATES_BUS,   tlo: TLO_RATES_BUS };
    case 'truck': return { allRisk: ALL_RISK_RATES_TRUCK, tlo: TLO_RATES_TRUCK };
    case 'heavy': return { allRisk: ALL_RISK_RATES_HEAVY, tlo: TLO_RATES_HEAVY };
    case 'non-commercial':
    default:      return { allRisk: ALL_RISK_RATES_PASSENGER, tlo: TLO_RATES_PASSENGER };
  }
}

/**
 * Determines the OJK price category (1–5) from the Total Sum Insured.
 *
 * @param tsi - Total Sum Insured / Harga Pertanggungan in IDR
 * @returns Category ID 1–5 per SE OJK No. 6/SEOJK.05/2017
 */
export function getCategory(tsi: number): CategoryId {
  for (const cat of CATEGORIES) {
    if (tsi >= cat.min && tsi <= cat.max) return cat.id;
  }
  return 5; // fallback for values above Rp 800 juta
}

/**
 * Returns the human-readable label for a vehicle type.
 */
export function getVehicleTypeLabel(type: VehicleType): string {
  switch (type) {
    case 'bus':   return 'Bus / Minibus';
    case 'truck': return 'Truk / Pick-up';
    case 'heavy': return 'Kendaraan Roda 6+';
    case 'non-commercial':
    default:      return 'Roda 4 (Non-Bus/Truk)';
  }
}

// ---------------------------------------------------------------------------
// Premium calculation result
// ---------------------------------------------------------------------------

export interface PremiumResult {
  /** OJK price category 1–5 determined from TSI */
  category: CategoryId;
  /** Minimum applicable annual rate (%) per OJK regulation */
  minRate: number;
  /** Maximum applicable annual rate (%) per OJK regulation */
  maxRate: number;
  /** Minimum base premium for the full policy duration, excluding add-ons (IDR) */
  baseMin: number;
  /** Maximum base premium for the full policy duration, excluding add-ons (IDR) */
  baseMax: number;
  /** Total add-on premium cost for the full policy duration (IDR) */
  addonTotal: number;
  /** Annual add-on premium cost (IDR) */
  annualAddon: number;
  /** Minimum annual base premium, excluding add-ons (IDR) */
  annualBaseMin: number;
  /** Maximum annual base premium, excluding add-ons (IDR) */
  annualBaseMax: number;
  /** Minimum all-in annual premium including add-ons (IDR) */
  annualTotalMin: number;
  /** Maximum all-in annual premium including add-ons (IDR) */
  annualTotalMax: number;
  /** Minimum total premium for full policy duration including all add-ons (IDR) */
  totalMin: number;
  /** Maximum total premium for full policy duration including all add-ons (IDR) */
  totalMax: number;
}

// ---------------------------------------------------------------------------
// Main calculation function
// ---------------------------------------------------------------------------

/**
 * Calculates the motor vehicle insurance premium using OJK regulated tariff rates.
 *
 * Formula (per year): Premium = (rate% / 100) × TSI
 * Formula (total):    Premium = annual × duration
 *
 * @param tsi          - Total Sum Insured / Harga Pertanggungan (IDR)
 * @param coverage     - 'all-risk' (Komprehensif) or 'tlo' (Total Loss Only)
 * @param vehicleType  - Vehicle class that selects the applicable OJK rate table
 * @param region       - OJK region code: 1, 2, or 3
 * @param duration     - Policy duration in years (1–5)
 * @param addons       - Selected optional add-on coverages
 * @returns            - Full premium breakdown with min/max ranges for annual and total periods
 */
export function calculatePremium(
  tsi: number,
  coverage: CoverageType,
  vehicleType: VehicleType,
  region: Region,
  duration: number,
  addons: { tpl: boolean; paDriver: boolean; paPassenger: boolean },
): PremiumResult {
  const category = getCategory(tsi);
  const { allRisk, tlo } = getRateTables(vehicleType);
  const rates = coverage === 'all-risk' ? allRisk : tlo;
  const [minRate, maxRate] = rates[category][region];

  // Annual base premiums (before add-ons, before duration multiplier)
  const annualBaseMin = (minRate / 100) * tsi;
  const annualBaseMax = (maxRate / 100) * tsi;

  // Full-duration base premiums
  const baseMin = annualBaseMin * duration;
  const baseMax = annualBaseMax * duration;

  // Add-on cost per year
  const annualAddon =
    (addons.tpl ? ADDONS.tpl : 0) +
    (addons.paDriver ? ADDONS.paDriver : 0) +
    (addons.paPassenger ? ADDONS.paPassenger : 0);

  // Full-duration add-on total
  const addonTotal = annualAddon * duration;

  return {
    category,
    minRate,
    maxRate,
    baseMin,
    baseMax,
    addonTotal,
    annualAddon,
    annualBaseMin,
    annualBaseMax,
    annualTotalMin: annualBaseMin + annualAddon,
    annualTotalMax: annualBaseMax + annualAddon,
    totalMin: baseMin + addonTotal,
    totalMax: baseMax + addonTotal,
  };
}
