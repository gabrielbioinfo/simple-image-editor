import EditorImage from './Image'

const Editor = ({ id }: { id: number } = { id: 0 }) => {

  return (
    <div className="flex grow gap-1.5 items-left bg-gray-800 text-white">
      <div className='flex flex-col grow p-3 gap-1.5 '>
        <EditorImage id={id} />
      </div>
    </div>
  )
}

export default Editor