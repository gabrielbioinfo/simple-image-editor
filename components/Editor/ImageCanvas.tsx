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
  const { id, image: imageUrl, drawLineColor: lineColor,
    addElementToHistory, addElementToLayer, removeLastElementFromHistory,
    setHistory, setLayers } = useImageStore((state) => state)
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
    if (!imageUrl) return

    const imageElement = {
      name: 'Image',
      id: id,
      src: imageUrl
    }
    addElementToHistory(CanvasElementType.IMAGE, imageElement)
    // addElementToLayer(CanvasElementType.IMAGE, imageElement)
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

      const lineElement = {
        name: lineName,
      }
      addElementToHistory(CanvasElementType.LINE, lineElement)
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
      if (direction === 0) {
        return prevRotation - 90
      } else if (direction === 1) {
        return prevRotation + 90
      }
      return prevRotation
    })
  }

  /** handles undo with the history */
  const handleUndo = () => {
    setLines((prevLines) => prevLines.slice(0, -1))
    removeLastElementFromHistory()
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

  /** handles the zoom in */
  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.1, MAX_SCALE)
      return newScale
    })
  }

  /** handles the zoom out */
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.1, MIN_SCALE)
      return newScale
    })
  }

  /** toggles the draw mode */
  const handleToggleDraw = () => {
    setCanDraw(!canDraw)
  }

  /** download file from the browser */
  const handleDownload = () => {
    let canvasUrl = canvasRef.current?.toDataURL();

    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvasUrl!
    link.click();
  }

  return (
    <div ref={containerRef} className="grow flex flex-col h-screen w-full overflow-hidden">
      <div className="w-full pb-3">
        <EditorTools
          canDraw={canDraw}
          canDrawAction={handleToggleDraw}
          isPanning={isPanning}
          resetAction={handleReset}
          rotateLeftAction={() => handleRotate(0)}
          rotateRightAction={() => handleRotate(1)}
          scale={scale}
          undoAction={handleUndo}
          zoomInAction={handleZoomIn}
          zoomOutAction={handleZoomOut}
          downloadAction={handleDownload.bind(this)}
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
    </div>
  )
}

export default CanvasImage