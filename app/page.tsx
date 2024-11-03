import ImageListComponent from '@/components/ImageListComponent'
import { config } from 'dotenv'
import { Suspense } from 'react'

config({ path: ".env.local" })

export default async function HomePage() {
  return (
    <main className="flex-grow container mx-auto px-4">
      <h1>Image Editor</h1>
      <Suspense fallback="loading"><ImageListComponent /></Suspense>
    </main>
  )
}