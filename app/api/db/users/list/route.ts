import UsersDataService from "@/services/UsersDataService";

export async function GET(req: Request) {
  try {
    const payload = await req.json()
    const body = JSON.stringify(payload)
    console.log({ body, req })

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
