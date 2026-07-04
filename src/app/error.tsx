"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-purple-800 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-white mb-4">500</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Something went wrong!</h2>
        <p className="text-purple-100 mb-8 text-lg">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block bg-white text-purple-800 px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors duration-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-200 border-2 border-white"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}