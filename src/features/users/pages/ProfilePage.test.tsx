import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import ProfilePage from "./ProfilePage";

const changeProfileMock = vi.fn();
const changePhotoMock = vi.fn();
const changePasswordMock = vi.fn();

vi.mock("@/features/users/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/users/states/action")>();
  return {
    ...actual,
    asyncSetProfile: () => async () => ({
      id: 1,
      name: "Profile User",
      email: "p@t.com",
    }),
    asyncChangeProfile: (...args: unknown[]) => changeProfileMock(...args),
    asyncChangeProfilePhoto: (...args: unknown[]) => changePhotoMock(...args),
    asyncChangeProfilePassword: (...args: unknown[]) =>
      changePasswordMock(...args),
  };
});

const baseUsersState = {
  users: [],
  user: null,
  profile: {
    id: 1,
    name: "Profile User",
    email: "p@t.com",
    photo: null as string | null,
  },
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeProfileMock.mockImplementation(() => async () => true);
    changePhotoMock.mockImplementation(() => async () => true);
    changePasswordMock.mockImplementation(() => async () => true);
  });

  it("renders profile form with profile data", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });
    expect(screen.getByTestId("profile-name")).toBeInTheDocument();
    expect(screen.getByTestId("profile-email")).toBeInTheDocument();
    expect(screen.getByTestId("password-submit")).toBeInTheDocument();
  });

  it("keeps the form empty and shows placeholder when there is no profile", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { ...baseUsersState, profile: null as never },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });
    expect(screen.getByTestId("profile-name")).toHaveValue("");
    expect(screen.getByTestId("profile-email")).toHaveValue("");
    expect(screen.queryByAltText("Foto profil")).not.toBeInTheDocument();
  });

  it("renders photo when profile has photo", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          ...baseUsersState,
          profile: {
            ...baseUsersState.profile!,
            photo: "https://example.com/avatar.png",
          },
        },
      },
    });
    await waitFor(() => {
      expect(screen.getByAltText("Foto profil")).toHaveAttribute(
        "src",
        "https://example.com/avatar.png"
      );
    });
  });

  it("submits profile update", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("profile-name")).toBeInTheDocument();
    });
    const nameInput = screen.getByTestId("profile-name");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    await user.click(screen.getByTestId("profile-submit"));
    await waitFor(() => {
      expect(changeProfileMock).toHaveBeenCalled();
    });
  });

  it("shows loading on profile submit button", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { ...baseUsersState, isChangeProfile: true },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId("profile-submit")).toHaveTextContent(
        "Menyimpan..."
      );
    });
    expect(screen.getByTestId("profile-submit")).toBeDisabled();
  });

  it("handles photo change with file", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("photo-input")).toBeInTheDocument();
    });
    const file = new File(["hello"], "photo.png", { type: "image/png" });
    const input = screen.getByTestId("photo-input") as HTMLInputElement;
    await user.upload(input, file);
    await waitFor(() => {
      expect(changePhotoMock).toHaveBeenCalled();
    });
  });

  it("does nothing when photo input has no file", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("photo-input")).toBeInTheDocument();
    });
    const input = screen.getByTestId("photo-input");
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(changePhotoMock).not.toHaveBeenCalled();
  });

  it("clicks change photo button to open file picker", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("btn-change-photo")).toBeInTheDocument();
    });
    const clickSpy = vi.fn();
    const input = screen.getByTestId("photo-input") as HTMLInputElement;
    input.click = clickSpy;
    await user.click(screen.getByTestId("btn-change-photo"));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("shows photo uploading state", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { ...baseUsersState, isChangeProfilePhoto: true },
      },
    });
    await waitFor(() => {
      expect(screen.getByText("Mengunggah...")).toBeInTheDocument();
    });
    expect(screen.getByTestId("btn-change-photo")).toBeDisabled();
  });

  it("submits password change and resets fields on success", async () => {
    changePasswordMock.mockImplementation(() => async () => true);
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-old")).toBeInTheDocument();
    });
    await user.type(screen.getByTestId("password-old"), "oldpass");
    await user.type(screen.getByTestId("password-new"), "newpass1");
    await user.type(screen.getByTestId("password-confirm"), "newpass1");
    await user.click(screen.getByTestId("password-submit"));
    await waitFor(() => {
      expect(changePasswordMock).toHaveBeenCalledWith(
        "oldpass",
        "newpass1",
        "newpass1"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-old")).toHaveValue("");
      expect(screen.getByTestId("password-new")).toHaveValue("");
      expect(screen.getByTestId("password-confirm")).toHaveValue("");
    });
  });

  it("does not reset password fields when change fails", async () => {
    changePasswordMock.mockImplementation(() => async () => false);
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: { users: baseUsersState },
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-old")).toBeInTheDocument();
    });
    await user.type(screen.getByTestId("password-old"), "oldpass");
    await user.type(screen.getByTestId("password-new"), "newpass1");
    await user.type(screen.getByTestId("password-confirm"), "newpass1");
    await user.click(screen.getByTestId("password-submit"));
    await waitFor(() => {
      expect(changePasswordMock).toHaveBeenCalled();
    });
    expect(screen.getByTestId("password-old")).toHaveValue("oldpass");
  });

  it("shows loading on password submit", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { ...baseUsersState, isChangeProfilePassword: true },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-submit")).toHaveTextContent(
        "Menyimpan..."
      );
    });
    expect(screen.getByTestId("password-submit")).toBeDisabled();
  });

  it("fills empty string when profile name and email are null", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          ...baseUsersState,
          profile: {
            id: 1,
            name: null as unknown as string,
            email: null as unknown as string,
            photo: null,
          },
        },
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId("profile-name")).toHaveValue("");
      expect(screen.getByTestId("profile-email")).toHaveValue("");
    });
  });

  it("uses photoPreview for img src after selecting a file", async () => {
    global.URL.createObjectURL = vi.fn(() => "blob:preview-url");
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          ...baseUsersState,
          profile: {
            id: 1,
            name: "User",
            email: "u@t.com",
            photo: null,
          },
        },
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("photo-input")).toBeInTheDocument()
    );
    const file = new File(["x"], "avatar.png", { type: "image/png" });
    await user.upload(screen.getByTestId("photo-input"), file);
    await waitFor(() => {
      expect(screen.getByAltText("Foto profil")).toHaveAttribute(
        "src",
        "blob:preview-url"
      );
    });
  });
});