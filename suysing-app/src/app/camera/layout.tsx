export const metadata = {
  title: 'QR Scanner - Suy Sing',
  description: 'Scan QR codes with your device camera',
};

export default function CameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      {children}
    </section>
  );
}
