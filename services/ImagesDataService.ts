import { ImageInsertModel, images } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { db } from '../db'

export default class imagesDataService {
  
  async createImage(imageData: ImageInsertModel ){
    const newImages = await db.insert(images).values(imageData).returning().execute()
    
    await this.updateImage(imageData.tenantId, newImages[0].id, { 'source_image_id': newImages[0].id })
  }

  async updateImage(tenantId: number, imageId: number, image: Record<string, unknown> ){
    await db.update(images)
        .set(image)
        .where(
          and(
            eq(images.id, imageId),
          )
        )
        .execute()
  }

  async deleteImage(tenantId: number, imageId: number){
    await db.delete(images)
        .where(
          and(
            eq(images.id, imageId)
          )
        )
        .execute()
  }
}