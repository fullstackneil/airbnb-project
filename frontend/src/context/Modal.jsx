import { useRef, useState, useContext, useEffect, useLayoutEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const ModalContext = createContext();

const FOCUSABLE =
  'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function ModalProvider({ children }) {
  // The portal target, held in state (via a callback ref) so the modal
  // re-renders once it exists instead of reading a ref during render.
  const [modalNode, setModalNode] = useState(null);
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
    modalNode, // the div modals are rendered into
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
      <div ref={setModalNode} />
    </>
  );
}

export function Modal() {
  const { modalNode, modalContent, closeModal } = useContext(ModalContext);
  const contentRef = useRef(null);
  // Latest closeModal for the keyboard handler, updated after each render.
  const closeRef = useRef(closeModal);
  useLayoutEffect(() => {
    closeRef.current = closeModal;
  });
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

  // Nothing to show, or the portal target isn't mounted yet.
  if (!modalNode || !modalContent) return null;

  // Render the modal into the portal target
  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.background} onClick={closeModal} />
      <div className={styles.content} role="dialog" aria-modal="true" ref={contentRef}>
        {modalContent}
      </div>
    </div>,
    modalNode
  );
}

export const useModal = () => useContext(ModalContext);
