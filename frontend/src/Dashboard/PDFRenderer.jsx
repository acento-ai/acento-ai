import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

const options = { cMapUrl: "cmaps/", cMapPacked: true };

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    updateWidth(); // Initial
    window.addEventListener("resize", updateWidth); // Responsive
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="relative w-full pt-[56.25%] overflow-hidden rounded-t-xl bg-white">
      <div className="absolute right-0 top-0 left-0 h-full" ref={containerRef}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          renderMode="canvas"
          options={options}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={containerWidth}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
