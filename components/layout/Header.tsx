'use client'


import Link from 'next/link'
import EditorMenu from '../Editor/Menu'

const Header = () => (
  <header className="flex flex-col gap-2 space-between p-4 bg-gray-800 text-white min-w-60">
    <div className="flex flex-col gap-2 grow">
      <Link href="/" className="text-xmd font-bold">Simple Image Editor</Link>
      <hr />
      <EditorMenu />
    </div>
    {/* <nav className="">
        <hr />
        {isSignedIn ? <div className='flex py-4 gap-3 items-center text-sm'><UserButton /> Welcome</div> : <SignInButton />}
      </nav> */}
  </header>
)

export default Header