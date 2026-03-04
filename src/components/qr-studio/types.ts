export type ElementType = "text" | "image" | "qr";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  zIndex: number;

  // Text specific
  content?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold" | "900";

  // Image specific
  src?: string;

  // QR specific
  qrFgColor?: string;
  qrBgColor?: string;
}

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[];
}
