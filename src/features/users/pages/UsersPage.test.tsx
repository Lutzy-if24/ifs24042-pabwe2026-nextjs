import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import UsersPage from "./UsersPage";

vi.mock("@/features/users/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/users/states/action")>();
  return {
    ...actual,
    asyncSetUsers: () => async () => undefined,
  };
});

const usersState = (
  users: Array<{
    id: number;
    name: string;
    email: string;
    photo?: string | null;
  }>
) => ({
  users: {
    users,
    user: null,
    profile: null,
    isProfile: false,
    isChangeProfile: false,
    isChangeProfilePhoto: false,
    isChangeProfilePassword: false,
  },
});

describe("UsersPage", () => {
  it("renders empty state", async () => {
    renderWithProviders(<UsersPage />);
    await waitFor(() => {
      expect(screen.getByTestId("users-page")).toBeInTheDocument();
    });
    expect(screen.getByText("Tidak ada pengguna")).toBeInTheDocument();
  });

  it("renders users without photo", async () => {
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        { id: 1, name: "User One", email: "u@t.com" },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    });
    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("u@t.com")).toBeInTheDocument();
  });

  it("renders users with photo", async () => {
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        {
          id: 2,
          name: "Photo User",
          email: "p@t.com",
          photo: "https://example.com/photo.jpg",
        },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-2")).toBeInTheDocument();
    });
    const img = screen.getByAltText("Photo User");
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("filters users by name search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        { id: 1, name: "Alice", email: "alice@t.com" },
        { id: 2, name: "Bob", email: "bob@t.com" },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    });
    await user.type(screen.getByTestId("users-search"), "bob");
    expect(screen.queryByTestId("user-card-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-card-2")).toBeInTheDocument();
  });

  it("filters users by email search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        { id: 1, name: "Alice", email: "alice@t.com" },
        { id: 2, name: "Bob", email: "bob@t.com" },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    });
    await user.type(screen.getByTestId("users-search"), "alice@");
    expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("user-card-2")).not.toBeInTheDocument();
  });

  it("shows empty when search has no match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        { id: 1, name: "Alice", email: "alice@t.com" },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    });
    await user.type(screen.getByTestId("users-search"), "zzz");
    expect(screen.getByText("Tidak ada pengguna")).toBeInTheDocument();
  });

  it("shows all users when search is cleared", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersPage />, {
      preloadedState: usersState([
        { id: 1, name: "Alice", email: "alice@t.com" },
      ]),
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
    });
    const input = screen.getByTestId("users-search");
    await user.type(input, "x");
    await user.clear(input);
    expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
  });
});