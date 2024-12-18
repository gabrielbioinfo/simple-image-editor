import Editor from '@/components/Editor'
import ImagesDataService from '@/services/ImagesDataService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const imageId = +(await params).id || 0

  const imageService = new ImagesDataService()
  const image = await imageService.findById(imageId)

  let url = undefined
  if (image?.url) url = await getImageFromServer(image.url)

  return (
    <main className="flex flex-col flex-grow container mx-auto">
      <Editor id={imageId} imageUrl={url} />
    </main>
  )
}

const getImageFromServer = async (url: string) => {
  try {
    const response = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } })
    if (!response.ok) {
      console.error(`Download error: ${response.status} ${response.statusText}`)
      return undefined
    }

    const contentType = response.headers.get('content-type')
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataURL = `data:${contentType};base64,${base64}`
    return dataURL
  } catch (err) {
    console.error(err)
    return undefined
  }
}
