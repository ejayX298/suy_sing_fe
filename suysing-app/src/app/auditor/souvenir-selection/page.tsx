"use client";

import React, { useState, useEffect } from "react";
import SouvenirSelection from "@/components/auditor/SouvenirSelection";
import SuccessModal from "@/components/auditor/SuccessModal";
import { useRouter, useSearchParams } from "next/navigation";
import { auditorService } from '@/services/api';
import Swal from 'sweetalert2';

interface Souvenir {
  id: string;
  name: string;
  image: string;
}

export default function SouvenirSelectionPage() {
  const router = useRouter();
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [souvenirList, setSouvenirList] = useState([]);

  const searchParams = useSearchParams();
  const auditor_hash_code = searchParams.get("cc");

  let stored_hash_code: any = ""
  let stored_auditInfo: any = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('audit_hash_code');
    stored_auditInfo = localStorage.getItem('audit_info');
  }
    
  if(stored_auditInfo == ""){
    router.push(`/auditor/booth-vote/?cc=${stored_hash_code}`);
  }

  const handleSouvenirSelect = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
    // setShowSuccessModal(true);
  };

  const handleCancel = () => {
    router.push(`/auditor/?cc=${stored_hash_code}`);
  };

  const handleContinue = async (selectedSouvenirData : any) => {
    
    const submitSouvenirResult = await handleSubmitSouvenir(selectedSouvenirData)
    if(submitSouvenirResult){
      setShowSuccessModal(true);
    }

  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/auditor/?cc=${stored_hash_code}`);
  };


  const fetchData = async () => {
    try {
      const getSouvenirs = await auditorService.getSouvenirList();
      
      if(getSouvenirs.success){
          setSouvenirList(getSouvenirs.results || [])
      }
    
    
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };


  const handleSubmitSouvenir = async (selectedSouvenirData : any) => {

    const post_data = {
      souvenir_id : selectedSouvenir?.id || selectedSouvenirData?.id || '',
    };

    try {
      const submitSouvenir = await auditorService.submitSouvenir(post_data);
      
      if(submitSouvenir.success){
        return true;
      }else{
        showMessage("0" , submitSouvenir.message)  
        return false;
      }
    
    } catch (error) {
      showMessage("0" , "Unable to process your request. Please try again later.")   
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if(auditor_hash_code && stored_hash_code){
      if(auditor_hash_code == stored_hash_code){
        fetchData();
      }
      
    }
  }, []);


  const showMessage = (status: string, message : string)  => {
    
    let iconType: "success" | "error";
    let titleType: "Success" | "Error";

    if(status == "1"){
      iconType = "success";
      titleType = "Success";
    }else{
      iconType = "error";
      titleType = "Error";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#F78B1E"
    })
  }


  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex-1 flex items-center justify-center ">
        <SouvenirSelection
          souvenirData={souvenirList} 
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
