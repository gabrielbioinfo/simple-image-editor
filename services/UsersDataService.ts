import { users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';

export default class UsersDataService {
  
  async findByClerkId(clerkId:string){
    const userList = await db.select().from(users).where(eq(users.clerkId, clerkId)).execute();
    if(!userList.length) return null
    return userList[0]
  }

  async findAll(tenantId:number){
    return await db.select().from(users).where(eq(users.tenantId, tenantId)).execute();
  }

  async createUser(tenantId:number, userData: Record<string, any> ){
    await db.insert(users).values({
      tenantId: tenantId,
      clerkId: userData.id,
      data: userData,
      guest: false
    })
  }

  async updateUser(tenantId: number, userId: string, userData: Record<string, any> ){
    await db.update(users)
        .set({ data: userData })
        .where(
          and(
            eq(users.clerkId, userId),
            eq(users.tenantId, tenantId)
          )
        )
        .execute()
  }

  async deleteUserByClerkId(tenantId: number, userId: string){
    await db.delete(users)
        .where(
          and(
            eq(users.clerkId, userId),
            eq(users.tenantId, tenantId)
          )
        )
        .execute()
  }

  async deleteUserById(tenantId: number, userId: number){
    await db.delete(users)
        .where(
          and(
            eq(users.id, userId),
            eq(users.tenantId, tenantId)
          )
        )
        .execute()
  }
}