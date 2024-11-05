import { SignInButton, UserButton } from '@clerk/nextjs'

import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import EditorMenu from '../Editor/Menu'

const Header = () => {
  let user: any = null
  currentUser().then((cUser) => (user = cUser))
  const isSignedIn = !!user

  return (
    <header className="flex flex-col gap-2 space-between p-4 bg-gray-800 text-white min-w-60">
      <div className="flex flex-col gap-2 grow">
        <Link href="/" className="text-xmd font-bold">
          Simple Image Editor
        </Link>
        <hr />
        <EditorMenu />
      </div>
      <nav className="">
        <hr />
        {isSignedIn ? (
          <div className="flex py-4 gap-3 items-center text-sm">
            <UserButton />
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <SignInButton /> <span>Welcome Guest</span>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
