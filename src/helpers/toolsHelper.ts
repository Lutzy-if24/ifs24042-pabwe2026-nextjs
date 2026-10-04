import Swal from "sweetalert2";

export function showSuccessDialog(message: string) {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#0f766e",
  });
}

export function showErrorDialog(message: string) {
  return Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: "#dc2626",
  });
}

export function showWarningDialog(message: string) {
  return Swal.fire({
    icon: "warning",
    title: "Peringatan",
    text: message,
    confirmButtonColor: "#d97706",
  });
}

export function showConfirmDialog(
  title: string,
  text: string
): Promise<{ isConfirmed: boolean }> {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    confirmButtonColor: "#0f766e",
    cancelButtonColor: "#64748b",
  });
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return "-";
  }
}