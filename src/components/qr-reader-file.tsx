import React, { useEffect, useRef, useState } from "react";
import { BarcodeDetector } from "barcode-detector/ponyfill";
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import "./qr-reader-file.css";

const QrReaderFile: React.FC<{ onScan: (result: string) => void }> = ({ onScan }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear any previous error when a new image is selected
    if (imageSrc) {
      setError(null);
    }
  }, [imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const detectBarcode = async (imageSrc: string) => {
    if (!imageSrc) return;

    try {
      const image = new Image();
      image.src = imageSrc;
      image.onload = async () => {
        const barcodeDetector = new BarcodeDetector({ formats: ["qr_code", "ean_13", "ean_8", "code_128"] });

        try {
          const barcodes = await barcodeDetector.detect(image);
          if (barcodes.length > 0) {
            // Pass the first detected barcode to the onScan callback
            onScan(barcodes[0].rawValue);
          } else {
            setError("No barcode detected");
          }
        } catch (error) {
          setError("Error detecting barcode");
        }
      };
    } catch (error) {
      setError("Error processing image");
    } finally {
      error ? console.error(error) : console.log("Barcode detection complete");
    }
  };

  // Trigger barcode detection when image is set
  useEffect(() => {
    if (imageSrc) {
      detectBarcode(imageSrc);
    }
  }, [imageSrc]);

  return (
    <div className="qr-reader-file">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />
        <Button
            style={{ color: 'white' }}
            onClick={() => fileInputRef.current?.click()}
            className="qr-reader-file-button"
        >
            <Icon
                className="qr-reader-file-icon"
                baseClassName="material-symbols-rounded"
            >
                imagesmode
            </Icon>
        </Button>
    </div>
  );
};

export default QrReaderFile;
