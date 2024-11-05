import ImageListComponent from '@/components/Image/ImageListComponent';
import Loading from '@/components/util/Loading';
import { Suspense } from 'react';

export default async function HomePage() {

  return (
    <main className="flex-grow container mx-auto px-4">
      <Suspense fallback={<Loading dark={true} />}>
        <ImageListComponent />
      </Suspense>
    </main>
  )
}