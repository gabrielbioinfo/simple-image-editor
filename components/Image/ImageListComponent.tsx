import ImageCard from '@/components/Image/ImageCard'
import ImagesDataService from '@/services/ImagesDataService'
import UsersDataService from '@/services/UsersDataService'

const ImageListComponent = async () => {
  const userId = process.env.DEFAULT_GUEST || '1'

  const userService = new UsersDataService()
  const userAuthenticated = (await userService.findByClerkId(userId)) as any

  const userIdAsNumber = !Number.isNaN(parseInt(userId)) ? parseInt(userId) : 1
  const id = userAuthenticated?.id ? userAuthenticated?.id : userIdAsNumber
  const userName = userAuthenticated?.data?.first_name
    ? userAuthenticated?.data?.first_name
    : 'Guest'

  const service = new ImagesDataService()
  const imagesList = await service.findAll(
    parseInt(process.env.DEFAULT_TENANT || '1'),
    id,
  )

  console.log(imagesList)
  console.log('----------------------')

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg bold p-5 pl-0">{userName}&apos;s Galery</h3>
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
