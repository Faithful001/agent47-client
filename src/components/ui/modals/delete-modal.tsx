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
          className="rounded-lg bg-red-650 hover:bg-red-550 px-4 py-2 text-xs font-semibold font-mono text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] shadow-sm"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : buttonText}
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl focus:outline-none text-zinc-100">
          <AlertDialog.Title className="text-lg font-bold font-sans">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-xs font-sans text-zinc-400 leading-relaxed">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold font-mono text-zinc-300 hover:bg-zinc-700 transition-colors">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onClick}
                className="rounded-lg bg-red-650 px-4 py-2 text-xs font-semibold font-mono text-white hover:bg-red-550 transition-colors shadow-sm"
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
