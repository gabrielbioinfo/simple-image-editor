'use client'

const Loading = ({ dark }: { dark: boolean } = { dark: true }) => {


  return <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25 z-10">
    <div className="text-center">
      <svg
        className={`animate-spin h-8 w-8 mx-auto ${dark ? 'text-white' : 'text-gray-800'}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>

      <p className={`mt-2 ${dark ? 'text-white' : 'text-gray-800'}`}>Loading...</p>
    </div>
  </div>
}

export default Loading