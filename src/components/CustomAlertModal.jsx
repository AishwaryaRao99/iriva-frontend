import React, { useEffect } from 'react';
import { marked } from 'marked';

export default function CustomAlertModal({ open, title, message, type = 'info', onClose, autoCloseMs = 0, renderMarkdown = false }) {
  if (!open) return null;

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  useEffect(() => {
    if (!autoCloseMs || autoCloseMs <= 0) return undefined;
    const t = setTimeout(() => {
      onClose && onClose();
    }, autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className={`relative max-w-lg w-full rounded-2xl border p-6 shadow-lg ${colors[type]}`} role="dialog" aria-modal="true">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {renderMarkdown ? (
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: marked.parse(message || '') }} />
        ) : (
          <p className="text-sm mb-4 whitespace-pre-wrap">{message}</p>
        )}
        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
