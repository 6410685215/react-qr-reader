import React, { useEffect, useRef, useState } from "react";
import "webrtc-adapter";
import { BarcodeDetector } from "barcode-detector/ponyfill";

import QrReaderFile from "./qr-reader-file";
import "./qr-reader.css";

const QrScanner: React.FC<{ onScan: (result: string) => void }> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    async function startScanner() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
        }

        scanBarcode();
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    async function scanBarcode() {
      if (!isScanning || !videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d")!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const detector = new BarcodeDetector({ formats: ["qr_code", "code_128"] });
        const barcodes = await detector.detect(canvas);
        if (barcodes.length > 0) {
          setIsScanning(false);
          onScan(barcodes[0].rawValue);
          stopScanner();
          return;
        }
      } catch (err) {
        console.warn("Barcode detection failed:", err);
      }

      animationFrameId = requestAnimationFrame(scanBarcode);
    }

    if (isScanning) {
      startScanner();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      stopScanner();
    };
  }, []);

  function stopScanner() {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  }

  return (
    <div className="qr-reader">
      <video ref={videoRef} poster="" className="video" />
      <canvas ref={canvasRef} className="canvas" />
      <div className="viewFinder"></div>
      <QrReaderFile onScan={onScan} />
    </div>
  );
};

export default QrScanner;
