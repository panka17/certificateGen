import React from 'react';
import { useCertificate } from "@/context/CertificateContext";
import { MutableRefObject } from "react";
import jsPDF from 'jspdf';

export const CertificateDownload = ({ canvasRef }: { canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }) => {
  const download = async () => {
    console.log(canvasRef);
    if (canvasRef.current) {
      // Define the cropping parameters
      const cropTop = 20; // Adjust this value to specify the top crop
      const cropBottom = 20; // Adjust this value to specify the bottom crop

      // Calculate the dimensions of the cropped image
      const croppedWidth = canvasRef.current.width;
      const croppedHeight = canvasRef.current.height - cropTop - cropBottom;

      // Create a new canvas for the cropped image
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const context = croppedCanvas.getContext('2d');

      // Draw the cropped portion of the image onto the new canvas
      if (context) {
        context.drawImage(
          canvasRef.current,
          0, // Source X
          cropTop, // Source Y (starting point after cropping from the top)
          croppedWidth, // Source width (same as original)
          croppedHeight, // Source height (adjusted for cropping)
          0, // Destination X (starting point at the left)
          0, // Destination Y (starting point at the top)
          croppedWidth, // Destination width (same as source)
          croppedHeight // Destination height (same as source)
        );

        // Create a new jsPDF instance
        const pdf = new jsPDF({
          orientation: 'p', // 'p' for portrait orientation
          unit: 'mm', // millimeters
          format: 'a4', // A4 page size
        });

        // Convert the cropped canvas to a data URL
        const dataURL = croppedCanvas.toDataURL("image/jpeg");

        // Add the image to the PDF document
        pdf.addImage(dataURL, 'JPEG', 0, 0);

        // Save the PDF with a specific filename
        pdf.save("certificate.pdf");
      }
    }
  };
  return (
    <div className="mt-5">
      <button className="btn hover:bg-green-500" onClick={download}>
        Download Certificate
      </button>
    </div>
  );
};
