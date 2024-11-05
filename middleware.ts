import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-app', 'simple-image-editor')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
