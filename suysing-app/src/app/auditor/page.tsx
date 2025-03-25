"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import BoothStatus from "@/components/auditor/BoothStatus";
import BoothsList from "@/components/auditor/BoothsList";
import UnvisitedBooths from "@/components/auditor/UnvisitedBooths";
import SouvenirSelection from "@/components/auditor/SouvenirSelection";
import BoothGrid from "@/components/best-booth/BoothGrid";
import VoteSummary from "@/components/best-booth/VoteSummary";
import ThankYouScreen from "@/components/best-booth/ThankYouScreen";
import VoteBestBoothModal from "@/components/auditor/VoteBestBoothModal";
import { useBooths } from "@/context/BoothsContext";
import { BestBoothProvider, useBestBooth } from "@/context/BestBoothContext";
import IntroScreen from "@/components/best-booth/IntroScreen";
import { blueBooths, orangeBooths, redBooths } from "@/data/colorBooths";

function AuditorPageContent() {
  // Camera and scanning states
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManualCodeModal, setShowManualCodeModal] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // Customer and flow state
  const [customerData, setCustomerData] = useState<{
    code: string;
    name: string;
    hasVoted?: boolean;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<
    | "scan"
    | "confirm-customer"
    | "booth-status"
    | "booths-list"
    | "unvisited-booths"
    | "vote-modal"
    | "vote-intro"
    | "vote-blue"
    | "vote-orange" 
    | "vote-red"
    | "vote-summary"
    | "thank-you"
    | "souvenir"
    | "success"
  >("scan");
  
  // Get booth data from context
  const { visitedCount, totalBooths, booths, handleToggleBooth } = useBooths();
  
  // Get best booth voting context (only accessing what we need)
  const { resetVotes } = useBestBooth();
  
  // Filtered booths for the current customer
  const [unvisitedBooths, setUnvisitedBooths] = useState<
    { name: string; code: string; checked?: boolean }[]
  >([]);
  const [isBoothComplete, setIsBoothComplete] = useState(false);

  useEffect(() => {
 
    if (currentStep === "scan" && !showManualCodeModal) {
   
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then(() => {
            setHasPermission(true);
          })
          .catch((err) => {
            console.error("Camera permission error:", err);
            setError("Camera permission denied. Please enable camera access.");
            setHasPermission(false);
          });
      }
    }

    return () => {
      setScanning(false);
    };
  }, [currentStep, showManualCodeModal]);

  // Wrap handleScan in useCallback
  const handleScan = useCallback(async (data: string) => {
    const customerCode = data.trim();
    
    const mockCustomerData = {
      code: customerCode || "JUAN02",
      name: "Juan Dela Cruz",
      hasVoted: false, 
    };
    
    setCustomerData(mockCustomerData);
    
    // All possible booths for this customer
    const allBooths = [
      { name: "Alaska Milk Corporation", code: "ALA01" },
      { name: "Champion", code: "CHA01" },
      { name: "RC Cola", code: "RC01" },
      { name: "CDO", code: "CDO01" },
      { name: "Nestle", code: "NES02" },
      { name: "Colgate", code: "COL02" },
      { name: "Nature's Spring", code: "NSP01" },
      { name: "SPAM", code: "SPA02" },
      { name: "P&G", code: "PG01" },
      { name: "Baygon", code: "BAY01" },
      { name: "Ding Dong", code: "DIN01" },
      { name: "Ginebra San Miguel", code: "GIN01" },
      { name: "Hapee", code: "HAP01" },
      { name: "Rebisco", code: "REB01" },
    ];
    
    // Get the list of already visited booths from the context
    const visitedBoothNames = booths.filter(booth => booth.visited).map(booth => booth.name);
    
    // Filter out booths that are already marked as visited in the context
    const remainingBooths = allBooths.filter(booth => !visitedBoothNames.includes(booth.name));
    
    // Determine if booth visits are complete
    const isComplete = visitedCount === totalBooths;
    setIsBoothComplete(isComplete);
    
    // Set unvisited booths
    setUnvisitedBooths(remainingBooths);
    
    // Go to the confirmation step first instead of directly to booth status
    setCurrentStep("confirm-customer");
    
  }, [visitedCount, totalBooths, booths]);

  const captureAndScanQRCode = useCallback(() => {
    if (!scanning || currentStep !== "scan") return;

    const videoElement = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (videoElement && canvas && videoElement.readyState === 4) {
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        try {
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            {
              inversionAttempts: "dontInvert",
            }
          );

          if (qrCode) {
            setScanning(false);
            handleScan(qrCode.data);
            return;
          }
        } catch (error) {
          console.error("QR processing error:", error);
        }
      }
    }

    if (scanning && currentStep === "scan") {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [scanning, currentStep, handleScan]);

  useEffect(() => {
    if (hasPermission && scanning && currentStep === "scan") {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [hasPermission, scanning, currentStep, captureAndScanQRCode]);

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      return;
    }
    
    // Process the manual code
    handleScan(manualCode);
    setShowManualCodeModal(false);
    setManualCode("");
  };

  const openManualCodeModal = () => {
    setManualCode("");
    setShowManualCodeModal(true);
  };

  const closeManualCodeModal = () => {
    setShowManualCodeModal(false);
    setManualCode("");
  };

  const handleBoothToggle = (name: string, isVisited: boolean) => {
    // Update the booths list in the UI only (don't update context yet)
    setUnvisitedBooths(prevBooths => 
      prevBooths.map(booth => 
        booth.name === name ? { ...booth, checked: isVisited } : booth
      )
    );
    
    // We don't update the actual booth visited state in context until Submit is clicked
    // This ensures booths stay in the list until submission
  };

  const handleBoothSelectionSubmit = () => {
    // Count how many booths are checked
    const checkedBooths = unvisitedBooths.filter(booth => booth.checked);
    
    // If all booths are checked, proceed to voting
    const allBooths = checkedBooths.length === unvisitedBooths.length;
    
    if (allBooths) {
      // Update all booths in the context
      checkedBooths.forEach(booth => {
        if (booth.checked) {
          handleToggleBooth(booth.name, true);
        }
      });
      
      // Proceed to voting
      setCurrentStep("vote-modal");
    } else {
      // Update only the checked booths in the context
      checkedBooths.forEach(booth => {
        if (booth.checked) {
          handleToggleBooth(booth.name, true);
        }
      });
      
      // Go back to booth status to show progress
      setCurrentStep("booth-status");
    }
  };

  const handleVoteStart = () => {
    // Reset votes when starting a new voting session
    resetVotes();
    setCurrentStep("vote-intro");
  };

  // Handle voting flow steps
  const handleVotingStepContinue = () => {
    if (currentStep === "vote-intro") {
      setCurrentStep("vote-blue");
    } else if (currentStep === "vote-blue") {
      setCurrentStep("vote-orange");
    } else if (currentStep === "vote-orange") {
      setCurrentStep("vote-red");
    } else if (currentStep === "vote-red") {
      setCurrentStep("vote-summary");
    } else if (currentStep === "vote-summary") {
      setCurrentStep("thank-you");
    } else if (currentStep === "thank-you") {
      setCurrentStep("souvenir");
    }
  };

  // Mark customer as voted when completing the voting process
  const handleVoteComplete = () => {
    if (customerData) {
      // Update the customer data to reflect that they have voted
      setCustomerData({
        ...customerData,
        hasVoted: true,
      });
      setCurrentStep("thank-you");
    }
  };

  const handleSouvenirSelect = () => {
    setCurrentStep("success");
    setTimeout(() => {
      setCurrentStep("scan");
      setScanning(true);
      setCustomerData(null);
      setUnvisitedBooths([]);
    }, 3000);
  };

  const handleConfirmCustomer = () => {
    // If all booths are visited, go straight to voting
    if (isBoothComplete) {
      setCurrentStep("vote-modal");
    } else {
      // Otherwise go to booth status
      setCurrentStep("booth-status");
    }
  };

  const handleCancelCustomer = () => {
    // Reset and go back to scanning
    setCustomerData(null);
    setUnvisitedBooths([]);
    setCurrentStep("scan");
    setScanning(true);
  };

  const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-32">
      <div className="w-full max-w-md sm:max-w-4xl">
        <div className="mb-8 text-center">
          <Image
            src="/images/epic-journey.png"
            alt="Epic Journey"
            width={300}
            height={100}
            className="mx-auto"
          />
        </div>

        {currentStep === "scan" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {hasPermission === false && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error || "Camera access is required to scan QR codes."}</p>
                <p className="mt-2">
                  Please check your browser settings and allow camera access.
                </p>
              </div>
            )}

            {hasPermission === true && (
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-orange-500">
                <Webcam
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-0"
                />

                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border-2 border-white rounded-lg opacity-70"></div>
                  </div>
                )}
              </div>
            )}

            {hasPermission === null && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0920B0]"></div>
              </div>
            )}

            {/* Manual Code Entry Link */}
            <div className="mt-6 w-full">
              <div className="bg-white rounded-lg p-3 border border-[#F78B1E] text-center">
                <span className="text-[#4E4E4E]">QR Code not working? </span>
                <button
                  onClick={openManualCodeModal}
                  className="text-[#0920B0] font-medium underline focus:outline-none"
                >
                  Enter Customer Code
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "confirm-customer" && customerData && (
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Image
                  src="/images/question-mark.svg"
                  alt="Confirm"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Confirm Customer</h2>
            <div className="mb-6">
              <p>Customer Code: <span className="font-semibold">{customerData.code}</span></p>
              <p>Customer Name: <span className="font-semibold">{customerData.name}</span></p>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to proceed? You can click &quot;Proceed&quot; to continue or &quot;Cancel&quot; to go back.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleConfirmCustomer}
                className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
              >
                Proceed
              </button>
              <button
                onClick={handleCancelCustomer}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {currentStep === "booth-status" && customerData && (
          <BoothStatus
            isComplete={isBoothComplete}
            visitedCount={visitedCount}
            totalBooths={totalBooths}
            onViewUnvisited={() => setCurrentStep("booths-list")}
            onClaimSouvenir={() => setCurrentStep("souvenir")}
            onClose={() => {
              // Reset customer data and return to scanning
              setCustomerData(null);
              setCurrentStep("scan");
              setScanning(true);
            }}
          />
        )}

        {currentStep === "booths-list" && customerData && (
          <BoothsList

            onContinue={() => setCurrentStep("unvisited-booths")}
          />
        )}

        {currentStep === "unvisited-booths" && customerData && (
          <UnvisitedBooths
            customerCode={customerData.code}
            customerName={customerData.name}
            booths={unvisitedBooths.map(booth => ({
              name: booth.name,
              code: booth.code,
              checked: booth.checked || false
            }))}
            onComplete={handleBoothSelectionSubmit}
            onBoothToggle={handleBoothToggle}
          />
        )}

        {currentStep === "vote-modal" && customerData && (
          <VoteBestBoothModal
            customerHasVoted={customerData.hasVoted || false}
            onVote={handleVoteStart}
          />
        )}

        {currentStep === "vote-intro" && (
          <IntroScreen onContinue={handleVotingStepContinue} />
        )}

        {currentStep === "vote-blue" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Select Best Blue Booth</h2>
            <BoothGrid
              booths={blueBooths}
              color="blue"
            />
            <button
              onClick={handleVotingStepContinue}
              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "vote-orange" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Select Best Orange Booth</h2>
            <BoothGrid
              booths={orangeBooths}
              color="orange"
            />
            <button
              onClick={handleVotingStepContinue}
              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "vote-red" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Select Best Red Booth</h2>
            <BoothGrid
              booths={redBooths}
              color="red"
            />
            <button
              onClick={handleVotingStepContinue}
              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "vote-summary" && (
          <VoteSummary onSubmit={handleVoteComplete} />
        )}

        {currentStep === "thank-you" && (
          <ThankYouScreen onContinue={handleVotingStepContinue} />
        )}

        {currentStep === "souvenir" && (
          <SouvenirSelection
            onSelect={handleSouvenirSelect}
            onCancel={() => setCurrentStep("scan")}
          />
        )}

        {currentStep === "success" && (
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <Image
              src="/images/check-icon.svg"
              alt="Success"
              width={48}
              height={48}
              className="mx-auto mb-2"
            />
            <h2 className="text-xl font-semibold">Success</h2>
            <p className="text-gray-600">Souvenir successfully claimed</p>
            <button
              onClick={() => {
                setCurrentStep("scan");
                setScanning(true);
              }}
              className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Manual Code Entry Modal */}
      {showManualCodeModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-8 max-w-md w-full border-[3px] border-[#F78B1E]">
            <div className="flex flex-col w-full">
              <h3 className="text-center text-lg font-semibold mb-4 text-[#343434]">
                Enter Customer Code
              </h3>
              <form onSubmit={handleManualCodeSubmit} className="w-full">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="mb-4 w-full border border-gray-600 text-[#343434] rounded px-3 py-4 focus:outline-none focus:border-gray-800"
                  placeholder="Customer code"
                />
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeManualCodeModal}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#F78B1E] hover:bg-orange-600 text-[#252740] font-semibold rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AuditorPage() {
  return (
    <BestBoothProvider>
      <AuditorPageContent />
    </BestBoothProvider>
  );
}
