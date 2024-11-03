import { CanvasElementType, useImageStore } from "@/storages/imageStore"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import EditorTools from "./Tools"

export interface LineCoordinates {
  startX: number
  startY: number
  endX: number
  endY: number
}

export interface LineObject {
  name: string
  color: string
  lines: LineCoordinates[]
}

const MAX_SCALE = parseFloat(process.env.MAX_SCALE || '2.0')
const MIN_SCALE = parseFloat(process.env.MIN_SCALE || '0.1')

const CanvasImage = () => {

  /**  image state */
  const { id, image: imageUrl, drawLineColor: lineColor, history, futureHistory,
    setHistory, setFutureHistory, setLayers } = useImageStore((state) => state)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(false) // Flag para carga inicial
  const [loading, setLoading] = useState(true) // Estado de carregamento

  /**  image transformations */
  const [rotation, setRotation] = useState<number>(0)
  const [initialScale, setInitialScale] = useState(1)
  const [scale, setScale] = useState(1)


  /**  canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const prevContainerSize = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  /**  canvas pan */
  const [isPanning, setIsPanning] = useState(false)
  const [canvasCursor, setCanvasCursor] = useState('cursor-crosshair')
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  /**  canvas draw */
  const [minimalTimeFormDrawing, setMinimalTimeFormDrawing] = useState(200)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canDraw, setCanDraw] = useState(false)
  const [startDraw, setStartDraw] = useState({ x: 0, y: 0 })
  const [lines, setLines] = useState<LineObject[]>([])
  const [lineCoordinates, setLineCoordinates] = useState<LineCoordinates[]>([])

  /** Resizes the canvas to fit the container size */
  const resizeCanvasToContainer = () => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) {
      console.warn("Canvas or container not available.")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.warn("Context not found!")
      return
    }

    const pixelRatio = window.devicePixelRatio || 1
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight - 130

    const sameSize = prevContainerSize.current.width === containerWidth &&
      prevContainerSize.current.height === containerHeight
    if (sameSize) return

    const containerHaveNoSize = containerWidth === 0 || containerHeight === 0
    if (containerHaveNoSize) {
      console.warn("The container is missing width or heigth.")
      return
    }

    prevContainerSize.current = { width: containerWidth, height: containerHeight }

    // canvas dimensions using the device pixel ratio
    canvas.width = containerWidth * pixelRatio
    canvas.height = containerHeight * pixelRatio
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(pixelRatio, pixelRatio)

    setContext(ctx)

  }

  /** Resize the canvas when the window is resized */
  useLayoutEffect(() => {
    resizeCanvasToContainer()

    const resizeObserver = new ResizeObserver(resizeCanvasToContainer)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener("resize", resizeCanvasToContainer)
    return () => {
      window.removeEventListener("resize", resizeCanvasToContainer)
      resizeObserver.disconnect()
    }
  }, [])

  /** Loads the image and starts the canvas project */
  useEffect(() => {
    if (context && imageUrl && !isInitialLoad) {
      const image = new Image()
      image.src = imageUrl
      image.onload = () => {
        setOriginalImage(image)

        const canvas = canvasRef.current
        if (!canvas) {
          // TODO respond with the error
          setLoading(false)
          return
        }

        const canvasWidth = canvas.clientWidth
        const canvasHeight = canvas.clientHeight

        const scaleX = canvasWidth / image.width
        const scaleY = canvasHeight / image.height
        const fitScale = Math.min(scaleX, scaleY, 1) // Não aumentar além de 1

        setScale(fitScale)
        setInitialScale(fitScale)

        const imgWidthScaled = image.width * fitScale
        const imgHeightScaled = image.height * fitScale
        const offsetX = (canvasWidth - imgWidthScaled) / 2
        const offsetY = (canvasHeight - imgHeightScaled) / 2

        setOffset({ x: offsetX, y: offsetY })

        setIsInitialLoad(true) // Marca que a carga inicial foi feita
        setLoading(false) // Termina o carregamento

        redrawCanvas(image, context)
      }
      image.onerror = () => {
        console.error("Falha ao carregar a imagem:", imageUrl)
        setLoading(false) // Termina o carregamento mesmo se a imagem falhar
      }
    }
  }, [imageUrl, context, isInitialLoad])

  /** Redraw the canvas when any important property changes */
  useEffect(() => {
    if (context && originalImage && !loading) {
      redrawCanvas(originalImage, context)
    }
  }, [context, originalImage, lines, offset, scale, loading, rotation])

  /** chooses the cursor based on the current state */
  useEffect(() => {
    if (isPanning) {
      setCanvasCursor('cursor-move')
      return
    }
    if (canDraw) {
      setCanvasCursor('cursor-crosshair')
      return
    }
    setCanvasCursor('cursor-default')
  }, [isPanning, canDraw])

  /** adds image to history and layer */
  useEffect(() => {

    const alreadyExists = history.find((element) => element?.data.properties.url === imageUrl)
    if (!imageUrl || alreadyExists) return

    console.log({ imageUrl, alreadyExists })
    const imageElement = {
      name: 'Image',
      id: id,
      src: imageUrl
    }
    setHistory([...history,
    {
      type: CanvasElementType.IMAGE,
      data: {
        name: 'Image', properties: {
          url: imageUrl
        }
      }
    }])

  }, [imageUrl])

  /** Redraw the canvas with elements and layers */
  const redrawCanvas = (image: HTMLImageElement, context: CanvasRenderingContext2D) => {
    if (!context || !image) return

    // Reseta as transformações
    context.setTransform(1, 0, 0, 1, 0, 0)

    // Limpa o canvas completamente
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    // Aplica as transformações de pan e zoom
    context.setTransform(scale, 0, 0, scale, offset.x, offset.y)

    // Salva o contexto antes de aplicar a rotação
    context.save()

    // Calcula o centro da imagem para rotação
    const imageCenterX = image.width / 2
    const imageCenterY = image.height / 2

    // Converte o ângulo de rotação de graus para radianos
    const rotationRadians = (rotation * Math.PI) / 180

    // Aplica a rotação
    context.translate(imageCenterX, imageCenterY) // Move o contexto para o centro da imagem
    context.rotate(rotationRadians) // Rotaciona o contexto
    context.translate(-imageCenterX, -imageCenterY) // Move o contexto de volta

    // Desenha a imagem no canvas na posição (0, 0)
    context.drawImage(image, 0, 0, image.width, image.height)

    // Restaura o contexto para remover a rotação
    context.restore()

    // Desenha as linhas armazenadas
    lines.forEach((line) => {
      context.strokeStyle = line.color
      context.lineWidth = 2
      context.beginPath()
      line.lines.forEach((line) => {
        context.moveTo(line.startX, line.startY)
        context.lineTo(line.endX, line.endY)
      })
      context.stroke()
    })
  }

  /** starts pan and draw */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1) { // Botão do meio para pan
      e.preventDefault()
      setIsPanning(true)
      setStartPan({ x: e.clientX, y: e.clientY })
      setInitialOffset({ ...offset })
      return
    }

    const rect = canvasRef.current?.getBoundingClientRect()
    if (e.button === 0 && canDraw && rect && context) { // Botão esquerdo para desenhar
      setIsDrawing(true)
      const x = (e.clientX - rect.left) / scale - offset.x / scale
      const y = (e.clientY - rect.top) / scale - offset.y / scale
      setStartDraw({ x, y })
    }
  }

  /** ends pan and draw */
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (isDrawing && rect && context) {
      setIsDrawing(false)

      const x = (e.clientX - rect.left) / scale - offset.x / scale
      const y = (e.clientY - rect.top) / scale - offset.y / scale

      const lineName = `line-${lines.length + 1}`
      const finalCoordinates = [
        ...lineCoordinates,
        {
          name: lineName,
          startX: startDraw.x,
          startY: startDraw.y,
          endX: x,
          endY: y
        }]

      setLines([...lines, { color: lineColor, lines: finalCoordinates } as LineObject])
      setLineCoordinates([])

      setHistory([...history,
      {
        type: CanvasElementType.LINE,
        data: {
          name: lineName,
          properties: {
            finalCoordinates
          }
        }
      }])
    }
    setIsPanning(false)
  }

  /** handles moviments for pan and draw */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const dx = e.clientX - startPan.x
      const dy = e.clientY - startPan.y
      setOffset({
        x: initialOffset.x + dx,
        y: initialOffset.y + dy,
      })
      return
    }

    const rect = canvasRef.current?.getBoundingClientRect()
    if (isDrawing && context && rect) {
      const x = (e.clientX - rect.left) / scale - offset.x / scale
      const y = (e.clientY - rect.top) / scale - offset.y / scale

      // Desenha uma linha do ponto inicial para o ponto atual
      context.strokeStyle = lineColor
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(startDraw.x, startDraw.y)
      context.lineTo(x, y)
      context.stroke()

      // Atualiza o ponto inicial para o próximo segmento da linha
      setStartDraw({ x, y })
      setLineCoordinates([
        ...lineCoordinates,
        { startX: startDraw.x, startY: startDraw.y, endX: x, endY: y }
      ])
    }
  }

  /** handles rotation for the selected layer */
  const handleRotate = (direction: number) => {

    setRotation((prevRotation) => {
      let newRotation = prevRotation
      if (direction === 0) newRotation = prevRotation - 90
      if (direction === 1) newRotation = prevRotation + 90

      if (newRotation === 360 || newRotation === -360) newRotation = 0

      setHistory([...history, {
        type: CanvasElementType.ROTATION,
        data: {
          name: `Rot ${direction === 0 ? 'left' : 'right'}`,
          properties: {
            rotation: newRotation,
            prevRotation
          }
        }
      }])
      return newRotation
    })
  }

  /** handles zoom for canvas */
  const handleZoom = (direction: number = 1) => {

    setScale((prevScale) => {
      let newScale = prevScale
      if (direction === 0) newScale = Math.max(prevScale - 0.1, MIN_SCALE)
      if (direction === 1) newScale = Math.min(prevScale + 0.1, MAX_SCALE)
      return newScale
    })

    let newScale = scale
    if (direction === 0) newScale = Math.max(scale - 0.1, MIN_SCALE)
    if (direction === 1) newScale = Math.min(scale + 0.1, MAX_SCALE)

    setHistory([...history, {
      type: CanvasElementType.SCALE,
      data: {
        name: `Zoom ${direction === 0 ? 'out' : 'in'}`,
        properties: {
          scale: newScale,
          prevScale: scale
        }
      }
    }])
  }

  /** handles undo with the history */
  const handleUndo = () => {
    const [lastElement] = history.slice(-1)
    if (!lastElement) return

    setHistory([...history.slice(0, -1)])
    setFutureHistory([...futureHistory, lastElement])



    if (lastElement.type === CanvasElementType.LINE) {
      setLines((prevLines) => prevLines.slice(0, -1))
    }

    if (lastElement.type === CanvasElementType.ROTATION) {
      setRotation(lastElement.data.properties.prevRotation)
    }

    if (lastElement.type === CanvasElementType.SCALE) {
      console.log({ lastElement, scale })
      setScale(lastElement.data.properties.prevScale)
    }
  }

  /** handles redo with the futureHistory */
  const handleRedo = () => {
    const [lastElement] = futureHistory.slice(-1)
    console.log('REDOOOOOOOOOOO', { futureHistory, lastElement })
    if (!lastElement) return

    setFutureHistory([...futureHistory.slice(0, -1)])
    setHistory([...history, lastElement])

    console.log({ history: [...history.slice(0, -1)], future: [...futureHistory, lastElement] })

    if (lastElement.type === CanvasElementType.LINE) {
      const finalCoordinates = lastElement.data.properties.finalCoordinates
      setLines([...lines, { color: lineColor, lines: finalCoordinates } as LineObject])
    }

    if (lastElement.type === CanvasElementType.ROTATION) {
      setRotation(lastElement.data.properties.prevRotation)
    }

    if (lastElement.type === CanvasElementType.SCALE) {
      console.log({ lastElement, scale })
      setScale(lastElement.data.properties.prevScale)
    }
  }

  /** handles the reset of the canvas */
  const handleReset = () => {
    if (!originalImage || !context)
      return

    context?.reset()
    setLines([])
    setRotation(0)
    setScale(initialScale)
    setOffset({ x: initialOffset.x, y: initialOffset.y })
    redrawCanvas(originalImage, context)

    setHistory([])
    setLayers([])
  }


  /** toggles the draw mode */
  const handleToggleDraw = () => {
    setCanDraw(!canDraw)
  }

  /** download file from the browser */
  const handleDownload = () => {
    const canvasUrl = canvasRef.current?.toDataURL();

    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvasUrl!
    link.click();
  }

  const sendImageToServer = () => {

    const canvasUrl = canvasRef.current?.toDataURL();
    if (!canvasUrl) {
      console.error("Error getting the canvas image!");
      return;
    }

    const formData = new FormData()
    formData.append("file", canvasUrl)

    fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error uploading the image! Please try again later.");
        return response.json();
      })
      .then((data) => {
        console.log("upload success:", data);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div ref={containerRef} className="grow flex flex-col h-screen w-full overflow-hidden">
      <div className="w-full pb-3">
        <EditorTools
          canDraw={canDraw}
          canDrawAction={handleToggleDraw}
          downloadAction={handleDownload.bind(this)}
          isPanning={isPanning}
          redoAction={handleRedo}
          resetAction={handleReset}
          rotation={rotation}
          rotateLeftAction={() => handleRotate(0)}
          rotateRightAction={() => handleRotate(1)}
          saveAction={sendImageToServer}
          scale={scale}
          undoAction={handleUndo}
          zoomInAction={() => handleZoom(1)}
          zoomOutAction={() => handleZoom(0)}
        />
      </div>
      <div className="relative flex-grow">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 text-gray-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading image...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex-grow bg-gray-100 border border-black ${canvasCursor}`}
        />
      </div>

      <div id="toast-bottom-right" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800" role="alert">
        <div className="text-sm font-normal">Bottom right positioning.</div>
      </div>
      <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span className="sr-only">Error icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">Item has been deleted.</div>
        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CanvasImage