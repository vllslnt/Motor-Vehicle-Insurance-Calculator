import { VehicleType } from './ojk-rates';

export type { VehicleType };

export type CalculatorData = {
  vehicle: {
    brand: string;
    year: string;
    /** Vehicle class used to select the correct OJK rate table */
    type: VehicleType;
    /** Total Sum Insured / Harga Pertanggungan in IDR */
    tsi: number;
    /** OJK region code: 1 (Jabodetabek area), 2 (East Java/Bali/NTB), 3 (Other) */
    region: 1 | 2 | 3;
  };
  coverage: {
    type: 'all-risk' | 'tlo';
    /** Policy duration in years (1–5) */
    duration: number;
    addons: {
      tpl: boolean;
      paDriver: boolean;
      paPassenger: boolean;
    };
  };
  policyholder: {
    name: string;
    ktp: string;
    phone: string;
    email: string;
    address: string;
    startDate: Date;
  };
};

export const defaultCalculatorData: CalculatorData = {
  vehicle: {
    brand: '',
    year: new Date().getFullYear().toString(),
    type: 'non-commercial',
    tsi: 0,
    region: 1,
  },
  coverage: {
    type: 'all-risk',
    duration: 1,
    addons: {
      tpl: false,
      paDriver: false,
      paPassenger: false,
    },
  },
  policyholder: {
    name: '',
    ktp: '',
    phone: '',
    email: '',
    address: '',
    startDate: new Date(),
  },
};
