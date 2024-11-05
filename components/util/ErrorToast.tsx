'use client';

const ErrorToast = ({ error, closeAction }: { error: any, closeAction: () => void }) => {

  const handleClose = () => {
    if (closeAction)
      closeAction()
  }

  return (
    <div id="toast-bottom-right" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-white-400 dark:divide-gray-700 dark:bg-red-500" role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-500 bg-gray-100 rounded-lg dark:dark:bg-red-200 dark:text-red-600">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span className="sr-only">{error.message || 'An error occurred in your last action'}</span>
      </div>
      <div className="grow ms-3 text-sm font-normal border-none">{error.message || 'An error occurred in your last action'}</div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-white-400 hover:text-white-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 dark:text-white-500 dark:hover:text-white dark:bg-red-600 dark:hover:bg-red-700" data-dismiss-target="#toast-danger" aria-label="Close"
        onClick={handleClose}>
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default ErrorToast