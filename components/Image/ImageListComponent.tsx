// app/galery/page.js (ou onde estiver sua página Next.js)

import ImageCard from '@/components/Image/ImageCard'
import ImagesDataService from '@/services/ImagesDataService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ImageListComponent = async () => {
  const userId = process.env.DEFAULT_GUEST || '1'
  const userIdAsNumber = !Number.isNaN(parseInt(userId)) ? parseInt(userId) : 1
  const id = userIdAsNumber
  const userName = 'Guest'

  const service = new ImagesDataService()
  const imagesList = await service.findAll(
    parseInt(process.env.DEFAULT_TENANT || '1'),
    id,
  )

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg bold p-5 pl-0">{userName}&apos;s Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagesList &&
          imagesList.map((image, index) => (
            <ImageCard
              key={`image-${image.id}`}
              image={image}
              name={`image-${index + 1}`}
            />
          ))}
      </div>
    </div>
  )
}

export default ImageListComponent
