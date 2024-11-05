'use client'

import { useImageStore } from "@/storages/imageStore"
import { useEffect, useState } from "react"


type EditorToolsProps = {
  canDraw?: boolean,
  canDrawAction?: () => void,
  cropAction?: () => void,
  downloadAction?: () => void,
  isPanning?: boolean,
  rotation?: number,
  rotateLeftAction?: () => void,
  rotateRightAction?: () => void,
  redoAction?: () => void,
  resetAction?: () => void,
  saveAction?: () => void,
  scale?: number,
  undoAction?: () => void,
  zoomInAction?: () => void,
  zoomOutAction?: () => void,
}

const MAX_SCALE = parseFloat(process.env.MAX_SCALE || '2.0')
const MIN_SCALE = parseFloat(process.env.MIN_SCALE || '0.1')

const EditorTools = ({
  canDraw
  , canDrawAction
  , cropAction
  , downloadAction
  , isPanning
  , rotation
  , rotateLeftAction
  , rotateRightAction
  , redoAction
  , resetAction
  , saveAction
  , scale
  , undoAction
  , zoomInAction
  , zoomOutAction
}: EditorToolsProps = {
    canDraw: true
    , canDrawAction: () => { }
    , cropAction: () => { }
    , downloadAction: () => { }
    , isPanning: false
    , rotation: 0
    , rotateLeftAction: () => { }
    , rotateRightAction: () => { }
    , redoAction: () => { }
    , resetAction: () => { }
    , saveAction: () => { }
    , scale: 1
    , undoAction: () => { }
    , zoomInAction: () => { }
    , zoomOutAction: () => { }
  }) => {
  const { drawLineColor, setDrawLineColor, history, futureHistory } = useImageStore((state) => state);
  const [localColor, setLocalColor] = useState(drawLineColor)
  const [enableChangeColor, setEnableChangeColor] = useState(true)

  // simple debouncer for color change
  useEffect(() => {
    if (!enableChangeColor) return

    setDrawLineColor(localColor)
    setTimeout(() => {
      setEnableChangeColor(true)
    }, 500)

  }, [localColor, enableChangeColor, setEnableChangeColor, setDrawLineColor])


  const handleRotateLeft = (evt: any) => {
    evt.preventDefault()
    if (rotateLeftAction)
      rotateLeftAction()
  }

  const handleRotateRight = (evt: any) => {
    evt.preventDefault()
    if (rotateRightAction)
      rotateRightAction()
  }

  const handleCrop = (evt: any) => {
    evt.preventDefault()
    if (cropAction)
      cropAction()
  }

  const handleDownload = (evt: any) => {
    evt.preventDefault()
    if (downloadAction)
      downloadAction()
  }

  const handleCanDraw = (evt: any) => {
    evt.preventDefault()
    if (canDrawAction)
      canDrawAction()
  }

  const handleChangeDrawLineColor = (evt: any) => {
    evt.preventDefault()
    setLocalColor(evt.target.value)
  }

  const handleSave = (evt: any) => {
    evt.preventDefault()
    if (saveAction)
      saveAction()
  }

  const handleZoomIn = (evt: any) => {
    evt.preventDefault()
    if (zoomInAction)
      zoomInAction()
  }

  const handleZoomOut = (evt: any) => {
    evt.preventDefault()
    if (zoomOutAction)
      zoomOutAction()
  }

  const handleUndo = (evt: any) => {
    evt.preventDefault()
    if (undoAction)
      undoAction()
  }

  const handleRedo = (evt: any) => {
    evt.preventDefault()
    if (redoAction)
      redoAction()
  }

  const handleReset = (evt: any) => {
    evt.preventDefault()
    if (resetAction)
      resetAction()
  }

  return (
    <form className="flex gap-1.5 items-left bg-gray-600 p-3 rounded-lg">


      <div className="flex gap-1.5 items-left">

        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="rotate left"
          onClick={handleRotateLeft.bind(this)}>
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 20.5C17.1944 20.5 21 16.6944 21 12C21 7.30558 17.1944 3.5 12.5 3.5C7.80558 3.5 4 7.30558 4 12C4 13.5433 4.41128 14.9905 5.13022 16.238M1.5 15L5.13022 16.238M6.82531 12.3832L5.47107 16.3542L5.13022 16.238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center">
          {rotation !== undefined ? rotation.toFixed(1) : '-'}
        </div>
        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="rotate right"
          onClick={handleRotateRight.bind(this)}>
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 20.5C6.80558 20.5 3 16.6944 3 12C3 7.30558 6.80558 3.5 11.5 3.5C16.1944 3.5 20 7.30558 20 12C20 13.5433 19.5887 14.9905 18.8698 16.238M22.5 15L18.8698 16.238M17.1747 12.3832L18.5289 16.3542L18.8698 16.238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className="hidden flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="crop"
          onClick={handleCrop.bind(this)}>
          <svg className="size-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor">
            <g id="crop">
              <g id="crop_2">
                <path id="Combined Shape" fillRule="evenodd" clipRule="evenodd" d="M32.96 36H13C12.4474 36 12 35.5529 12 35V5C12 4.44772 11.5523 4 11 4C10.4477 4 10 4.44772 10 5V10H5C4.44772 10 4 10.4477 4 11C4 11.5523 4.44772 12 5 12H10V35C10 36.6577 11.3432 38 13 38H32.96C33.5123 38 33.96 37.5523 33.96 37C33.96 36.4477 33.5123 36 32.96 36ZM35.0008 12H15.0048C14.4525 12 14.0048 11.5523 14.0048 11C14.0048 10.4477 14.4525 10 15.0048 10H35.0008C36.6576 10 38.0008 11.3423 38.0008 13V36H43C43.5523 36 44 36.4477 44 37C44 37.5523 43.5523 38 43 38H38.0008V43C38.0008 43.5523 37.5531 44 37.0008 44C36.4485 44 36.0008 43.5523 36.0008 43V37.0404C36.0003 37.027 36 37.0135 36 37C36 36.9865 36.0003 36.973 36.0008 36.9596V13C36.0008 12.4471 35.5534 12 35.0008 12Z" fill="#ffffff" />
              </g>
            </g>
          </svg>
        </button>

        <div className="flex items-center">
          <div>
            <svg strokeWidth={1.5} stroke="currentColor" className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Interface / Line_L">
                <path id="Vector" d="M12 19V5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </div>

        <div className={`flex gap-0.5 items-center`}>
          <button
            className={`flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none`}
            title="draw"
            onClick={handleCanDraw.bind(this)}>
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>

          <div className="flex items-center">
            <input disabled={!canDraw} onChange={handleChangeDrawLineColor.bind(this)} type="color" className="p-1 w-8 block bg-white border cursor-pointer rounded-md disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border-neutral-700" id="hs-color-input" defaultValue={drawLineColor} title="Choose your color"></input>
          </div>
        </div>

        <div className="flex items-center">
          <div>
            <svg strokeWidth={1.5} stroke="currentColor" className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Interface / Line_L">
                <path id="Vector" d="M12 19V5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </div>

      </div>

      <div className="flex gap-1.5 items-left">
        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="zoom minus"
          onClick={handleZoomOut.bind(this)}
          disabled={!!scale && scale <= MIN_SCALE}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
          </svg>
        </button>
        <div className="flex items-center">
          {!!scale && scale ? scale.toFixed(1) : '-'}
        </div>
        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="zoom plus"
          onClick={handleZoomIn.bind(this)}
          disabled={!!scale && scale >= MAX_SCALE}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>

        <div className="flex items-center">
          <div>
            <svg strokeWidth={1.5} stroke="currentColor" className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Interface / Line_L">
                <path id="Vector" d="M12 19V5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 items-left">
        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="undo"
          disabled={!history || history.length <= 0}
          onClick={handleUndo.bind(this)}>
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </button>

        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="redo"
          disabled={!futureHistory || futureHistory.length <= 0}
          onClick={handleRedo.bind(this)}>
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
          </svg>
        </button>

        <button
          className="flex items-center p-1 px-2 gap-0.5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="reset"
          disabled={!history || history.length <= 1}
          onClick={handleReset.bind(this)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div className="text-sm">reset</div>
        </button>
      </div>

      <div className="grow justify-end flex gap-1.5 items-left items-center">
        {!!isPanning && <span className="sm">pan</span>}
        {!!canDraw && !isPanning && <span className="sm">draw</span>}

        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="save in the cloud"
          onClick={handleSave.bind(this)}>
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <span className="text-sm">&nbsp;Save in the cloud</span>
        </button>

        <button className="flex items-center p-1 px-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-semibold rounded-lg shadow-md focus:outline-none"
          title="download"
          onClick={handleDownload.bind(this)}>
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="text-sm">&nbsp;Download</span>
        </button>

      </div>
    </form>
  )
}

export default EditorTools
