"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "@/features/users/states/action";
import useInput from "@/hooks/useInput";
import { IconUser, IconCamera } from "@tabler/icons-react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const {
    profile,
    isChangeProfile,
    isChangeProfilePhoto,
    isChangeProfilePassword,
  } = useAppSelector((state) => state.users);

  const [name, onNameChange, setName] = useInput("");
  const [email, onEmailChange, setEmail] = useInput("");
  const [password, onPasswordChange, , resetPassword] = useInput("");
  const [newPassword, onNewPasswordChange, , resetNewPassword] = useInput("");
  const [confirmPassword, onConfirmPasswordChange, , resetConfirm] =
    useInput("");
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(asyncSetProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile, setName, setEmail]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    await dispatch(asyncChangeProfile(name, email));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    await dispatch(asyncChangeProfilePhoto(file));
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const success = await dispatch(
      asyncChangeProfilePassword(password, newPassword, confirmPassword)
    );
    if (success) {
      resetPassword();
      resetNewPassword();
      resetConfirm();
    }
  }

  const photoSrc = photoPreview || profile?.photo || null;

  return (
    <div data-testid="profile-page" className="max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Profil Saya</h2>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc}
                alt="Foto profil"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
                <IconUser
                  className="w-12 h-12 text-teal-700"
                  aria-hidden="true"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              disabled={isChangeProfilePhoto}
              data-testid="btn-change-photo"
              aria-label="Ubah foto profil"
              className="absolute bottom-0 right-0 p-1.5 bg-teal-700 text-white rounded-full hover:bg-teal-800"
            >
              <IconCamera className="w-4 h-4" aria-hidden="true" />
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              data-testid="photo-input"
            />
          </div>
          {isChangeProfilePhoto && (
            <p className="text-xs text-slate-600 mt-2">Mengunggah...</p>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nama
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={onNameChange}
              data-testid="profile-name"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={onEmailChange}
              data-testid="profile-email"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isChangeProfile}
            data-testid="profile-submit"
            className="w-full py-2.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:bg-teal-400 font-medium"
          >
            {isChangeProfile ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Ubah Kata Sandi</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label
              htmlFor="password-old"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Kata Sandi Lama
            </label>
            <input
              id="password-old"
              type="password"
              value={password}
              onChange={onPasswordChange}
              data-testid="password-old"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password-new"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Kata Sandi Baru
            </label>
            <input
              id="password-new"
              type="password"
              value={newPassword}
              onChange={onNewPasswordChange}
              data-testid="password-new"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              minLength={6}
            />
          </div>
          <div>
            <label
              htmlFor="password-confirm"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="password-confirm"
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              data-testid="password-confirm"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isChangeProfilePassword}
            data-testid="password-submit"
            className="w-full py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-400 font-medium"
          >
            {isChangeProfilePassword ? "Menyimpan..." : "Ubah Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}