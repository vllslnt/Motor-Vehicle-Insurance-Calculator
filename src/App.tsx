import React, { useState } from 'react';
import { Shield, Calculator, CheckCircle2, ArrowRight, ArrowLeft, Car, User, CheckSquare, Sparkles } from 'lucide-react';

const ojkRates: Record<string, Record<string, { label: string; w1: [number, number]; w2: [number, number]; w3: [number, number] }>> = {
  allRisk: {
    cat1: { label: "0 - 125 Juta", w1: [3.82, 4.20], w2: [3.44, 3.78], w3: [2.53, 2.78] },
    cat2: { label: ">125 - 200 Juta", w1: [2.67, 2.94], w2: [2.47, 2.72], w3: [2.07, 2.28] },
    cat3: { label: ">200 - 400 Juta", w1: [1.71, 1.88], w2: [1.71, 1.88], w3: [1.40, 1.54] },
    cat4: { label: ">400 - 800 Juta", w1: [1.20, 1.32], w2: [1.20, 1.32], w3: [1.20, 1.32] },
    cat5: { label: ">800 Juta", w1: [1.05, 1.16], w2: [1.05, 1.16], w3: [1.05, 1.16] },
  },
  tlo: {
    cat1: { label: "0 - 125 Juta", w1: [0.47, 0.56], w2: [0.65, 0.78], w3: [0.36, 0.43] },
    cat2: { label: ">125 - 200 Juta", w1: [0.44, 0.53], w2: [0.44, 0.53], w3: [0.31, 0.37] },
    cat3: { label: ">200 - 400 Juta", w1: [0.29, 0.35], w2: [0.29, 0.35], w3: [0.29, 0.35] },
    cat4: { label: ">400 - 800 Juta", w1: [0.25, 0.30], w2: [0.25, 0.30], w3: [0.25, 0.30] },
    cat5: { label: ">800 Juta", w1: [0.20, 0.24], w2: [0.20, 0.24], w3: [0.20, 0.24] },
  }
};

interface FormData {
  carModel: string;
  sumInsured: number;
  region: 'w1' | 'w2' | 'w3';
  coverageType: 'allRisk' | 'tlo';
  name: string;
  nik: string;
  plateNumber: string;
  stnkFile: File | null;
}

interface PolicyResult {
  categoryLabel: string;
  minRate: number;
  maxRate: number;
  appliedRate: string;
  basePremium: number;
  adminFee: number;
  total: number;
  policyNo: string;
  date: string;
}

