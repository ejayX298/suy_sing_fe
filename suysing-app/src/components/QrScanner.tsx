"use client";

import { useEffect, useRef } from "react";
import jsQR from "jsqr";

interface QrScannerProps {
  onScan: (data: string) => void;
}

export default function QrScanner({ onScan }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(scan);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    const scan = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;

          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              onScan(code.data);
              return;
            }
          }
        }
        requestAnimationFrame(scan);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="h-[300px] w-full rounded-lg object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-lg" />
    </div>
  );
}
