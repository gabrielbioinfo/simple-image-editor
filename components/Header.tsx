'use client'

import { useImageStore } from '@/storages/imageStore'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

import Link from 'next/link'
import { useState } from 'react'
import EditorMenu from './Editor/Menu'

const Header = () => {
  const { isSignedIn } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setImage, setLayers, setHistory } = useImageStore(state => state)

  const handleNewUpload = (event: any) => {
    setImage(null)
    setLayers([])
    setHistory([])
  }

  return (
    <header className="flex flex-col gap-2 space-between p-4 bg-gray-800 text-white min-w-60">
      <div className="flex flex-col gap-2 grow">
        <Link href="/" className="text-xmd font-bold">Simple Image Editor</Link>
        <hr />
        <EditorMenu />
      </div>
      <nav className="">
        <hr />
        {isSignedIn ? <div className='flex py-4 gap-3 items-center text-sm'><UserButton /> Welcome</div> : <SignInButton />}
      </nav>
    </header>
  )
}

export default Header