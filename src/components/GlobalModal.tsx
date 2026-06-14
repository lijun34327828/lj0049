import { useEffect, useRef } from 'react';

export const GlobalModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.close();
    };

    const handleBackdropClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  return (
    <dialog
      id="configurable-modal"
      ref={dialogRef}
      className="rounded-lg p-0 border-0 shadow-2xl backdrop:bg-black/50"
      style={{ minWidth: '360px' }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 data-modal-title className="text-lg font-semibold text-gray-900">
            标题
          </h3>
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div data-modal-content className="px-5 py-4 text-gray-700 text-sm leading-relaxed">
          内容
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={() => dialogRef.current?.close()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => dialogRef.current?.close()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </dialog>
  );
};
