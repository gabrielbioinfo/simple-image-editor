import Editor from "@/components/Editor"

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {

  const imageId = +(await (params)).id || 0

  return (
    <main className="flex flex-col flex-grow container mx-auto">
      <Editor id={imageId} />
    </main>
  )
}
