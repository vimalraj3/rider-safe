"use client";

import { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { CanvasState, CanvasElement } from "./types";
import QRCode from "qrcode";

export function CanvasArea({
  state,
  updateElement,
  selectedId,
  setSelectedId,
  canvasRef,
  qrUrl,
}: {
  state: CanvasState;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  qrUrl: string;
}) {
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  // Generate QR Codes based on elements requesting it
  useEffect(() => {
    state.elements.forEach((el) => {
      if (el.type === "qr") {
        QRCode.toDataURL(qrUrl, {
          width: 500,
          margin: 1,
          color: {
            dark: el.qrFgColor || "#000000",
            light: el.qrBgColor || "#ffffff",
          },
        }).then((url) => {
          setQrImages((prev) => ({ ...prev, [el.id]: url }));
        });
      }
    });
  }, [qrUrl, state.elements]);

  return (
    <div
      ref={canvasRef as React.Ref<HTMLDivElement>}
      className="relative shadow-2xl overflow-hidden transition-all"
      style={{
        width: state.width,
        height: state.height,
        backgroundColor: state.backgroundColor,
        backgroundImage: state.backgroundImage
          ? `url(${state.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={(e) => {
        // Deselect if clicking directly on the canvas background
        if (
          e.target === canvasRef.current ||
          (e.target as HTMLElement).id === "canvas-bg"
        ) {
          setSelectedId(null);
        }
      }}
    >
      <div id="canvas-bg" className="absolute inset-0 z-0" />

      {state.elements.map((el) => {
        const isSelected = selectedId === el.id;

        return (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            onDragStop={(e, d) => {
              updateElement(el.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateElement(el.id, {
                width: ref.style.width,
                height: ref.style.height,
                ...position,
              });
            }}
            onClick={(e: any) => {
              e.stopPropagation();
              setSelectedId(el.id);
            }}
            bounds="parent"
            style={{ zIndex: el.zIndex }}
            className={`
              ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-black/10 z-[100]" : "hover:ring-1 hover:ring-primary/50"}
              transition-shadow group
            `}
          >
            <div className="w-full h-full relative flex items-center justify-center">
              {el.type === "text" && (
                <p
                  style={{
                    fontSize: `${el.fontSize}px`,
                    color: el.color,
                    fontWeight: el.fontWeight,
                    width: "100%",
                    height: "100%",
                    margin: 0,
                    lineHeight: 1.2,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    wordBreak: "break-word",
                  }}
                  className="font-sans leading-tight"
                >
                  {el.content}
                </p>
              )}

              {el.type === "image" && el.src && (
                <img
                  src={el.src}
                  alt="overlay element"
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}

              {el.type === "image" && !el.src && (
                <div className="w-full h-full bg-muted/50 border border-dashed text-xs text-muted-foreground flex items-center justify-center text-center p-2">
                  Image Upload Pending
                </div>
              )}

              {el.type === "qr" && qrImages[el.id] && (
                <img
                  src={qrImages[el.id]}
                  alt="QR Code"
                  className="w-full h-full object-contain pointer-events-none rounded-sm"
                />
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