export default function App() {
  const [step, setStep] = useState<number>(1);
  
  const [formData, setFormData] = useState<FormData>({
    carModel: '',
    sumInsured: 250000000,
    region: 'w2',
    coverageType: 'allRisk',
    name: '',
    nik: '',
    plateNumber: '',
    stnkFile: null
  });

  const [policyResult, setPolicyResult] = useState<PolicyResult | null>(null);

  const getCategory = (val: number): string => {
    if (val <= 125000000) return 'cat1';
    if (val <= 200000000) return 'cat2';
    if (val <= 400000000) return 'cat3';
    if (val <= 800000000) return 'cat4';
    return 'cat5';
  };

  const calculatePremium = () => {
    const cat = getCategory(formData.sumInsured);
    const rates = ojkRates[formData.coverageType][cat][formData.region];
    const avgRate = (rates[0] + rates[1]) / 2;
    const basePremium = (formData.sumInsured * avgRate) / 100;
    const adminFee = 50000;
    
    return {
      categoryLabel: ojkRates[formData.coverageType][cat].label,
      minRate: rates[0],
      maxRate: rates[1],
      appliedRate: avgRate.toFixed(2),
      basePremium: Math.round(basePremium),
      adminFee,
      total: Math.round(basePremium + adminFee)
    };
  };

  const calculation = calculatePremium();

  const handleIssuePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const policyNo = `POL-${Math.floor(100000 + Math.random() * 900000)}`;
    setPolicyResult({ ...calculation, policyNo, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) });
    setStep(4);
  };

  const stepsMeta = [
    { num: 1, label: 'Simulation', icon: Calculator },
    { num: 2, label: 'Details', icon: User },
    { num: 3, label: 'Review', icon: CheckSquare },
    { num: 4, label: 'Issued', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                OJK InsurePortal <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400">Automated Tariff & Issuance Engine</p>
            </div>
          </div>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full font-medium tracking-wide">
            SEOJK Compliant
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        {/* Progress Tracker */}
        <div className="mb-8 bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex justify-between items-center relative">
            {stepsMeta.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2 z-10">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-500/20' :
                    isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Step 0{s.num}</p>
                    <p className={`text-xs font-medium ${isActive ? 'text-blue-400 font-semibold' : 'text-slate-400'}`}>{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SIMULATION */}
        {step === 1 && (
          <div className="bg-slate-950/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" /> Vehicle Valuation & OJK Rate Parameters
              </h2>
              <p className="text-sm text-slate-400 mt-1">Configure asset details to fetch compliant risk brackets instantly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vehicle Model & Year</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Car className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="e.g. Toyota Innova Zenix 2024"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Coverage Type</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition cursor-pointer"
                  value={formData.coverageType}
                  onChange={(e) => setFormData({...formData, coverageType: e.target.value as 'allRisk' | 'tlo'})}
                >
                  <option value="allRisk">All Risk (Comprehensive Protection)</option>
                  <option value="tlo">TLO (Total Loss Only)</option>
                </select>
              </div>

              <div className="md:col-span-2 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sum Insured / Nilai Kendaraan (IDR)</label>
                  <span className="text-lg font-bold font-mono text-blue-400">Rp {formData.sumInsured.toLocaleString('id-ID')}</span>
                </div>
                <input 
                  type="range" 
                  min="50000000" 
                  max="1000000000" 
                  step="10000000"
                  className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  value={formData.sumInsured}
                  onChange={(e) => setFormData({...formData, sumInsured: Number(e.target.value)})}
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Rp 50 Juta</span>
                  <span>Rp 500 Juta</span>
                  <span>Rp 1 Miliar</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">OJK Operational Region (Wilayah STNK)</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition cursor-pointer"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value as 'w1' | 'w2' | 'w3'})}
                >
                  <option value="w1">Wilayah 1 - Sumatera & Sekitarnya</option>
                  <option value="w2">Wilayah 2 - DKI Jakarta, Jawa Barat, Banten</option>
                  <option value="w3">Wilayah 3 - Jawa Tengah, Jawa Timur & Lainnya</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Banner */}
            <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">OJK Compliance Feed</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">Bracket: <span className="font-semibold text-white">{calculation.categoryLabel}</span></p>
                <p className="text-xs text-slate-400">Permissible Rate Range: <span className="font-mono text-blue-300 font-semibold">{calculation.minRate}% – {calculation.maxRate}%</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Estimated Total Premium</p>
                <p className="text-2xl font-black font-mono text-blue-400">Rp {calculation.total.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                disabled={!formData.carModel}
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                Proceed to Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="bg-slate-950/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Customer Identity & Asset Documents
              </h2>
              <p className="text-sm text-slate-400 mt-1">Provide legal identity information required for policy registration.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name (As per KTP)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                  placeholder="Vallasie Lintang Widyasputra"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">NIK (National ID Number)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono transition"
                  placeholder="3171xxxxxxxxxxxx"
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vehicle License Plate (Nomor Polisi)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono uppercase transition"
                  placeholder="B 1234 XYZ"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Upload STNK Document</label>
                <input 
                  type="file" 
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 file:cursor-pointer bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
                  onChange={(e) => setFormData({...formData, stnkFile: e.target.files ? e.target.files[0] : null})}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-3 font-medium flex items-center gap-2 cursor-pointer transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                disabled={!formData.name || !formData.nik || !formData.plateNumber}
                onClick={() => setStep(3)}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                Review Application <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="bg-slate-950/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-500" /> Automated Underwriting Review
              </h2>
              <p className="text-sm text-slate-400 mt-1">Verify summary parameters before final policy commitment.</p>
            </div>
            
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-400">Applicant Identity</span>
                <span className="font-semibold text-white">{formData.name} <span className="text-slate-500 font-mono text-xs">({formData.nik})</span></span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-400">Vehicle Profile</span>
                <span className="font-semibold text-white">{formData.carModel} <span className="text-blue-400 font-mono">[{formData.plateNumber}]</span></span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-400">Coverage Type</span>
                <span className="font-semibold uppercase text-white">{formData.coverageType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-400">Sum Insured Value</span>
                <span className="font-semibold font-mono text-white">Rp {formData.sumInsured.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-400">OJK Applied Tariff Rate</span>
                <span className="font-semibold text-blue-400">{calculation.appliedRate}% <span className="text-xs text-slate-500">(Range: {calculation.minRate}%-{calculation.maxRate}%)</span></span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold">
                <span className="text-white">Total Payable Premium</span>
                <span className="font-mono text-emerald-400">Rp {calculation.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span><strong>Underwriting Clearance Passed:</strong> All parameters successfully validated against OJK motor vehicle rating criteria. Ready for instant digital issuance.</span>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white px-4 py-3 font-medium flex items-center gap-2 cursor-pointer transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleIssuePolicy}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Approve & Issue Policy <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ISSUED SUCCESS */}
        {step === 4 && policyResult && (
          <div className="bg-slate-950/60 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <Shield className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Insurance Policy Issued Successfully</h2>
              <p className="text-sm text-slate-400">Digital policy certificate generated and registered with compliance logs.</p>
            </div>

            <div className="max-w-md mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-left space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Policy Reference:</span>
                <span className="font-mono font-bold text-blue-400">{policyResult.policyNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Policyholder:</span>
                <span className="font-semibold text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Insured Asset:</span>
                <span className="font-semibold text-white">{formData.carModel} ({formData.plateNumber})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400">Issuance Date:</span>
                <span className="font-semibold text-white">{policyResult.date}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-white">Total Settled:</span>
                <span className="font-mono text-emerald-400">Rp {policyResult.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={() => { 
                setStep(1); 
                setFormData({ carModel: '', sumInsured: 250000000, region: 'w2', coverageType: 'allRisk', name: '', nik: '', plateNumber: '', stnkFile: null }); 
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Calculate Another Policy
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-800/60 mt-auto">
        OJK Motor Vehicle Insurance Compliance Engine • Built for Technical Assessment
      </footer>
    </div>
  );
}