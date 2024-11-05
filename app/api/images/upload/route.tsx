import { pinata } from '@/config/pinata'
import ImagesDataService from '@/services/ImagesDataService'
import UsersDataService from '@/services/UsersDataService'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    const { url, cid, uploadData } = await handleImage(req)
    const clerkId = user?.id || process.env.DEFAULT_GUEST

    const userService = new UsersDataService()
    const userOnDB = await userService.findByClerkId(clerkId!)

    const userId = userOnDB?.id || parseInt(clerkId!)
    const imageService = new ImagesDataService()
    const image = await imageService.createImage({
      tenantId: parseInt(process.env.DEFAULT_TENANT || '1'),
      name: new Date().getTime().toString(),
      status: true,
      userId,
      url,
      cid,
      uploadData,
    })

    if (!image) throw new Error('Error on save image')

    return NextResponse.json({ image }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload Error: ' + error.message }, { status: 500 })
  }
}

const expires = parseInt(process.env.DEFAULT_EXPIRATING_TIME || '315576000')

const handleImage = async (req: NextRequest) => {
  const data = await req.formData()
  const file = data.get('file') as any
  const uploadData = await pinata.upload.file(file)
  const url = await pinata.gateways.createSignedURL({
    cid: uploadData.cid,
    expires,
  })

  return { url, cid: uploadData.cid, uploadData }
}
