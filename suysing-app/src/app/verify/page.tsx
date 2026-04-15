"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { customerQr } from "@/services/api";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc") || "";

  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [mobileNo, setMobileNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // if (!customer_hash_code) {
    //   router.push("/unauthorized");
    //   return;
    // }

    const verified = localStorage.getItem("account_verified");
    const storedHash = localStorage.getItem("hash_code");
    if (verified === customer_hash_code && storedHash === customer_hash_code) {
      router.push(`/my-qr/?cc=${customer_hash_code}`);
      return;
    }

    const fetchCustomer = async () => {
      const result = await customerQr.getCustomerForVerification(
        customer_hash_code
      );
      if (result.success && result.mobile_no) {
        setMobileNo(result.mobile_no);
      } else {
        router.push("/unauthorized");
      }
      setLoading(false);
    };

    fetchCustomer();
  }, [customer_hash_code, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length > 0) {
      const newDigits = ["", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      const focusIndex = Math.min(pasted.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const entered = digits.join("");
    if (entered.length < 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    setSubmitting(true);

    const lastFour = mobileNo.slice(-4);
    if (entered === lastFour) {
      localStorage.setItem("account_verified", customer_hash_code);
      router.push(`/my-qr/?cc=${customer_hash_code}`);
    } else {
      setError("The digits you entered do not match. Please try again.");
      setDigits(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center">
        <Image
          src="/images/new-logo.webp"
          alt="Suy Sing 80 to Infinity"
          width={220}
          height={120}
          className="mb-4"
          priority
        />

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Account Verification
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          To access your account, enter the{" "}
          <span className="font-bold text-gray-900">
            last 4 digits of your registered mobile number
          </span>
          . This is also found on your Suki Day Confirmation Email/Viber.
        </p>

        <div className="flex gap-4 mb-6" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-[#E8952F] focus:outline-none transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || digits.some((d) => !d)}
          className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "#E8952F" }}
        >
          {submitting ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
