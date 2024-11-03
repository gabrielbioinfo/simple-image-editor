import ImageCard from '@/components/ImageCard';
import ImagesDataService from "@/services/ImagesDataService";

const ImageListComponent = async () => {
  const service = new ImagesDataService()
  const imagesList = await service.findAll(1, 7)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {imagesList && imagesList.map(image => (
        <ImageCard key={`image-${image.id}`} image={image} />
      ))}
    </div>
  )
}

export default ImageListComponent
