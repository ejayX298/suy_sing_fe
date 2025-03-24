import Image from "next/image";

export default function MyQrPage() {
  return (
    <div className="flex min-h-screen flex-col items-center pt-10 pb-20 px-10">
      {/* Epic Journey Image */}
      <div className="relative w-full h-40 mb-2 sm:h-56">
        <Image
          src="/images/epic-journey.png"
          alt="Epic Journey to Success - Suy Sing Suki 2025"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* QR Code Card */}
      <div className="p-6 w-full max-w-3xl">
        <div className="flex justify-center mb-4">
          <div className="relative w-80 h-96 sm:w-96 sm:h-[28rem]">
            <Image src="/images/qr-code.png" alt="QR Code" fill priority />
          </div>
        </div>
      </div>
    </div>
  );
}
