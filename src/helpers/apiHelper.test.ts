import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  fetchWithAuth,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({ status: "success", message: "ok", data: {} }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and retrieves access token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("token-123");
    expect(getAccessToken()).toBe("token-123");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("returns null / no-ops when window is undefined", () => {
    const originalWindow = globalThis.window;
    // Simulate SSR / no window
    // @ts-expect-error test environment
    delete globalThis.window;

    expect(getAccessToken()).toBeNull();
    putAccessToken("x");
    removeAccessToken();

    globalThis.window = originalWindow;
  });

  it("fetchWithAuth sends GET request with auth header", async () => {
    putAccessToken("abc");
    await fetchWithAuth("/posts");
    expect(fetch).toHaveBeenCalled();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/posts");
    expect(options.headers.Authorization).toBe("Bearer abc");
    expect(options.method).toBe("GET");
  });

  it("fetchWithAuth without token omits Authorization", async () => {
    await fetchWithAuth("/posts");
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("fetchWithAuth appends query params", async () => {
    await fetchWithAuth("/posts", { params: { is_me: 1, empty: "" } });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("is_me=1");
    expect(url).not.toContain("empty");
  });

  it("fetchWithAuth skips empty query string when all params empty/null", async () => {
    await fetchWithAuth("/posts", {
      params: { a: "", b: null, c: undefined },
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).not.toContain("?");
  });

  it("fetchWithAuth with no params leaves url unchanged", async () => {
    await fetchWithAuth("/posts");
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url.endsWith("/posts")).toBe(true);
  });

  it("fetchWithAuth sends JSON body with Content-Type", async () => {
    await fetchWithAuth("/posts", {
      method: "POST",
      body: JSON.stringify({ description: "hi" }),
    });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.method).toBe("POST");
  });

  it("fetchWithAuth skips Content-Type for FormData via isFormData", async () => {
    const form = new FormData();
    await fetchWithAuth("/posts/1/cover", {
      method: "POST",
      body: form,
      isFormData: true,
    });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("fetchWithAuth skips Content-Type when body is FormData instance", async () => {
    const form = new FormData();
    await fetchWithAuth("/posts/1/cover", {
      method: "POST",
      body: form,
    });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("handles json parse failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.reject(new Error("bad")),
      })
    );
    const result = await fetchWithAuth("/posts");
    expect(result.status).toBe("fail");
    expect(result.message).toBe("Gagal memproses respons server");
  });

  it("merges custom headers", async () => {
    await fetchWithAuth("/posts", {
      headers: { "X-Custom": "1" },
    });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers["X-Custom"]).toBe("1");
    expect(options.headers.Accept).toBe("application/json");
  });
});
