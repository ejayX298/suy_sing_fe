"use client";

import React, { useState } from "react";
import SouvenirSelection from "@/components/auditor/SouvenirSelection";
import SuccessModal from "@/components/auditor/SuccessModal";
import { useRouter } from "next/navigation";

interface Souvenir {
  id: string;
  name: string;
  image: string;
}

export default function SouvenirSelectionPage() {
  const router = useRouter();
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSouvenirSelect = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    router.push("/auditor");
  };

  const handleContinue = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/auditor");
  };

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex-1 flex items-center justify-center ">
        <SouvenirSelection 
          onSelect={handleSouvenirSelect} 
          onCancel={handleCancel} 
          onContinue={handleContinue}
        />
      </div>

      {showSuccessModal && selectedSouvenir && (
        <SuccessModal
          onClose={handleSuccessModalClose}
        />
      )}
    </div>
  );
}
