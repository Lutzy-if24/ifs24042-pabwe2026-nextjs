import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import PostLayout from "./PostLayout";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: vi.fn().mockReturnValue("token"),
  removeAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  fetchWithAuth: vi.fn(),
}));

vi.mock("@/features/users/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/users/states/action")>();
  return {
    ...actual,
    asyncSetProfile: () => async () => ({
      id: 1,
      name: "User",
      email: "u@t.com",
    }),
  };
});

vi.mock("@/features/auth/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/auth/states/action")>();
  return {
    ...actual,
    asyncSetAuthLogout: () => async () => true,
  };
});

import { getAccessToken } from "@/helpers/apiHelper";

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue("token");
  });

  it("redirects without token", async () => {
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(null);
    renderWithProviders(
      <PostLayout>
        <div>content</div>
      </PostLayout>
    );
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("shows layout when authenticated", async () => {
    renderWithProviders(
      <PostLayout>
        <div data-testid="child">Hello</div>
      </PostLayout>
    );
    await waitFor(() => {
      expect(screen.getByTestId("post-layout")).toBeInTheDocument();
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("toggles sidebar open and close", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PostLayout>
        <div>content</div>
      </PostLayout>
    );
    await waitFor(() => {
      expect(screen.getByTestId("post-layout")).toBeInTheDocument();
    });
    await user.click(screen.getByTestId("navbar-toggle"));
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
    await user.click(screen.getByTestId("sidebar-overlay"));
    await waitFor(() => {
      expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
    });
  });
});