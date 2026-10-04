"use client";

import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncChangePostCover } from "@/features/posts/states/action";
import { IconX, IconPhoto } from "@tabler/icons-react";

type ChangeCoverModalProps = {
  open: boolean;
  onClose: () => void;
  postId: number | string;
  onSuccess?: () => void;
};

export default function ChangeCoverModal({
  open,
  onClose,
  postId,
  onSuccess,
}: ChangeCoverModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { isPostChangeCover } = useAppSelector((state) => state.posts);

  if (!open) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const success = await dispatch(asyncChangePostCover(postId, file));
    if (success) {
      setFile(null);
      setPreview(null);
      onClose();
      onSuccess?.();
    }
  }

  function handleClose() {
    setFile(null);
    setPreview(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      data-testid="change-cover-modal"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Ubah Cover</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded hover:bg-slate-100"
            aria-label="Tutup"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div
            className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-teal-400 transition-colors"
            onClick={() => inputRef.current?.click()}
            data-testid="cover-dropzone"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <IconPhoto className="w-10 h-10" />
                <span className="text-sm">Klik untuk pilih gambar</span>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="cover-input"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!file || isPostChangeCover}
              data-testid="cover-submit"
              className="px-4 py-2 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:bg-teal-400"
            >
              {isPostChangeCover ? "Mengunggah..." : "Unggah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
