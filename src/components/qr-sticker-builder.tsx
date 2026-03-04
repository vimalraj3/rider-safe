"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function QRStickerBuilder({
  slug,
  defaultName,
}: {
  slug: string;
  defaultName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [stickerName, setStickerName] = useState(defaultName);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${slug}`
      : `https://bikerider.in/r/${slug}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        profileUrl,
        {
          width: 200,
          margin: 1,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (error: Error | null | undefined) => {
          if (error) console.error("Error generating QR", error);
        },
      );
    }
  }, [profileUrl, bgColor, fgColor]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>QR Sticker Builder</CardTitle>
        <CardDescription>
          Customize and print your emergency QR sticker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label>Sticker Name</Label>
              <Input
                value={stickerName}
                onChange={(e) => setStickerName(e.target.value)}
                placeholder="Rider Name"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>QR Code Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 p-1"
                  />
                  <span className="text-sm code">{fgColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <Label>Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 p-1"
                  />
                  <span className="text-sm code">{bgColor}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePrint}
              className="w-full h-12 mt-4 print:hidden"
            >
              Print Sticker
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/20">
            {/* The actual printable area */}
            <div
              className="printable-sticker flex flex-col items-center p-6 rounded-xl shadow-lg transition-colors border"
              style={{ backgroundColor: bgColor }}
            >
              <h3
                className="text-xl font-bold mb-4 tracking-tight"
                style={{ color: fgColor }}
              >
                {stickerName}
              </h3>
              <div className="bg-white p-2 rounded-lg">
                <canvas ref={canvasRef} className="rounded-md" />
              </div>
              <p
                className="mt-4 font-semibold text-sm tracking-wide uppercase"
                style={{ color: fgColor }}
              >
                Scan for Emergency Info
              </p>
            </div>
          </div>
        </div>

        {/* Global styles for print specifically targeted at the sticker */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-sticker, .printable-sticker * {
              visibility: visible;
            }
            .printable-sticker {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 300px;
              border: 2px solid #ccc !important;
              box-shadow: none !important;
            }
          }
        `,
          }}
        />
      </CardContent>
    </Card>
  );
}
