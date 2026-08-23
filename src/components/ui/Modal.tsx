import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  if (!isOpen) return null;
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen || !backdropRef.current || !modalRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.96,
          y: 12,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        }
      );
    });

    return () => context.revert();
  }, [isOpen]);

  return (
    <div
      ref={backdropRef}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70
        px-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-2xl
          shadow-black/40
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div
            className="
              flex items-center justify-between
              border-b border-[var(--border)]
              px-5 py-4
            "
          >
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                text-lg
                text-[var(--text-muted)]
                transition-colors
                duration-200
                hover:bg-[var(--surface-elevated)]
                hover:text-[var(--text-primary)]
              "
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;