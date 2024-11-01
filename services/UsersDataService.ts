import { users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';

export default class UsersDataService {
  
  async createUser(tenantId:number, userData: Record<string, any> ){
    await db.insert(users).values({
      tenantId: tenantId,
      clerkId: userData.id,
      data: userData,
      guest: false
    });
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
        .execute();
  }

  async deleteUser(tenantId: number, userId: string){
    await db.delete(users)
        .where(
          and(
            eq(users.clerkId, userId),
            eq(users.tenantId, tenantId)
          )
        )
        .execute();
  }
}