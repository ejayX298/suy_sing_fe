"use client";

import React, { useState, useEffect } from "react";
import SouvenirSelection from "@/components/auditor/SouvenirSelection";
import SuccessModal from "@/components/auditor/SuccessModal";
import { useRouter, useSearchParams } from "next/navigation";
import { auditorService } from "@/services/api";
import Swal from "sweetalert2";

interface Souvenir {
  id: number;
  name: string;
  code: string;
  color: string;
}

export default function SouvenirSelectionPage() {
  const router = useRouter();
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [souvenirList, setSouvenirList] = useState<Souvenir[]>([]);

  const searchParams = useSearchParams();
  const auditor_hash_code = searchParams.get("cc");

  let stored_hash_code: string = "";
  let stored_auditInfo: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("audit_hash_code") || "";
    stored_auditInfo = localStorage.getItem("audit_info") || "";
  }

  if (stored_auditInfo == "") {
    router.push(`/auditor/booth-vote/?cc=${stored_hash_code}`);
  }

  const handleSouvenirSelect = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
  };

  const handleCancel = () => {
    router.push(`/auditor/?cc=${stored_hash_code}`);
  };

  const handleContinue = async (selectedSouvenirData: Souvenir) => {
    const submitSouvenirResult = await handleSubmitSouvenir(
      selectedSouvenirData
    );
    if (submitSouvenirResult) {
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/auditor/?cc=${stored_hash_code}`);
  };

  const fetchData = async () => {
    showLoader();

    try {
      const getSouvenirs = await auditorService.getSouvenirList();

      if (getSouvenirs.success) {
        Swal.close();
        // Map the response data to match our Souvenir interface
        const mappedSouvenirs = getSouvenirs.results.map(
          (souvenir: Souvenir) => ({
            id: souvenir.id,
            name: souvenir.name,
            code: souvenir.code,
            color: souvenir.color,
          })
        );
        setSouvenirList(mappedSouvenirs);
      } else {
        Swal.close();
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmitSouvenir = async (selectedSouvenirData: Souvenir) => {
    showLoader();

    const post_data = {
      souvenir_id: selectedSouvenirData.id,
    };

    try {
      const submitSouvenir = await auditorService.submitSouvenir(post_data);

      if (submitSouvenir.success) {
        Swal.close();
        return true;
      } else {
        Swal.close();
        showMessage("0", submitSouvenir.message);
        return false;
      }
    } catch {
      Swal.close();
      showMessage(
        "0",
        "Unable to process your request. Please try again later."
      );
      return false;
    }
  };

  useEffect(() => {
    if (auditor_hash_code && stored_hash_code) {
      if (auditor_hash_code == stored_hash_code) {
        fetchData();
      } else {
        router.push(`/unauthorized`);
      }
    } else {
      router.push(`/unauthorized`);
    }
  }, []);

  const showMessage = (status: string, message: string) => {
    let iconType: "success" | "error";
    let titleType: "Success" | "Oops!";

    if (status == "1") {
      iconType = "success";
      titleType = "Success";
    } else {
      iconType = "error";
      titleType = "Oops!";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#F78B1E",
    });
  };

  const showLoader = () => {
    const loader = Swal.fire({
      title: "Processing data...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    return loader;
  };

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <SouvenirSelection
          souvenirData={souvenirList}
          onSelect={handleSouvenirSelect}
          onCancel={handleCancel}
          onContinue={handleContinue}
        />
      </div>

      {showSuccessModal && selectedSouvenir && (
        <SuccessModal onClose={handleSuccessModalClose} />
      )}
    </div>
  );
}
