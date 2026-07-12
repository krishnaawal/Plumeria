import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-petal px-6 text-center text-leaf-900">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 font-display text-4xl">Page not found</h1>
        <p className="mt-4 text-leaf-700">The page you opened is not available.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-leaf-900 px-6 py-3 font-semibold text-white">
          Return home
        </Link>
      </div>
    </main>
  );
}
