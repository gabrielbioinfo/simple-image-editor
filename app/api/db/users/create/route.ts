import { UserModel } from '@/db/schema'
import UsersDataService from '@/services/UsersDataService'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const body = JSON.stringify(payload)
    
    const service = new UsersDataService()
    const user = await service.createUser(1, {
      tenantId: 1,
      clerkId: null,
      data: body,
    } as UserModel)

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, {
      status: 400,
    })
  }
}
