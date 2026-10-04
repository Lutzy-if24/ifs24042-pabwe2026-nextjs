import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import LoginPage from "./LoginPage";

const replace = vi.fn();
const asyncLoginMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
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

vi.mock("@/features/auth/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/auth/states/action")>();
  return {
    ...actual,
    asyncSetAuthLogin: (...args: unknown[]) => asyncLoginMock(...args),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncLoginMock.mockImplementation(() => async () => true);
  });

  it("renders form fields", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByTestId("login-email")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("allows typing email and password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByTestId("login-email"), "a@b.com");
    await user.type(screen.getByTestId("login-password"), "123456");
    expect(screen.getByTestId("login-email")).toHaveValue("a@b.com");
    expect(screen.getByTestId("login-password")).toHaveValue("123456");
  });

  it("does not dispatch when email or password is empty", async () => {
    const { fireEvent } = await import("@testing-library/react");
    renderWithProviders(<LoginPage />);
    const form = screen.getByTestId("login-submit").closest("form")!;
    // fireEvent.submit bypasses HTML5 required validation
    fireEvent.submit(form);
    expect(asyncLoginMock).not.toHaveBeenCalled();
  });

  it("dispatches login and redirects on success", async () => {
    asyncLoginMock.mockImplementation(() => async () => true);
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByTestId("login-email"), "user@test.com");
    await user.type(screen.getByTestId("login-password"), "secret12");
    await user.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(asyncLoginMock).toHaveBeenCalledWith("user@test.com", "secret12");
      expect(replace).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when login fails", async () => {
    asyncLoginMock.mockImplementation(() => async () => false);
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByTestId("login-email"), "user@test.com");
    await user.type(screen.getByTestId("login-password"), "wrong");
    await user.click(screen.getByTestId("login-submit"));
    await waitFor(() => {
      expect(asyncLoginMock).toHaveBeenCalled();
    });
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows loading text when isAuthLogin is true", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          isAuthLogin: true,
          isAuthRegister: false,
          isAuthLogout: false,
        },
      },
    });
    expect(screen.getByTestId("login-submit")).toHaveTextContent("Memproses...");
    expect(screen.getByTestId("login-submit")).toBeDisabled();
  });

  it("renders link to register", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText("Daftar")).toBeInTheDocument();
  });
});
