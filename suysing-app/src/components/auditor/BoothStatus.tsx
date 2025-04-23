"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
import { auditorService } from '@/services/api';

interface BoothStatusProps {
  customerId: number,
  isComplete: boolean;
  visitedCount: number;
  totalBooths: number;
  onViewUnvisited: () => void;
  onClose: () => void;
}

export default function BoothStatus({
  customerId,
  isComplete,
  visitedCount,
  totalBooths,
  onViewUnvisited,
  onClose,
}: BoothStatusProps) {
  const router = useRouter();


  const checkCustomerRecordbyId = async (customer_id : number) => {
    try {

      const customerResult = await auditorService.checkCustomerRecordbyId("", customer_id);
      
      if(customerResult.success){
        return customerResult.results
      }else{
        showMessage('0', customerResult.message)
        return false;
      }
    
    } catch {
      showMessage('0', 'Unable to process your request ')
      return false;
      
    }

  };


  const callOverride = async () => {

    showLoader(); // call the loader
    try {

      const customerResult = await auditorService.overrideBoothVisit(customerId);
      
      if(customerResult.success){
        Swal.close(); // close the loader

        showMessage('1' , 'Success')

        //refresh customer record in localStorage
        checkCustomerRecordbyId(customerId)

        return true
      }else{
        Swal.close(); // close the loader
        
        showMessage('0' , customerResult.message)
        return false
      }
    
    } catch {
      Swal.close(); // close the loader

      showMessage('0' , 'Unable to process your request. Please try again.')
      return false
      
    } finally {
      // setIsLoading(false);
    }
  }

  const handleOverride = async () => {

    const confirmAction = await confirmMessage(`Are you sure you want to override the booth visit of this customer?`);

    if(confirmAction.isConfirmed){

      const overrideResult = await callOverride()

      if(overrideResult){
        let stored_hash_code: string = ""
        if (typeof window !== 'undefined') {
          stored_hash_code = localStorage.getItem('audit_hash_code') || "";
        }

        router.push(`/auditor/booth-vote/?cc=${stored_hash_code}`);
      }
    }
  }

  const confirmMessage = async (message: string)  => {
    
    const result = await Swal.fire({
      title: 'Confirm',
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F78B1E",
    })

    return result;
  }

  const showMessage = (status: string, message : string)  => {
    
      let iconType: "success" | "error";
      let titleType: "Success" | "Oops!";

      if(status == "1"){
        iconType = "success";
        titleType = "Success";
      }else{
        iconType = "error";
        titleType = "Oops!";
      }

      Swal.fire({
        title: titleType,
        text: message,
        icon: iconType,
        confirmButtonColor: "#F78B1E"
      })
  }

  const showLoader = ()  => {
    const loader = Swal.fire({
      title: 'Processing data...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    return loader;
  }

  return (
    <div className="rounded-lg border-2 mx-auto max-w-xl border-[#F78B1E] bg-white p-6 shadow-lg text-center">
      <div className="mb-6">
        {isComplete ? (
          <>
            <Image
              src="/images/check-icon.svg"
              alt="Complete"
              width={64}
              height={64}
              className="mx-auto mb-2"
            />
            <h2 className="text-xl font-semibold">Booth Visit Completed</h2>
            <p className="text-gray-600 mt-2">Ready to claim souvenir</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4">
              <Image
                src="/images/booth.svg"
                alt="Incomplete"
                width={100}
                height={100}
                className="mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold">Incomplete <span className="sm:block">Booth Hopping</span></h2>
            <p className="mt-2">
              This customer has visited {visitedCount} out of {totalBooths} booths.
            </p>
            <p className="mt-1">
              Please visit all {totalBooths} booths to claim souvenir.
            </p>
          </>
        )}
      </div>
     
      <button
        onClick={onViewUnvisited}
        className="w-full rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
      >
        View Unvisited Booth
      </button>
      
      {!isComplete && (
        <>
          <button
            onClick={handleOverride}
            className="w-full mt-3 rounded-lg font-semibold bg-[#FF3A3A] px-4 py-3  hover:bg-orange-500"
          >
            Override
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 rounded-lg border border-[#F78B1E] px-4 py-3 text-[#F78B1E] font-semibold hover:bg-gray-100"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
