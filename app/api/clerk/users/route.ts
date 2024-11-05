import ClerkService from '@/services/ClerkService'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local',
    )
  }

  try {
    const headerPayload = await headers()
    const clerkService = new ClerkService(headerPayload)
    await clerkService.receiveEvent(req)
    return new Response('', { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
}
