import { AlertTriangle, ShieldAlert } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}) {
  const Icon = variant === "danger" ? AlertTriangle : ShieldAlert;

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${
            variant === "danger"
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <Icon size={20} />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed pt-2">{message}</p>
      </div>

      <div className="mt-7 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
