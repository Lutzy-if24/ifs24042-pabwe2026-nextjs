import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import NavbarComponent from "./NavbarComponent";

const replace = vi.fn();
const logoutMock = vi.fn();
const removeTokenMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("@/features/auth/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/auth/states/action")>();
  return {
    ...actual,
    asyncSetAuthLogout: (...args: unknown[]) => logoutMock(...args),
  };
});

vi.mock("@/helpers/apiHelper", () => ({
  removeAccessToken: (...args: unknown[]) => removeTokenMock(...args),
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  fetchWithAuth: vi.fn(),
}));

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logoutMock.mockImplementation(() => async () => true);
  });

  it("renders title and default username", () => {
    renderWithProviders(<NavbarComponent />);
    expect(screen.getByText("Delcom Posts")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-username")).toHaveTextContent("Pengguna");
  });

  it("renders profile name and photo", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        users: {
          users: [],
          user: null,
          profile: {
            id: 1,
            name: "Test User",
            email: "t@t.com",
            photo: "https://example.com/a.png",
          },
          isProfile: false,
          isChangeProfile: false,
          isChangeProfilePhoto: false,
          isChangeProfilePassword: false,
        },
      },
    });
    expect(screen.getByTestId("navbar-username")).toHaveTextContent("Test User");
    expect(screen.getByAltText("Test User")).toHaveAttribute(
      "src",
      "https://example.com/a.png"
    );
  });

  it("calls toggle sidebar", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<NavbarComponent onToggleSidebar={onToggle} />);
    await user.click(screen.getByTestId("navbar-toggle"));
    expect(onToggle).toHaveBeenCalled();
  });

  it("handles logout", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavbarComponent />);
    await user.click(screen.getByTestId("navbar-logout"));
    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
      expect(removeTokenMock).toHaveBeenCalled();
      expect(replace).toHaveBeenCalledWith("/auth/login");
    });
  });
});
