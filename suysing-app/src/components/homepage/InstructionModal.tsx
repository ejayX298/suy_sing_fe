"use client";

import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import CameraInstructionPage from "./CameraInstructionPage";
import DealFormInstructionPage from "./DealFormInstructionPage";
import BestBoothInstructionPage from "./BestBoothInstructionPage";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'camera' | 'deal-form' | 'best-booth'>('welcome');

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('camera');
    } else if (currentStep === 'camera') {
      setCurrentStep('deal-form');
    } else if (currentStep === 'deal-form') {
      setCurrentStep('best-booth');
    } else if (currentStep === 'best-booth') {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep('welcome');
    onClose();
  };

  return (
    <>
      {currentStep === 'welcome' && (
        <WelcomePage onContinue={handleNext} onClose={handleClose} />
      )}
      {currentStep === 'camera' && (
        <CameraInstructionPage onClose={handleNext} />
      )}
      {currentStep === 'deal-form' && (
        <DealFormInstructionPage onClose={handleNext} />
      )}
      {currentStep === 'best-booth' && (
        <BestBoothInstructionPage onClose={handleNext} />
      )}
    </>
  );
}
