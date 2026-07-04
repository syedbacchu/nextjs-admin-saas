import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-purple-800 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-purple-100 mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-purple-800 px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}