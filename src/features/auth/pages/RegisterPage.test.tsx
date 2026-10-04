import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import RegisterPage from "./RegisterPage";

const replace = vi.fn();
const asyncRegisterMock = vi.fn();

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
    asyncSetAuthRegister: (...args: unknown[]) => asyncRegisterMock(...args),
  };
});

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncRegisterMock.mockImplementation(() => async () => true);
  });

  it("renders form fields", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByTestId("register-name")).toBeInTheDocument();
    expect(screen.getByTestId("register-email")).toBeInTheDocument();
    expect(screen.getByTestId("register-password")).toBeInTheDocument();
    expect(screen.getByTestId("register-submit")).toBeInTheDocument();
  });

  it("allows typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByTestId("register-name"), "User");
    await user.type(screen.getByTestId("register-email"), "u@t.com");
    await user.type(screen.getByTestId("register-password"), "123456");
    expect(screen.getByTestId("register-name")).toHaveValue("User");
    expect(screen.getByTestId("register-email")).toHaveValue("u@t.com");
    expect(screen.getByTestId("register-password")).toHaveValue("123456");
  });

  it("does not dispatch when fields are empty", async () => {
    const { fireEvent } = await import("@testing-library/react");
    renderWithProviders(<RegisterPage />);
    const form = screen.getByTestId("register-submit").closest("form")!;
    fireEvent.submit(form);
    expect(asyncRegisterMock).not.toHaveBeenCalled();
  });

  it("dispatches register and redirects on success", async () => {
    asyncRegisterMock.mockImplementation(() => async () => true);
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByTestId("register-name"), "New User");
    await user.type(screen.getByTestId("register-email"), "new@test.com");
    await user.type(screen.getByTestId("register-password"), "secret1");
    await user.click(screen.getByTestId("register-submit"));
    await waitFor(() => {
      expect(asyncRegisterMock).toHaveBeenCalledWith(
        "New User",
        "new@test.com",
        "secret1"
      );
      expect(replace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("does not redirect when register fails", async () => {
    asyncRegisterMock.mockImplementation(() => async () => false);
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await user.type(screen.getByTestId("register-name"), "New User");
    await user.type(screen.getByTestId("register-email"), "new@test.com");
    await user.type(screen.getByTestId("register-password"), "secret1");
    await user.click(screen.getByTestId("register-submit"));
    await waitFor(() => {
      expect(asyncRegisterMock).toHaveBeenCalled();
    });
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows loading text when isAuthRegister is true", () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          isAuthLogin: false,
          isAuthRegister: true,
          isAuthLogout: false,
        },
      },
    });
    expect(screen.getByTestId("register-submit")).toHaveTextContent(
      "Memproses..."
    );
    expect(screen.getByTestId("register-submit")).toBeDisabled();
  });

  it("renders link to login", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("Masuk")).toBeInTheDocument();
  });
});
