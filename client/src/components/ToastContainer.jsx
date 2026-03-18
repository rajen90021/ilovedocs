import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {icons[toast.type]}
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
