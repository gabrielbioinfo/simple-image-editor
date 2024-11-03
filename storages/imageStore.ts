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
  layers: CanvasElement[];

  setId: (id: number) => void;
  setImage: (image: string | null) => void;
  setDrawLineColor: (color: string) => void;
  setLayers: (layers: CanvasElement[]) => void;
  setHistory: (history: CanvasElement[]) => void;
  
  addElementToHistory: (type: CanvasElementType, properties: any) => void;
  addElementToLayer: (type: CanvasElementType, properties: any) => void;

  removeLastElementFromHistory: () => void;
  removeLastElementFromLayer: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  id: null,
  image: null,
  drawLineColor: 'black',
  reset: false,
  layers: [],
  history: [],

  setId: (id) => set({ id }),
  setImage: (image) => set({ image }),
  setDrawLineColor: (drawLineColor) => set({ drawLineColor }),
  setLayers: (layers) => set({ layers }),
  setHistory: (history) => set({ history }),

  addElementToHistory: (type, properties) => {
    set(state => ({
      history: [...state.history, {
        type,
        data: {
          name: properties?.name || 'Unknown',
          properties
        }
      }]
    }));
  },

  addElementToLayer: (type, properties) => {
    set(state => ({
      layers: [...state.layers, {
        type,
        data: {
          name: properties?.name || 'Unknown',
          properties
        }
      }]
    }));
  },

  removeLastElementFromHistory: () => 
    set(state => ({
      layers: state.history.slice(0, -1)
    })),
  
  removeLastElementFromLayer: () => 
    set(state => ({
      layers: state.layers.slice(0, -1)
    })),

}));
