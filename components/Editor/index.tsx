'use client'

import { useImageStore } from '../../storages/imageStore'
import EditorImage from './Image'

const Editor = ({ id, imageUrl }: { id: number, imageUrl: string | undefined } = { id: 0, imageUrl: undefined }) => {
  const setImage = useImageStore(state => state.setImage)
  setImage(imageUrl || null)

  return (
    <div className="flex grow gap-1.5 items-left bg-gray-800 text-white">
      <div className='flex flex-col grow p-3 gap-1.5 '>
        <EditorImage id={id} />
      </div>
    </div>
  )
}

export default Editor