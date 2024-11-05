import UsersDataService from '@/services/UsersDataService'

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = Number(url.searchParams.get('id'))

    if (isNaN(id)) {
      throw new Error('ID inválido')
    }
    const payload = await req.json()
    const body = JSON.stringify({ ...payload, 123: 123, id })
    console.log({ body, req, id })

    const service = new UsersDataService()
    await service.deleteUserById(1, id)

    return new Response(body, { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, {
      status: 400,
    })
  }
}
