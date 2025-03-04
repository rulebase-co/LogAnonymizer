import { createContext, useContext, useState, ReactNode } from "react";

interface TutorialContextType {
  isOpen: boolean;
  currentStep: number;
  setIsOpen: (open: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const resetTutorial = () => {
    setCurrentStep(0);
    setIsOpen(false);
  };

  return (
    <TutorialContext.Provider
      value={{
        isOpen,
        currentStep,
        setIsOpen,
        nextStep,
        prevStep,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
