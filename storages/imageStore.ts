import { create } from 'zustand';

export interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export enum CanvasElementType {
  LINE = 'LINE',
  IMAGE = 'IMAGE',
  ROTATION = 'ROTATION',
  SCALE = 'SCALE',
}

export type CanvasElement = {
  type: CanvasElementType;
  data: {
    name: string;
    properties: any;
  };
}

interface ImageStore {
  id: number | null;
  image: string | null;
  drawLineColor: string;
  history: CanvasElement[];
  futureHistory: CanvasElement[];
  layers: CanvasElement[];
  
  setId: (id: number) => void;
  setImage: (image: string | null) => void;
  setDrawLineColor: (color: string) => void;
  setLayers: (layers: CanvasElement[]) => void;
  setHistory: (history: CanvasElement[]) => void;
  setFutureHistory: (history: CanvasElement[]) => void;
  
}

export const useImageStore = create<ImageStore>((set) => ({
  id: null,
  image: null,
  drawLineColor: 'black',
  reset: false,
  layers: [],
  history: [],
  futureHistory: [],

  setId: (id) => set({ id }),
  setImage: (image) => set({ image }),
  setDrawLineColor: (drawLineColor) => set({ drawLineColor }),
  setLayers: (layers) => set({ layers }),
  setHistory: (history) => set({ history }),
  setFutureHistory: (futureHistory) => set({ futureHistory }),

}));
