"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-petal px-6 text-center text-leaf-900">
      <div className="max-w-md">
        <h1 className="font-display text-4xl">Something went wrong</h1>
        <p className="mt-4 text-leaf-700">Please try again. Your order data is kept on this device.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-leaf-900 px-6 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
