"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close modal when pressing Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-[1001] bg-gray-900 p-6 rounded-2xl shadow-2xl w-96">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          title="Close"
        >
          <X />
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        )}

        {/* Children */}
        {children}
      </div>
    </div>,
    document.body
  );
}
