"use client";

import useInput from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncAddPost } from "@/features/posts/states/action";
import { IconX } from "@tabler/icons-react";

type AddModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddModal({ open, onClose, onSuccess }: AddModalProps) {
  const [description, onDescriptionChange, , reset] = useInput("");
  const dispatch = useAppDispatch();
  const { isPostAdd } = useAppSelector((state) => state.posts);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    const result = await dispatch(asyncAddPost(description.trim()));
    if (result) {
      reset();
      onClose();
      onSuccess?.();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      data-testid="add-modal"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Tambah Postingan</h3>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={onDescriptionChange}
              rows={4}
              placeholder="Tulis sesuatu..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              required
              data-testid="add-description"
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
              disabled={isPostAdd}
              data-testid="add-submit"
              className="px-4 py-2 text-sm rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:bg-teal-400"
            >
              {isPostAdd ? "Menyimpan..." : "Publikasikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
