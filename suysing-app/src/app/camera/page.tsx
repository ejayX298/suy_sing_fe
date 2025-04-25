"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import { boothVisitService } from "@/services/api";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";

export default function CameraPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const manualCodeModalRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessModalDouble, setShowSuccessModalDouble] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showManualCodeModal, setShowManualCodeModal] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);
  const [isRender, setIsRender] = useState(false);
  const [isFirstBooth, setIsFirstBooth] = useState(false);
  const [isFirstDoubleZone, setIsFirstDoubleZone] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);

  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");

  let stored_hash_code: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("hash_code") || "";
  }

  // Get booth data from context
  // const { booths, visitedCount, totalBooths, handleVisitBooth } = useBooths();

  useEffect(() => {
    if (customer_hash_code && stored_hash_code) {
      if (customer_hash_code == stored_hash_code) {
        setIsRender(true);

        // Fetch customer record
        getCustomerRecord();

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
              setError("Camera Access Needed. We couldn't access your camera.");
              setHasPermission(false);
            });
        }

        return () => {
          setScanning(true);
        };
      } else {
        router.push(`/unauthorized`);
      }
    } else {
      router.push(`/unauthorized`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processQRCode = React.useCallback(
    async (data: string) => {
      const boothVisitResult = await submitBoothVisit(data.trim());

      if (boothVisitResult.success) {
        if (customerData?.totalBoothVisited === 0) {
          if (boothVisitResult.is_double_zone === 1) {
            setIsFirstDoubleZone(true);
            setSuccessMessage(
              `Double points! You've stamped ${boothVisitResult?.booth_name} booth and earned 2 points.`
            );
            setShowSuccessModal(true);
          } else {
            setIsFirstBooth(true);
            setSuccessMessage(
              `Nice! You've stamped ${boothVisitResult?.booth_name} booth.`
            );
            setShowSuccessModal(true);
          }
        } else if (boothVisitResult.is_double_zone === 1) {
          setSuccessMessage(
            `Double points! You've stamped ${boothVisitResult?.booth_name} booth and earned 2 points.`
          );
          setShowSuccessModal(true);
        } else {
          setSuccessMessage(
            `Nice! You've stamped the ${boothVisitResult?.booth_name} booth.`
          );
          setShowSuccessModal(true);
        }
      }

      // Refresh customerData
      getCustomerRecord();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerData?.totalBoothVisited]
  );

  const captureAndScanQRCode = useCallback(() => {
    if (!scanning || !isStreamReady) return;

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
            setIsStreamReady(false);
            processQRCode(qrCode.data);
            return;
          }
        } catch (error) {
          console.error("QR processing error:", error);
        }
      }
    }

    if (scanning && isStreamReady) {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [scanning, isStreamReady, processQRCode]);

  useEffect(() => {
    if (hasPermission && scanning && isStreamReady) {
      requestAnimationFrame(captureAndScanQRCode);
    }
  }, [hasPermission, scanning, isStreamReady, captureAndScanQRCode]);

  const handleProceed = () => {
    if (isFirstBooth) {
      setIsFirstBooth(false);
      setSuccessMessage(
        "Great Job! You've stamped your first booth. Visit and scan all the other booths to complete this section."
      );
      setShowSuccessModal(true);
    } else if (isFirstDoubleZone) {
      setIsFirstDoubleZone(false);
      setShowSuccessModalDouble(true);
      setSuccessMessage("Each booth visited will be counted as double.");
    } else {
      setShowSuccessModal(false);
      setShowSuccessModalDouble(false);
      router.push(`/?cc=${customer_hash_code}`);
    }
  };

  const openManualCodeModal = () => {
    setManualCode("");
    setShowManualCodeModal(true);
  };

  const closeManualCodeModal = () => {
    setShowManualCodeModal(false);
    setManualCode("");
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    if (
      manualCodeModalRef.current &&
      !manualCodeModalRef.current.contains(e.target as Node)
    ) {
      closeManualCodeModal(); // Close modal if clicked outside manualCodeModalRef
    }
  };

  const handleManualCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualCode.trim()) {
      return;
    }

    // call api for booth visit
    const boothVisitResult = await submitBoothVisit(manualCode.trim());

    if (boothVisitResult.success) {
      if (customerData?.totalBoothVisited === 0) {
        if (boothVisitResult.is_double_zone === 1) {
          setIsFirstDoubleZone(true);
          setSuccessMessage(
            `Double points! You've stamped ${boothVisitResult?.booth_name} booth and earned 2 points.`
          );
          setShowSuccessModal(true);
        } else {
          setIsFirstBooth(true);
          setSuccessMessage(
            `Nice! You've stamped ${boothVisitResult?.booth_name} booth.`
          );
          setShowSuccessModal(true);
        }
      } else if (boothVisitResult.is_double_zone === 1) {
        setSuccessMessage(
          `Double points! You've stamped ${boothVisitResult?.booth_name} booth and earned 2 points.`
        );
        setShowSuccessModal(true);
      } else {
        setSuccessMessage(
          `Nice! You've stamped the ${boothVisitResult?.booth_name} booth.`
        );
        setShowSuccessModal(true);
      }
    } else {
      // Invalid code - close the modal without proceeding
      closeManualCodeModal();
    }

    // Refresh customerData
    getCustomerRecord();
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  const submitBoothVisit = async (data: string) => {
    // Inititalize and show loader
    showLoader();

    const post_data = [data];
    try {
      const submitBoothVisitResult = await boothVisitService.submitBoothVisit(
        post_data
      );

      if (submitBoothVisitResult.success) {
        Swal.close(); // close the loading alert

        let booth_name = "";
        let is_double_zone = 0;
        if (submitBoothVisitResult.results.length > 0) {
          booth_name = submitBoothVisitResult?.results[0].booth?.name || "";
          is_double_zone =
            submitBoothVisitResult?.results[0].booth?.is_double_zone || "";
        }

        return {
          success: true,
          booth_name: booth_name,
          is_double_zone: is_double_zone,
        };
      } else {
        Swal.close(); // close the loading alert
        setShowManualCodeModal(false);
        showMessage("0", submitBoothVisitResult.message);

        return {
          success: false,
        };
      }
    } catch {
      Swal.close(); // close the loading alert
      setShowManualCodeModal(false);
      showMessage(
        "0",
        "Unable to process your request. Please try again later."
      );

      return {
        success: false,
      };
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

        // Show completion modal if all booths are visited
        if (mapCustomerData.isDoneVisit === 1) {
          setShowCompletionModal(true);
        }

        return true;
      } else {
        return false;
      }
    } catch {
      return false;
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
      allowOutsideClick: false, // disable outside click fot the close modal
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        // set the scanning to true
        setScanning(true);
        setIsStreamReady(true);
      }
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

  // Dont render page if customer data is empty or no customer record
  if (!isRender) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-28 flex flex-col">
      {/* Booths Progress Counter */}
      <div className="mb-6">
        <BoothsProgress
          visited={customerData?.totalBoothVisited || 0}
          total={customerData?.totalBooths || 0}
          viewList="Tap to view the list of visited and unvisited booths."
        />
      </div>

      {/* Camera Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {hasPermission === false && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error || "Camera access is required to scan QR codes."}</p>
            <div className="mt-2 flex gap-2">
              <p>Please allow camera access to continue.</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#0920B0] font-medium underline focus:outline-none"
              >
                Allow Camera Access
              </button>
            </div>
          </div>
        )}

        {hasPermission === true && (
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-orange-500">
            {/* Loading state while camera initializes */}
            {!isStreamReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0920B0] mb-2"></div>
                Initializing camera...
              </div>
            )}

            <Webcam
              ref={webcamRef}
              videoConstraints={videoConstraints}
              className={`absolute inset-0 w-full h-full object-cover ${
                isStreamReady ? "opacity-100" : "opacity-0"
              }`}
              onUserMedia={() => {
                console.log("Webcam stream ready.");
                setIsStreamReady(true);
              }}
              onUserMediaError={(error: string | DOMException) => {
                console.error("Webcam UserMedia Error:", error);
                if (typeof error === "string") {
                  setError(`Could not access camera: ${error}`);
                } else if (error.name === "NotAllowedError") {
                  setError(
                    "Camera permission was denied. Please allow access in browser settings."
                  );
                } else if (error.name === "NotFoundError") {
                  setError(
                    "No camera found on this device, or the preferred camera is unavailable."
                  );
                } else if (error.name === "NotReadableError") {
                  setError(
                    "Camera is already in use by another application or browser tab."
                  );
                } else {
                  setError(
                    `Could not access camera: ${error.message || error.name}`
                  );
                }
                setHasPermission(false);
                setIsStreamReady(false);
              }}
            />

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            />

            {scanning && isStreamReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg px-6 py-14 max-w-md w-full border-[3px] border-[#F78B1E]"
            ref={manualCodeModalRef}
          >
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
                  src={
                    successMessage.includes("Double points")
                      ? "/images/double-star.svg"
                      : "/images/check.svg"
                  }
                  alt="Success"
                  width={100}
                  height={100}
                />
              </div>
              <p className="mb-6 text-[#343434] text-[20px]">
                {/*  <span className="font-bold">Nice! </span> */}
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

      {/* Success Modal for Double zone */}
      {showSuccessModalDouble && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border border-[#F78B1E]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/images/double-star.svg"
                  alt="Success"
                  width={100}
                  height={100}
                />
              </div>
              <p className="mb-6 text-[#343434] text-[20px]">
                <span className="font-bold">Welcome to the Double Zone! </span>
              </p>
              <p className="mb-6 text-[#343434] text-[20px]">
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

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border border-[#F78B1E]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/images/trophy.svg"
                  alt="Success"
                  width={100}
                  height={100}
                />
              </div>
              <p className="mb-6 text-[#343434] text-[20px]">
                <span className="font-bold">Congratulations! </span>You&apos;ve
                completed your Booth Hopping Card. Click Best Booth to vote now!
              </p>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowSuccessModal(false);
                  setShowSuccessModalDouble(false);
                  router.push(`/best-booth?cc=${customer_hash_code}`);
                }}
                className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-black font-semibold rounded-md"
              >
                Vote for Best Booth
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
