"use client";

import { useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { CanvasState, CanvasElement } from "./types";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CanvasArea } from "./canvas-area";
import {
  Download,
  Plus,
  Image as ImageIcon,
  Type,
  Settings2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";
import { ImageCropModal } from "./image-crop-modal";

export function QRStudio({
  qrUrl,
  defaultName,
}: {
  qrUrl: string;
  defaultName: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCroppingBg, setIsCroppingBg] = useState(false);

  const [state, setState] = useState<CanvasState>({
    width: 320,
    height: 480,
    backgroundColor: "#ffffff",
    elements: [
      {
        id: "qr-code-main",
        type: "qr",
        x: 60,
        y: 140,
        width: 200,
        height: 200,
        zIndex: 10,
        qrFgColor: "#000000",
        qrBgColor: "#ffffff",
      },
      {
        id: "name-text",
        type: "text",
        x: 60,
        y: 80,
        width: 200,
        height: 50,
        zIndex: 11,
        content: defaultName,
        fontSize: 24,
        color: "#000000",
        fontWeight: "bold",
      },
      {
        id: "instruction-text",
        type: "text",
        x: 40,
        y: 360,
        width: 240,
        height: 40,
        zIndex: 11,
        content: "Scan for Emergency Info",
        fontSize: 14,
        color: "#dc2626",
        fontWeight: "bold",
      },
    ],
  });

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    // Deselect to remove editing borders before screenshot
    setSelectedId(null);

    // Give state time to update
    await new Promise((r) => setTimeout(r, 100));

    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        pixelRatio: 3, // High-res export
        backgroundColor: state.backgroundColor,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `ridersafe-qr-${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error("Failed to generate image", e);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el,
      ),
    }));
  };

  const removeElement = (id: string) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    setSelectedId(null);
  };

  const addText = () => {
    setState((prev) => ({
      ...prev,
      elements: [
        ...prev.elements,
        {
          id: nanoid(),
          type: "text",
          x: 20,
          y: 20,
          width: 150,
          height: 40,
          zIndex: Math.max(...prev.elements.map((e) => e.zIndex), 10) + 1,
          content: "Double click to edit",
          fontSize: 16,
          color: "#000000",
        },
      ],
    }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isBackground = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setIsCroppingBg(isBackground);
    setCropImageSrc(url);
    setCropModalOpen(true);

    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleCropComplete = (croppedUrl: string) => {
    if (isCroppingBg) {
      setState((prev) => ({ ...prev, backgroundImage: croppedUrl }));
    } else {
      setState((prev) => ({
        ...prev,
        elements: [
          ...prev.elements,
          {
            id: nanoid(),
            type: "image",
            x: 50,
            y: 50,
            width: 150,
            height: 150,
            zIndex: Math.max(...prev.elements.map((e) => e.zIndex), 10) + 1,
            src: croppedUrl,
          },
        ],
      }));
    }
    setCropModalOpen(false);
    setCropImageSrc(null);
  };

  const moveLayer = (index: number, direction: "up" | "down") => {
    setState((prev) => {
      const newElements = [...prev.elements];
      if (direction === "up" && index < newElements.length - 1) {
        // swap with next
        const temp = newElements[index];
        newElements[index] = newElements[index + 1];
        newElements[index + 1] = temp;
      } else if (direction === "down" && index > 0) {
        // swap with previous
        const temp = newElements[index];
        newElements[index] = newElements[index - 1];
        newElements[index - 1] = temp;
      }

      // Reassign zIndexes to match array order
      const ordered = newElements.map((el, idx) => ({
        ...el,
        zIndex: 10 + idx,
      }));
      return { ...prev, elements: ordered };
    });
  };

  const selectedElement = state.elements.find((e) => e.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8 border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Sidebar Tooling */}
      <div className="w-full lg:w-80 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b bg-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5" /> QR Studio
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Design your printable safe sticker
          </p>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Global Canvas Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center justify-between">
              <span>Canvas</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs mb-1 block">Width (px)</Label>
                <Input
                  type="number"
                  value={state.width}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      width: Number(e.target.value) || 320,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Height (px)</Label>
                <Input
                  type="number"
                  value={state.height}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      height: Number(e.target.value) || 480,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Solid Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="w-10 h-10 p-1"
                />
                <span className="text-xs font-mono">
                  {state.backgroundColor}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Background Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => handleImageUpload(e, true)}
                />
                {state.backgroundImage && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        backgroundImage: undefined,
                      }))
                    }
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Add Elements */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Add Elements
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addText}
                className="text-xs"
              >
                <Type className="w-3 h-3 mr-2" /> Text
              </Button>
              <div className="relative">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ImageIcon className="w-3 h-3 mr-2" /> Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </div>
            </div>
          </div>

          {/* Layers UI */}
          {state.elements.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-dashed border-primary/20">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" /> Layers
              </h4>
              <div className="space-y-1">
                {/* Render in reverse so top layers are visually at top of list */}
                {[...state.elements].reverse().map((el, reversedIdx) => {
                  const actualIdx = state.elements.length - 1 - reversedIdx;
                  const isSelected = selectedId === el.id;

                  return (
                    <div
                      key={el.id}
                      className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${isSelected ? "bg-primary/10 border-primary/30" : "bg-background hover:bg-muted/50"}`}
                      onClick={() => setSelectedId(el.id)}
                    >
                      <span className="truncate flex-1 font-medium capitalize">
                        {el.type === "qr"
                          ? "QR Code"
                          : el.type === "text"
                            ? el.content?.substring(0, 15) || "Text"
                            : "Image"}
                      </span>
                      <div className="flex items-center gap-1 opacity-70">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-5 h-5"
                          disabled={actualIdx === state.elements.length - 1} // Can't go higher
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(actualIdx, "up");
                          }}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-5 h-5"
                          disabled={actualIdx === 0} // Can't go lower
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(actualIdx, "down");
                          }}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Properties Panel (Contextual) */}
          {selectedElement && (
            <div className="space-y-3 pt-4 border-t border-dashed border-primary/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Edit Element
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeElement(selectedElement.id)}
                  className="h-6 w-6 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {selectedElement.type === "text" && (
                <>
                  <div>
                    <Label className="text-xs mb-1 block">Content</Label>
                    <Input
                      value={selectedElement.content}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs mb-1 block">Size</Label>
                      <Input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            fontSize: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Color</Label>
                      <Input
                        type="color"
                        className="w-full h-9 p-1"
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            color: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedElement.type === "qr" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs mb-1 block">QR Color</Label>
                    <Input
                      type="color"
                      className="w-full h-9 p-1"
                      value={selectedElement.qrFgColor}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          qrFgColor: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">QR Inner BG</Label>
                    <Input
                      type="color"
                      className="w-full h-9 p-1"
                      value={selectedElement.qrBgColor}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          qrBgColor: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-card">
          <Button onClick={handleDownload} className="w-full font-semibold">
            <Download className="w-4 h-4 mr-2" /> Download Asset
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border-l relative overflow-hidden">
        <CanvasArea
          state={state}
          updateElement={updateElement}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          canvasRef={canvasRef}
          qrUrl={qrUrl}
        />

        {/* Helper text */}
        {!selectedId && (
          <p className="absolute bottom-4 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm pointer-events-none">
            Click an element to edit. Drag to move. Drag corners to resize.
          </p>
        )}
      </div>

      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
