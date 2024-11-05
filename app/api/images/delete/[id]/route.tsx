import { pinata } from '@/config/pinata'
import ImagesDataService from '@/services/ImagesDataService'
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
  try {
    const { id } = await params
    if (!id) throw new Error('Image not informed')

    const imagesService = new ImagesDataService()
    const image = await imagesService.findById(id)
    if (!image) throw new Error('Image not found')

    await imagesService.deleteImage(id)

    await pinata.files.delete([
      (image.uploadData as Record<string, any>).id ?? ''
    ])

    return NextResponse.json('', { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


