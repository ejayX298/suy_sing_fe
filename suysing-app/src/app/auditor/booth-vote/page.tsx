"use client";

import React, { useState, useEffect } from "react";
// import { blueBooths, orangeBooths, redBooths } from "@/data/colorBooths";
import { BestBoothProvider, useBestBooth } from "@/context/BestBoothContext";
import BoothGrid from "@/components/best-booth/BoothGrid";
import VoteSummary from "@/components/best-booth/VoteSummary";
import ThankYouScreen from "@/components/auditor/ThankYouScreen";
import IntroScreen from "@/components/best-booth/IntroScreen";
import BoothsProgress from "@/components/BoothsProgress";
import { useRouter, useSearchParams } from "next/navigation";
import { auditorService } from "@/services/api";
import Swal from "sweetalert2";

function AuditorBoothVoteContent() {
  const router = useRouter();
  const [step, setStep] = useState<
    "intro" | "blue" | "orange" | "red" | "summary" | "thankyou"
  >("intro");
  const { blueBoothVote, orangeBoothVote, redBoothVote, resetVotes } =
    useBestBooth();

  const [blueBooths, setBlueBooths] = useState([]);
  const [orangeBooths, setOrangeBooths] = useState([]);
  const [redBooths, setRedBooths] = useState([]);
  const [auditData, setAuditData] = useState<{
    total_booth_visited: number;
    total_booths: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const auditor_hash_code = searchParams.get("cc");

  let stored_hash_code: string = "";
  let stored_auditInfo: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("audit_hash_code") || "";
    stored_auditInfo = localStorage.getItem("audit_info") || "";
  }
  const auditInforParsed = stored_auditInfo ? JSON.parse(stored_auditInfo) : [];

  const checkCustomerRecordbyId = async () => {
    try {
      const customer_id = auditInforParsed?.id || 0;
      const customerResult = await auditorService.checkCustomerRecordbyId(
        "",
        customer_id
      );
      if (customerResult.success) {
        setAuditData(customerResult.results);
        return;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const fetchData = async () => {
    showLoader(); // call the loader
    try {
      const getBooth = await auditorService.getBoothList();

      if (getBooth.success) {
        setBlueBooths(getBooth.results.blue_booths);
        setOrangeBooths(getBooth.results.orange_booths);
        setRedBooths(getBooth.results.red_booths);
        Swal.close(); // close the loader
      }
    } catch (error) {
      Swal.close(); // close the loader
      console.error("Error fetching data:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSubmitBoothVoting = async () => {
    showLoader(); // call the loader

    const blue_booth_id = blueBoothVote?.id || "";
    const orange_booth_id = orangeBoothVote?.id || "";
    const red_booth_id = redBoothVote?.id || "";

    const post_data = [blue_booth_id, orange_booth_id, red_booth_id];

    try {
      const submitVote = await auditorService.submitBoothVoting(post_data);

      if (submitVote.success) {
        Swal.close(); // close the loader
        return true;
      } else {
        Swal.close(); // close the loader
        showMessage("0", submitVote.message);
        return false;
      }
    } catch {
      Swal.close(); // close the loader
      showMessage(
        "0",
        "Unable to process your request. Please try again later."
      );
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (step === "intro") {
      setStep("blue");
    } else if (step === "blue") {
      setStep("orange");
    } else if (step === "orange") {
      setStep("red");
    } else if (step === "red") {
      setStep("summary");
    } else if (step === "summary") {
      const submitVoteResult = await handleSubmitBoothVoting();
      if (submitVoteResult) {
        setStep("thankyou");
      }
    } else {
      // For auditor flow, redirect to souvenir selection after thank you
      resetVotes();
      router.push(`/auditor/souvenir-selection?cc=${stored_hash_code}`);
    }
  };

  const handleBack = () => {
    if (step === "orange") {
      setStep("blue");
    } else if (step === "red") {
      setStep("orange");
    } else if (step === "summary") {
      setStep("red");
    }
  };

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

  useEffect(() => {
    if (!stored_auditInfo) {
      router.push(`/auditor/?cc=${stored_hash_code}`);
    }

    if (auditor_hash_code && stored_hash_code) {
      if (auditor_hash_code == stored_hash_code) {
        fetchData();
        checkCustomerRecordbyId();
      } else {
        router.push(`/unauthorized`);
      }
    } else {
      router.push(`/unauthorized`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStepHeader = () => {
    if (step === "summary" || step === "thankyou") {
      return null;
    }

    const colorText =
      step === "intro" || step === "blue"
        ? "Blue Booth"
        : step === "orange"
        ? "Orange Booth"
        : "Red Booth";

    return (
      <div className="px-4 py-3 text-white">
        <BoothsProgress
          visited={auditData?.total_booth_visited || 0}
          total={auditData?.total_booths || 0}
          viewList="Tap to view the list of visited and unvisited booths."
        />

        <h1 className="text-[34px] font-bold text-center mt-4 mb-6 leading-10">
          Vote for your best
          <br />
          {colorText}
        </h1>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case "intro":
        return (
          <>
            {getStepHeader()}
            <div className="relative">
              <BoothGrid
                booths={blueBooths}
                color="blue"
                onVote={handleContinue}
              />
              <IntroScreen onContinue={handleContinue} />
            </div>
          </>
        );
      case "blue":
        return (
          <>
            {getStepHeader()}
            <BoothGrid
              booths={blueBooths}
              color="blue"
              onVote={handleContinue}
            />
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                disabled={!blueBoothVote}
                className={`w-full py-3 rounded-lg text-lg font-medium ${
                  blueBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "orange":
        return (
          <>
            {getStepHeader()}
            <BoothGrid
              booths={orangeBooths}
              color="orange"
              onVote={handleContinue}
            />
            <div className="px-2 pb-4 flex gap-4 ">
              <button
                onClick={handleBack}
                className="w-full py-1 bg-white border-2 border-[#F78B1E] text-[#F78B1E] rounded-lg text-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!orangeBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  orangeBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "red":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={redBooths} color="red" onVote={handleContinue} />
            <div className="px-4 pb-4 flex gap-4">
              <button
                onClick={handleBack}
                className="w-full py-1 bg-white border-2 border-[#F78B1E] text-[#F78B1E] rounded-lg text-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!redBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  redBoothVote
                    ? "bg-[#F78B1E] text-[#252740]"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Submit
              </button>
            </div>
          </>
        );
      case "summary":
        return <VoteSummary onSubmit={handleContinue} onCancel={handleBack} />;
      case "thankyou":
        return <ThankYouScreen onContinue={handleContinue} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen mb-6">
      <div className="flex-1 pb-16">{renderStepContent()}</div>
    </div>
  );
}

export default function AuditorBoothVotePage() {
  return (
    <BestBoothProvider>
      <AuditorBoothVoteContent />
    </BestBoothProvider>
  );
}
