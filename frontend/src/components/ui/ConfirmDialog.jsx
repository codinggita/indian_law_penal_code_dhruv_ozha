import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-text-secondary">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? 'danger' : 'primary'} 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
