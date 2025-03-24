"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths } from "@/context/BoothsContext";

export default function CameraPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showManualCodeModal, setShowManualCodeModal] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // Get booth data from context
  const { booths, visitedCount, totalBooths, handleVisitBooth } = useBooths();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      // Request camera permission
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

    return () => {
      setScanning(false);
    };
  }, []);

  const processQRCode = React.useCallback(
    (data: string) => {
      // Check if the QR code data is a valid booth ID
      // Format could be "booth:id123" or just "id123"
      const boothId = data.includes("booth:") ? data.split("booth:")[1] : data;

      // Find booth with this ID
      const booth = booths.find((b) => b.id === boothId);

      if (booth) {
        // Check if booth is already visited
        if (booth.visited) {
          setSuccessMessage(
            "You've already scanned this booth. Please find another booth to scan."
          );
          setShowSuccessModal(true);
          return;
        }

        // Mark booth as visited
        handleVisitBooth(boothId);

        // Set message - first booth visited or another one
        if (visitedCount === 0) {
          setSuccessMessage(
            "You've stamped your first booth. Visit and scan all the other booths to complete this section."
          );
        } else {
          setSuccessMessage(`You've stamped the ${booth.name} booth.`);
        }

        setShowSuccessModal(true);
      } else {
        // QR code not recognized - just continue scanning
        setScanning(true);
      }
    },
    [booths, handleVisitBooth, visitedCount]
  );

  const captureAndScanQRCode = React.useCallback(() => {
    if (!scanning) return;

    const videoElement = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (videoElement && canvas && videoElement.readyState === 4) {
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      // Set canvas dimensions to match video
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

            // Process the QR code data
            processQRCode(qrCode.data);
          }
        } catch (error) {
          console.error("QR processing error:", error);
        }
      }
    }

    if (scanning) {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [scanning, processQRCode]);

  useEffect(() => {
    if (hasPermission && scanning) {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [hasPermission, captureAndScanQRCode, scanning]);

  const handleProceed = () => {
    setShowSuccessModal(false);
    setScanning(true);
  };

  const openManualCodeModal = () => {
    setManualCode("");
    setShowManualCodeModal(true);
  };

  const closeManualCodeModal = () => {
    setShowManualCodeModal(false);
    setManualCode("");
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualCode.trim()) {
      return;
    }

    // Find booth with this ID
    const booth = booths.find((b) => b.id === manualCode.trim());

    if (booth) {
      // Check if booth is already visited
      if (booth.visited) {
        setSuccessMessage(
          "You've already scanned this booth. Please find another booth to scan."
        );
        setShowSuccessModal(true);
        setShowManualCodeModal(false);
        return;
      }

      // Mark booth as visited
      handleVisitBooth(manualCode.trim());

      // Set message - first booth visited or another one
      if (visitedCount === 0) {
        setSuccessMessage(
          "You've stamped your first booth. Visit and scan all the other booths to complete this section."
        );
      } else {
        setSuccessMessage(`You've stamped the ${booth.name} booth.`);
      }

      setShowSuccessModal(true);
      setShowManualCodeModal(false);
    } else {
      // Invalid code - close the modal without proceeding
      closeManualCodeModal();
    }
  };

  const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-28 flex flex-col">
      {/* Booths Progress Counter */}
      <div className="mb-6">
        <BoothsProgress
          visited={visitedCount}
          total={totalBooths}
          viewList="Tap to view the list of visited and unvisited booths."
        />
      </div>

      {/* Camera Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
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
              Enter Booth Code
            </button>
          </div>
        </div>
      </div>

      {/* Manual Code Entry Modal */}
      {showManualCodeModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-14 max-w-md w-full border-[3px] border-[#F78B1E]">
            <div className="flex flex-col w-full">
              <h3 className="text-start text-sm mb-2 text-[#343434]">
                Enter Booth Code
              </h3>
              <form onSubmit={handleManualCodeSubmit} className="w-full">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="mb-2 w-full border border-gray-600 text-[#343434] rounded px-3 py-4 focus:outline-none focus:border-gray-800"
                />
                <button
                  type="submit"
                  className="w-full py-3 mt-3 bg-[#F78B1E] hover:bg-orange-600 text-[#252740] font-semibold rounded-md"
                >
                  Next
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border border-[#F78B1E]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/images/check.svg"
                  alt="Success"
                  width={100}
                  height={100}
                />
              </div>
              <p className="mb-6 text-[#343434] text-[20px]">
                <span className="font-bold">Great job! </span>
                {successMessage}
              </p>
              <button
                onClick={handleProceed}
                className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-black font-semibold rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
