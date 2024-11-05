import ImageCard from '@/components/Image/ImageCard';
import ImagesDataService from "@/services/ImagesDataService";
import UsersDataService from '@/services/UsersDataService';
import { currentUser } from '@clerk/nextjs/server';

const ImageListComponent = async () => {
  const user = await currentUser()

  let userId = user?.id || process.env.DEFAULT_GUEST || '1'

  const userService = new UsersDataService()
  const userAuthenticated = await userService.findByClerkId(userId) as any

  const userIdAsNumber = !Number.isNaN(parseInt(userId)) ? parseInt(userId) : 1
  const id = (userAuthenticated?.id) ? userAuthenticated?.id : userIdAsNumber
  const userName = (userAuthenticated?.data?.first_name) ? userAuthenticated?.data?.first_name : 'Guest'

  const service = new ImagesDataService()
  const imagesList = await service.findAll(
    parseInt(process.env.DEFAULT_TENANT || '1'),
    id
  )

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-lg bold p-5 pl-0'>{userName}'s Galery</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagesList && imagesList.map(image => (
          <ImageCard key={`image-${image.id}`} image={image} />
        ))}
      </div>
    </div>
  )
}

export default ImageListComponent