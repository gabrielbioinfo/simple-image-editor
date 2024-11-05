import UsersDataService from '@/services/UsersDataService'

export async function GET() {
  try {
    const service = new UsersDataService()
    const users = await service.findAll(1)

    return new Response(JSON.stringify(users), { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, {
      status: 400,
    })
  }
}
