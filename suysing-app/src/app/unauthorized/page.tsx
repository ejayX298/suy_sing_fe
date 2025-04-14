export default function UnauthorizedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="mt-2 text-gray-700">
        You don’t have permission to access this page.
      </p>
    </main>
  );
}
