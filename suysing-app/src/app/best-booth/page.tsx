"use client";

import React, { useState, useEffect } from "react";
// import { blueBooths, orangeBooths, redBooths } from "@/data/colorBooths";
import { BestBoothProvider, useBestBooth } from "@/context/BestBoothContext";
import BoothGrid from "@/components/best-booth/BoothGrid";
import VoteSummary from "@/components/best-booth/VoteSummary";
import ThankYouScreen from "@/components/best-booth/ThankYouScreen";
import IntroScreen from "@/components/best-booth/IntroScreen";
import BoothsProgress from "@/components/BoothsProgress";
import { bestBooth, customerQr } from "@/services/api";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";
import { boothVisitService } from "@/services/api";
import Image from "next/image";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function BestBoothContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");

  let stored_hash_code: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("hash_code") || "";
  }

  const [step, setStep] = useState<
    "intro" | "blue" | "orange" | "red" | "green" | "summary" | "thankyou"
  >("intro");
  const {
    blueBoothVote,
    orangeBoothVote,
    redBoothVote,
    greenBoothVote,
    resetVotes,
  } = useBestBooth();

  const [blueBooths, setBlueBooths] = useState([]);
  const [orangeBooths, setOrangeBooths] = useState([]);
  const [redBooths, setRedBooths] = useState([]);
  const [greenBooths, setGreenBooths] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);
  const [customerType, setCustomerType] = useState("");
  const [isDoneVisit, setIsDoneVisit] = useState(false);
  const [showVotedMessage, setShowVotedMessage] = useState(false);
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const getBooth = await bestBooth.getBoothList();

      if (getBooth.success) {
        setBlueBooths(getBooth.results.blue_booths);
        setOrangeBooths(getBooth.results.orange_booths);
        setRedBooths(getBooth.results.red_booths);
        setGreenBooths(getBooth.results.green_booths);
      }
    } catch (error) {
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
    const green_booth_id = greenBoothVote?.id || "";

    const post_data = [
      blue_booth_id,
      orange_booth_id,
      red_booth_id,
      green_booth_id,
    ];

    try {
      const submitVote = await bestBooth.submitBoothVoting(post_data);

      if (submitVote.success) {
        Swal.close(); // close the loader
        return true;
      } else {
        Swal.close(); // close the loader
        setShowErrorMessageModal(true);
        setErrorMessage(submitVote.message);
        // showMessage("0", submitVote.message);
        return false;
      }
    } catch {
      Swal.close(); // close the loader
      setShowErrorMessageModal(true);
      setErrorMessage(
        "Unable to process your request. Please try again later.",
      );
      // showMessage(
      //   "0",
      //   "Unable to process your request. Please try again later."
      // );
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  const getCustomerRecord = async () => {
    try {
      const customerResult = await boothVisitService.getCustomerRecord();

      if (customerResult.success) {
        const mapCustomerData = {
          id: customerResult.results?.id,
          code: customerResult.results?.code,
          name: customerResult.results?.full_name,
          hasVoted: customerResult.results?.is_done_voting,
          isDoneVisit: customerResult.results?.is_done_visit,
          totalBooths: customerResult.results?.total_booths,
          totalBoothVisited: customerResult.results?.total_booth_visited,
        };

        setCustomerData(mapCustomerData);

        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const getCustomerDetails = async () => {
    if (!customer_hash_code) return;
    const customerResult =
      await customerQr.getCustomerDetails(customer_hash_code);
    if (customerResult.success) {
      setCustomerType(customerResult.results?.customer_type || "");
    }
  };

  // const showMessage = (status: string, message: string) => {
  //   let iconType: "success" | "error";
  //   let titleType: "Success" | "Oops!";

  //   if (status == "1") {
  //     iconType = "success";
  //     titleType = "Success";
  //   } else {
  //     iconType = "error";
  //     titleType = "Oops!";
  //   }

  //   Swal.fire({
  //     title: titleType,
  //     text: message,
  //     icon: iconType,
  //     confirmButtonColor: "#F78B1E",
  //   });
  // };

  // const showMessageRedirect = (status: string, message: string) => {
  //   let iconType: "success" | "error";
  //   let titleType: "Success" | "Oops!";

  //   if (status == "1") {
  //     iconType = "success";
  //     titleType = "Success";
  //   } else {
  //     iconType = "error";
  //     titleType = "Oops!";
  //   }

  //   Swal.fire({
  //     title: titleType,
  //     text: message,
  //     icon: iconType,
  //     confirmButtonColor: "#F78B1E",
  //     allowOutsideClick: false, // disable outside click fot the close modal
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       router.push(`/?cc=${stored_hash_code}`);
  //     }
  //   });
  // };

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
    if (customer_hash_code && stored_hash_code) {
      if (customer_hash_code == stored_hash_code) {
        getCustomerRecord();
        getCustomerDetails();
        setIsRender(true);
        fetchData();
      } else {
        router.push(`/unauthorized`);
      }
    } else {
      router.push(`/unauthorized`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customerData) {
      if (customerData?.isDoneVisit == 0) {
        // showMessageRedirect("0", "You need to visit all the booths first");
        setShowErrorMessageModal(true);
        setErrorMessage("You need to visit all the booths first");
      } else if (customerData?.isDoneVisit == 1) {
        setIsDoneVisit(true);
      }
      if (customerData?.hasVoted === 1) {
        setShowVotedMessage(true);
      }
    }
  }, [customerData]);

  const handleContinue = async () => {
    if (
      step === "blue" ||
      step === "orange" ||
      step === "red" ||
      step === "green"
    ) {
      await delay(600);
    }
    if (step === "intro") {
      setStep("blue");
    } else if (step === "blue") {
      setStep("orange");
    } else if (step === "orange") {
      setStep("red");
    } else if (step === "red") {
      setStep("green");
    } else if (step === "green") {
      setStep("summary");
    } else if (step === "summary") {
      const submitVoteResult = await handleSubmitBoothVoting();
      if (submitVoteResult) {
        setStep("thankyou");
      }
    } else {
      // Reset and go back to intro
      resetVotes();
      setStep("intro");
    }
  };

  const handleBack = () => {
    if (step === "orange") {
      setStep("blue");
    } else if (step === "red") {
      setStep("orange");
    } else if (step === "green") {
      setStep("red");
    } else if (step === "summary") {
      setStep("intro");
    }
  };

  const handleProceed = () => {
    if (!isDoneVisit) {
      setShowErrorMessageModal(false);
      router.push(`/my-qr?cc=${stored_hash_code}`);
    } else {
      setShowErrorMessageModal(false);
    }
  };

  const getStepHeader = () => {
    if (step === "summary" || step === "thankyou") {
      return null;
    }

    return (
      <div className="px-4 py-3 text-white">
        <BoothsProgress
          visited={customerData?.totalBoothVisited || 0}
          total={customerData?.totalBooths || 0}
          viewList="Tap to view the list of visited and unvisited booths."
        />
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
              <BoothGrid booths={blueBooths} color="blue" />
              <IntroScreen onContinue={handleContinue} />
            </div>
          </>
        );
      case "blue":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={blueBooths} color="blue" />
            <div className="px-4 pb-4">
              <button
                onClick={handleContinue}
                disabled={!blueBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  blueBoothVote
                    ? "bg-[#F78B1E] text-white"
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
            <BoothGrid booths={orangeBooths} color="orange" />
            <div className="px-2 pb-4 flex gap-4 ">
              <button
                onClick={handleBack}
                className="w-full py-1  border border-[#F78B1E] text-[#F78B1E] bg-[#FFEBD4] rounded-lg text-lg font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!orangeBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  orangeBoothVote
                    ? "bg-[#F78B1E] text-white"
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
            <BoothGrid booths={redBooths} color="red" />
            <div className="px-4 pb-4 flex gap-4">
              <button
                onClick={handleBack}
                className="w-full py-1  border border-[#F78B1E] text-[#F78B1E] bg-[#FFEBD4] rounded-lg text-lg font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!redBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  redBoothVote
                    ? "bg-[#F78B1E] text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "green":
        return (
          <>
            {getStepHeader()}
            <BoothGrid booths={greenBooths} color="green" />
            <div className="px-4 pb-4 flex gap-4">
              <button
                onClick={handleBack}
                className="w-full py-1  border border-[#F78B1E] text-[#F78B1E] bg-[#FFEBD4] rounded-lg text-lg font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!greenBoothVote}
                className={`w-full py-1 rounded-lg text-lg font-medium ${
                  greenBoothVote
                    ? "bg-[#F78B1E] text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </>
        );
      case "summary":
        return <VoteSummary onSubmit={handleContinue} onCancel={handleBack} />;
      case "thankyou":
        return (
          <ThankYouScreen
            storedHashcode={stored_hash_code}
            onContinue={handleContinue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen mb-6">
      {isRender && isDoneVisit && (
        <div className="flex-1 pb-16">
          {showVotedMessage ? (
            <div className="fixed mx-auto max-w-[22rem] inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border-2 border-[#F78B1E]">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Image
                      src="/images/submitted.svg"
                      alt="Success"
                      width={100}
                      height={100}
                    />
                  </div>
                  <p className="text-gray-600 mb-6">
                    <span className="text-lg font-bold">
                      You&apos;ve already submitted your Best Booth votes.{" "}
                      <br />
                    </span>
                    {customerType.toLowerCase() === "red"
                      ? "You have completed your Booth Hopping. Claim your souvenir at the Tent Lobby from 1:00pm-7:00pm."
                      : "You have completed your Booth Hopping. Claim your souvenir at the Tent Lobby from 2:30pm-7:00pm."}
                  </p>
                  <button
                    onClick={() => router.push(`/my-qr?cc=${stored_hash_code}`)}
                    className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-white font-semibold rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>
      )}

      {/* Error Message Modal */}
      {showErrorMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border border-[#F78B1E]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/images/close.svg"
                  alt="Error"
                  width={100}
                  height={100}
                />
              </div>
              <h1 className="text-[#343434] text-[20px]">Oops!</h1>
              <p className="mb-6 text-[#343434] text-[20px]">{errorMessage}</p>
              <button
                onClick={handleProceed}
                className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-white font-semibold rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BestBoothPage() {
  return (
    <BestBoothProvider>
      <BestBoothContent />
    </BestBoothProvider>
  );
}
