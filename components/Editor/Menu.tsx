'use client'

import { useImageStore } from "@/storages/imageStore"
import Link from "next/link"

const EditorMenu = () => {
  const { history, layers } = useImageStore(state => state)

  return (
    <section className="flex flex-col items-left py-3 w-full">
      <div className="px-3 pb-2">
        <Link href="/" className="text-sm font-bold">Back to galery</Link>
      </div>
      <hr />
      {/* <div className="px-3 pb-2">
        <div>Layers</div>
        <div className="px-3 pb-2">
          {layers && layers.map(layer =>
            (<div key={`layer-${layer.data.properties.id}`}>{layer.data.name}</div>)
          )}
        </div>
      </div>
      <hr /> */}
      <div className="px-3 pb-2">
        <div>History</div>
        <div className="px-3 pb-2">
          {history && history.map(hist =>
            (<div key={`layer-${hist.data.properties.id}`}>{hist.data.name}</div>)
          )}
        </div>
      </div>
    </section>
  )
}

export default EditorMenu