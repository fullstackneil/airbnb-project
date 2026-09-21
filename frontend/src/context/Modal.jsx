import { useRef, useState, useContext, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

const FOCUSABLE =
  'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  // callback function that will be called when modal is closing
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null); // clear the modal contents
    // If callback function is truthy, call the callback function and reset it
    // to null:
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function called when modal is closing
    closeModal // function to close the modal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  const contentRef = useRef(null);
  const closeRef = useRef(closeModal);
  closeRef.current = closeModal;
  const isOpen = Boolean(modalContent);

  // Keyboard support while open: move focus into the modal, keep Tab inside
  // it, close on Escape, and hand focus back to the opener when it closes.
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement;
    const focusable = () =>
      contentRef.current
        ? [...contentRef.current.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled)
        : [];

    const first = contentRef.current?.querySelector('input, textarea, select') || focusable()[0];
    first?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      } else if (!contentRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // The opener may be gone (e.g. an item in a menu that has since
      // closed); fall back to an element marked as the return target.
      const target = opener && opener !== document.body && document.contains(opener)
        ? opener
        : document.querySelector('[data-modal-return-focus]');
      target?.focus();
    };
  }, [isOpen]);

  // If there is no div referenced by the modalRef or modalContent is not a
  // truthy value, render nothing:
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content" role="dialog" aria-modal="true" ref={contentRef}>
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
