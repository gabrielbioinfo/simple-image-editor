'use client'

const ImageCard = ({ image }: { image: any }) => {

  console.log(image)

  if (!image) return ''

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="p-8 rounded-t-lg" src={image.url} alt="product image" />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h3 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white">{image.name}</h3>
        </a>
        <div className="flex items-center justify-between">
          <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
        </div>
      </div>
    </div>
  )
}

export default ImageCard