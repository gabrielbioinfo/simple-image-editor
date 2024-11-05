import Editor from "@/components/Editor"
import ImagesDataService from "@/services/ImagesDataService"

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {

  const imageId = +(await (params)).id || 0

  const imageService = new ImagesDataService()
  const image = await imageService.findById(imageId)

  let url = undefined
  if (image?.url)
    url = await getImageFromServer(image.url)

  console.log({ url })

  return (
    <main className="flex flex-col flex-grow container mx-auto">
      <Editor id={imageId} imageUrl={url} />
    </main>
  )
}

const getImageFromServer = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Falha ao baixar a imagem: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataURL = `data:${contentType};base64,${base64}`;
    return dataURL;
  } catch (erro) {
    return undefined
  }

}
