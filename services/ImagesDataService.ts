import { ImageInsertModel, images } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { db } from '../db'

export default class ImagesDataService {
  async findById(id: number) {
    const list = await db.select().from(images).where(eq(images.id, id)).execute()
    if (!list.length) return null
    return list[0]
  }

  async findAll(tenantId: number, userId: number) {
    return await db
      .select()
      .from(images)
      .where(and(eq(images.tenantId, tenantId), eq(images.userId, userId)))
      .execute()
  }

  async createImage(imageData: ImageInsertModel) {
    const sequence: any = await db.execute<{ next_val: number }>(
      "SELECT nextval('images_id_seq') as next_val",
    )
    let id = sequence && sequence.rows.length ? sequence.rows[0].next_val : null

    imageData.id = imageData.id || id
    imageData.sourceImageId = imageData.id || id
    const newImages = await db.insert(images).values(imageData).returning().execute()
    return newImages[0]
  }

  async updateImage(imageId: number, image: Record<string, unknown>) {
    await db
      .update(images)
      .set(image)
      .where(and(eq(images.id, imageId)))
      .execute()
  }

  async deleteImage(imageId: number) {
    await db
      .delete(images)
      .where(and(eq(images.id, imageId)))
      .execute()
  }
}
