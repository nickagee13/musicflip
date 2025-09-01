import { X } from 'lucide-react'

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onDismiss}>
        <X size={16} />
      </button>
    </div>
  )
}