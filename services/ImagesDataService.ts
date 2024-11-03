import { ImageInsertModel, images } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';

export default class ImagesDataService {
  
  async findAll(tenantId:number, userId: number){
    return await db.select().from(images).where(
      and(
        eq(images.tenantId, tenantId),
        eq(images.userId, userId)
      )
    ).execute();
  }

  async createImage(imageData: ImageInsertModel ){
    const newImages = await db.insert(images).values(imageData).returning().execute()
    await this.updateImage(newImages[0].id, { 'source_image_id': newImages[0].id })
    return newImages[0]
  }

  async updateImage(imageId: number, image: Record<string, unknown> ){
    await db.update(images)
        .set(image)
        .where(
          and(
            eq(images.id, imageId),
          )
        )
        .execute()
  }

  async deleteImage(imageId: number){
    await db.delete(images)
        .where(
          and(
            eq(images.id, imageId)
          )
        )
        .execute()
  }
}