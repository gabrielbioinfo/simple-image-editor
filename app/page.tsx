import ImageListComponent from '@/components/ImageListComponent';
import { currentUser } from '@clerk/nextjs/server';
import { Suspense } from 'react';

export default async function HomePage() {
  const user = await currentUser()
  if (user) console.log('User', user)

  return (
    <main className="flex-grow container mx-auto px-4">
      <h1>Image Editor</h1>
      <Suspense fallback="loading"><ImageListComponent /></Suspense>
    </main>
  )
}