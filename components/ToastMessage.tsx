'use client';

const ToastMessage = ({ message, closeAction }: { message: string, closeAction: Function }) => {

  const handleClose = () => {
    if (closeAction)
      closeAction()
  }

  return (
    <div id="toast-bottom-right" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-white-400 dark:divide-gray-700 dark:bg-gray-500" role="alert">
      <div className="grow ms-3 text-sm font-normal border-none">{message || '...'}</div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-white-400 hover:text-white-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-white-500 dark:hover:text-white dark:bg-gray-600 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close"
        onClick={handleClose}>
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default ToastMessage