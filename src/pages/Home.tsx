import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StepIndicator } from '@/components/calculator/StepIndicator';
import { Step1VehicleInfo } from '@/components/calculator/Step1VehicleInfo';
import { Step2Coverage } from '@/components/calculator/Step2Coverage';
import { Step3PolicyholderData } from '@/components/calculator/Step3PolicyholderData';
import { Step4PremiumCalc } from '@/components/calculator/Step4PremiumCalc';
import { Step5PolicyIssuance } from '@/components/calculator/Step5PolicyIssuance';
import { CalculatorData, defaultCalculatorData } from '@/lib/types';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CalculatorData>(defaultCalculatorData);

  const updateData = (stepData: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetFlow = () => {
    setData(defaultCalculatorData);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          
          <div className="bg-card rounded-2xl shadow-xl shadow-primary/5 border border-border p-4 md:p-8">
            <StepIndicator currentStep={currentStep} />
            
            <div className="mt-8 relative overflow-hidden min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <Step1VehicleInfo 
                    key="step1" 
                    data={data.vehicle} 
                    onNext={(vehicle) => { updateData({ vehicle }); nextStep(); }} 
                  />
                )}
                {currentStep === 2 && (
                  <Step2Coverage 
                    key="step2" 
                    data={data.coverage} 
                    onNext={(coverage) => { updateData({ coverage }); nextStep(); }} 
                    onBack={prevStep}
                  />
                )}
                {currentStep === 3 && (
                  <Step3PolicyholderData 
                    key="step3" 
                    data={data.policyholder} 
                    onNext={(policyholder) => { updateData({ policyholder }); nextStep(); }} 
                    onBack={prevStep}
                  />
                )}
                {currentStep === 4 && (
                  <Step4PremiumCalc 
                    key="step4" 
                    data={data} 
                    onNext={nextStep} 
                    onBack={prevStep}
                  />
                )}
                {currentStep === 5 && (
                  <Step5PolicyIssuance 
                    key="step5" 
                    data={data} 
                    onReset={resetFlow}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
