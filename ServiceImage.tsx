
"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

type Props = {
  src: string;
  alt: string;
};

export default function ServiceImage({ src, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="service-thumb"
        onClick={() => setIsOpen(true)}
        aria-label={`View full image: ${alt}`}
      >
        <img src={src} alt={alt} />
        <span className="service-zoom-icon">
          <ZoomIn size={20} />
        </span>
      </button>

      {isOpen && (
        <div
          className="image-lightbox"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close image"
          >
            <X size={26} />
          </button>

          <img
            src={src}
            alt={alt}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
