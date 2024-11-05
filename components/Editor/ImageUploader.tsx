'use client'

import { useImageStore } from '@/storages/imageStore'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function EditorImageUploader() {
  const setImage = useImageStore((state) => state.setImage)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append('file', file)
      setImage(URL.createObjectURL(file))
    },
    [setImage],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className="grow border-2 border-dashed p-4 rounded-lg border-blue-400 flex flex-col items-center justify-center"
    >
      <input {...getInputProps()} />
      <p className="text-gray-500">
        Drag and drop your image or click here to select one file.
      </p>
    </div>
  )
}
