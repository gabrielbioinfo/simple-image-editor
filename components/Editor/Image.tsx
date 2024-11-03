'use client'

import { useImageStore } from "@/storages/imageStore";
import { useEffect } from "react";
import ImageCanvas from "./ImageCanvas";
import EditorImageUploader from "./ImageUploader";

const EditorImage = ({ id }: { id: number } = { id: 0 }) => {
  const { image, drawLineColor, setId } = useImageStore((state) => state);

  useEffect(() => {
    setId(id)
  }, [id])

  return (
    <section className="grow flex">
      {!image ? <EditorImageUploader /> : <ImageCanvas />}
    </section>
  )
}

export default EditorImage