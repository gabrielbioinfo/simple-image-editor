'use client'


import { useImageStore } from "@/storages/imageStore";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const sendImageToServer = (formData: FormData) => {
  fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error uploading the image! Please try again later.");
      return response.json();
    })
    .then((data) => {
      console.log("upload success:", data);
    })
    .catch((error) => console.error(error));
}

export default function EditorImageUploader() {
  const setImage = useImageStore((state) => state.setImage);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    // sendImageToServer(formData);
    setImage(URL.createObjectURL(file));

  }, []);


  useCallback(() => {
    if (!preview) return

    console.log('Realmente a imagem foi carregada:', preview)
  }, [preview])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

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
  );
}
