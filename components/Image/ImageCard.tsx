'use client'

import Image from 'next/image'
import Link from 'next/link'

const ImageCard = (
  { image, name }: { image: any; name: string } = { image: null, name: 'Image' },
) => {
  if (!image) return ''

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = `${name}.png`
    link.href = image.url
    link.target = '_blank'
    link.click()
  }

  const handleDelete = () => {
    fetch(`/api/images/delete/${image.id}`, {
      method: 'DELETE',
    }).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className="grid gap-4 bg-gray-200 p-4 rounded-xl">
      <a href="#">
        <Image src={image.url} width={500} height={500} alt={name} />
      </a>
      <div className="flex justify-between items-center w-full">
        <span className="grow text-sm text-gray-900 ">{name}</span>
        <div className="flex gap-1">
          <Link
            className="max-w-max relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 relative p-1 px-2 transition-all ease-in duration-75 "
            href={`/editor/${image.id}`}
            title="create a new image from this"
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
          <button
            className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
            title="download"
            onClick={handleDownload.bind(this)}
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <button
            className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-semibold rounded-lg shadow-md focus:outline-none"
            title="delete"
            onClick={handleDelete.bind(this)}
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCard
