import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteModalProps {
  buttonText?: string;
  title: string;
  description: string;
  onClick: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DeleteModal = ({
  title,
  description,
  onClick,
  buttonText = "Delete",
  isLoading,
  onClose,
  open,
  onOpenChange,
}: DeleteModalProps) => {
  return (
    <AlertDialog.Root 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange?.(isOpen);
        if (!isOpen) onClose?.();
      }}
    >
      <AlertDialog.Trigger asChild>
        <button
          disabled={isLoading}
          className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border bg-white p-6 shadow-xl focus:outline-none">
          <AlertDialog.Title className="text-xl font-semibold text-slate-900">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm text-slate-600">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <button
                onClick={onClick}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteModal;
