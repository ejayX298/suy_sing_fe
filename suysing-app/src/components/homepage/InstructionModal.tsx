"use client";

import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage";
import CameraInstructionPage from "./CameraInstructionPage";
import DealFormInstructionPage from "./DealFormInstructionPage";
import BestBoothInstructionPage from "./BestBoothInstructionPage";

interface InstructionModalProps {
  customer_data : any;
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionModal({ customer_data, isOpen, onClose }: InstructionModalProps) {
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
    handleFirstVisitIds(customer_data?.id || 0);
    setCurrentStep('welcome');
    onClose();
  };

  const handleFirstVisitIds = (customer_id : number) =>{
    const firstVisitIds = localStorage.getItem('firstVisitIds');
    console.log(customer_id)
    if(customer_id && customer_id != 0){  
      if(!firstVisitIds){
        const firstVisitIdsStore = [customer_id]
        localStorage.setItem('firstVisitIds', JSON.stringify(firstVisitIdsStore));
      }else{
        const currentFirstVisitIds = JSON.parse(firstVisitIds);
        // Insert id in local storage if not exist
        if(!currentFirstVisitIds.includes(customer_id)){
            const updatedFirstVisitedIdsStore = [...currentFirstVisitIds, customer_id]
            localStorage.setItem('firstVisitIds', JSON.stringify(updatedFirstVisitedIdsStore));
        }
      }
    }
  }

  return (
    <>
      {currentStep === 'welcome' && (
        <WelcomePage customer_data={customer_data} onContinue={handleNext} onClose={handleClose} />
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
