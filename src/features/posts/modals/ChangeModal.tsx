"use client";

import { useEffect } from "react";
import useInput from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncChangePost } from "@/features/posts/states/action";
import { IconX } from "@tabler/icons-react";

type ChangeModalProps = {
  open: boolean;
  onClose: () => void;
  postId: number | string;
  initialDescription?: string;
  onSuccess?: () => void;
};

export default function ChangeModal({
  open,
  onClose,
  postId,
  initialDescription = "",
  onSuccess,
}: ChangeModalProps) {
  const [description, onDescriptionChange, setDescription] = useInput(
    initialDescription
  );
  const dispatch = useAppDispatch();
  const { isPostChange } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (open) {
      setDescription(initialDescription);
    }
  }, [open, initialDescription, setDescription]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    const success = await dispatch(
      asyncChangePost(postId, description.trim())
    );
    if (success) {
      onClose();
      onSuccess?.();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      data-testid="change-modal"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Ubah Postingan</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100"
            aria-label="Tutup"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="change-description-input"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Deskripsi
            </label>
            <textarea
              id="change-description-input"
              value={description}
              onChange={onDescriptionChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              required
              data-testid="change-description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPostChange}
              data-testid="change-submit"
              className="px-4 py-2 text-sm rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:bg-teal-400"
            >
              {isPostChange ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}