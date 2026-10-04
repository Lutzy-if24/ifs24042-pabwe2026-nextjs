import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: vi.fn().mockReturnValue(null),
}));

import { getAccessToken } from "@/helpers/apiHelper";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  it("renders children", () => {
    render(
      <AuthLayout>
        <div data-testid="child">Child</div>
      </AuthLayout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("redirects when token exists", () => {
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue("tok");
    render(
      <AuthLayout>
        <div>x</div>
      </AuthLayout>
    );
    expect(replace).toHaveBeenCalledWith("/");
  });
});
