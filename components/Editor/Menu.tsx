'use client'
import { useImageStore } from "@/storages/imageStore"
import Link from "next/link"

const EditorMenu = () => {
  const imageStore = useImageStore.getState()
  // const pathname = usePathname()


  const cleanImageStore = () => {
    imageStore.setId(0)
    imageStore.setImage(null)
    imageStore.setLayers([])
    imageStore.setHistory([])
    imageStore.setFutureHistory([])
  }

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-left py-3 w-full">
        <button className="max-w-max relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <Link className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
            href="/" title='View Galery'>View Galery</Link>
        </button>
        <button className="max-w-max relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <Link className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
            onClick={cleanImageStore.bind(this)} href="/editor/0" title='Upload New Image'>Upload New Image</Link>
        </button>
      </section>
      {/* {pathname.includes('/editor/') && imageStore.history &&
        <section className="flex flex-col items-left py-3 w-full">
          <div className="px-3 pb-2">
            <h3 className="text-sm font-bold">History</h3>
          </div>
          <hr />
          <div className="px-3 pb-2">
            <div className="px-3 pb-2">
              {imageStore.history.reverse().map((hist, index) =>
                (<div key={`history-${index}`}>{hist.data.name}</div>)
              )}
            </div>
          </div>
        </section>
      } */}
    </div>
  )
}

export default EditorMenu