"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import BoothHoppingComplete from "@/components/auditor/BoothHoppingComplete";
import MissingCard from "@/components/auditor/MissingCard";
import BoothStatus from "@/components/auditor/BoothStatus";
import BoothsList from "@/components/auditor/BoothsList";
import SouvenirSelection from "@/components/auditor/SouvenirSelection";
import VoteBestBoothModal from "@/components/auditor/VoteBestBoothModal";
import { useBooths } from "@/context/BoothsContext";
import { useRouter } from "next/navigation";

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
    | "booth-status"
    | "booths-list"
    | "vote-modal"
    | "souvenir"
    | "success"
  >("scan");
  
  // Get booth data from context
  const { visitedCount, totalBooths } = useBooths();
  
  // Initialize router for navigation
  const router = useRouter();
  
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

  const handleScan = useCallback(async (data: string) => {
    const customerCode = data.trim();
    
    const mockCustomerData = {
      code: customerCode || "JUAN02",
      name: "Juan Dela Cruz",
      hasVoted: false, 
    };
    
    setCustomerData(mockCustomerData);
    
    const isComplete = visitedCount === totalBooths;
    setIsBoothComplete(isComplete);
    
    setCurrentStep("booth-status");
    
  }, [visitedCount, totalBooths]);

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

  const handleVoteStart = () => {
    router.push("/auditor/booth-vote");
  };

  const handleSouvenirSelect = () => {
    setCurrentStep("success");
    setTimeout(() => {
      setCurrentStep("scan");
      setScanning(true);
      setCustomerData(null);
    }, 3000);
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



        {currentStep === "booth-status" && customerData && (
          <BoothStatus
            isComplete={isBoothComplete}
            visitedCount={visitedCount}
            totalBooths={totalBooths}
            onViewUnvisited={() => setCurrentStep("booths-list")}
            onClose={() => {
              setCustomerData(null);
              setCurrentStep("scan");
              setScanning(true);
            }}
          />
        )}

        {currentStep === "booths-list" && customerData && (
          <BoothsList
            onBack={() => setCurrentStep("booth-status")}
          />
        )}




        {currentStep === "vote-modal" && customerData && (
          <VoteBestBoothModal
            customerHasVoted={customerData.hasVoted || false}
            onVote={handleVoteStart}
          />
        )}

        {currentStep === "souvenir" && (
          <SouvenirSelection
            onSelect={handleSouvenirSelect}
            onCancel={() => setCurrentStep("scan")}
            onContinue={() => setCurrentStep("success")}
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
  return <AuditorPageContent />;
}
