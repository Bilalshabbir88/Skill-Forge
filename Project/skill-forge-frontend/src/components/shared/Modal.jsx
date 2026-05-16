import { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // default, danger, success, warning, info
  size = 'md', // sm, md, lg, xl
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-3xl';
      case 'xl':
        return 'max-w-5xl';
      default: // md
        return 'max-w-lg';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-500',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-500',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          icon: null,
          iconColor: '',
          buttonColor: 'bg-primary-600 hover:bg-primary-700',
        };
    }
  };

  const typeStyles = getTypeStyles();
  const Icon = typeStyles.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${getSizeClasses()} w-full transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          {title && (
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center space-x-3">
                {Icon && (
                  <div className={`flex-shrink-0 ${typeStyles.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">
            <div className="text-gray-600 dark:text-gray-400">
              {children}
            </div>
          </div>

          {/* Footer with Actions */}
          {onConfirm && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${typeStyles.buttonColor}`}
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Variant
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      type={type}
      confirmText={type === 'danger' ? 'Delete' : 'Confirm'}
      cancelText="Cancel"
    >
      <p>{message}</p>
    </Modal>
  );
};

export default Modal;
