import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

import Swal from "sweetalert2";

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("showSuccessDialog", async () => {
    await showSuccessDialog("ok");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success", text: "ok" })
    );
  });

  it("showErrorDialog", async () => {
    await showErrorDialog("err");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "error", text: "err" })
    );
  });

  it("showWarningDialog", async () => {
    await showWarningDialog("warn");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "warning", text: "warn" })
    );
  });

  it("showConfirmDialog", async () => {
    const result = await showConfirmDialog("Title", "Text");
    expect(result.isConfirmed).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "question", title: "Title" })
    );
  });

  it("formatDate returns formatted date", () => {
    const result = formatDate("2024-10-05T03:07:11.000000Z");
    expect(result).not.toBe("-");
    expect(typeof result).toBe("string");
  });

  it("formatDate handles invalid and empty", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
    expect(formatDate("not-a-date")).toBe("-");
  });

  it("formatDate catch branch when Date throws", () => {
    const OriginalDate = globalThis.Date;
    class ThrowingDate {
      constructor() {
        throw new Error("boom");
      }
      static isNaN() {
        return false;
      }
    }
    // @ts-expect-error mock Date
    globalThis.Date = ThrowingDate;
    expect(formatDate("2024-01-01")).toBe("-");
    globalThis.Date = OriginalDate;
  });
});
