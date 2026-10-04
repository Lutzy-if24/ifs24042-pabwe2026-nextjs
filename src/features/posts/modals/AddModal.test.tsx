import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import AddModal from "./AddModal";

const addPostMock = vi.fn();

vi.mock("@/features/posts/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/states/action")>();
  return {
    ...actual,
    asyncAddPost: (...args: unknown[]) => addPostMock(...args),
  };
});

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addPostMock.mockImplementation(() => async () => true);
  });

  it("returns null when closed", () => {
    const { container } = renderWithProviders(
      <AddModal open={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders form when open", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddModal open onClose={vi.fn()} />);
    expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    await user.type(screen.getByTestId("add-description"), "Hello post");
    expect(screen.getByTestId("add-description")).toHaveValue("Hello post");
  });

  it("does not submit when description is empty", () => {
    renderWithProviders(<AddModal open onClose={vi.fn()} />);
    const form = screen.getByTestId("add-submit").closest("form")!;
    fireEvent.submit(form);
    expect(addPostMock).not.toHaveBeenCalled();
  });

  it("submits successfully and calls onClose and onSuccess", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <AddModal open onClose={onClose} onSuccess={onSuccess} />
    );
    await user.type(screen.getByTestId("add-description"), "New post");
    await user.click(screen.getByTestId("add-submit"));
    await waitFor(() => {
      expect(addPostMock).toHaveBeenCalledWith("New post");
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not close when submit fails", async () => {
    addPostMock.mockImplementation(() => async () => false);
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await user.type(screen.getByTestId("add-description"), "Fail post");
    await user.click(screen.getByTestId("add-submit"));
    await waitFor(() => {
      expect(addPostMock).toHaveBeenCalled();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes via Batal button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await user.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes via Tutup icon button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<AddModal open onClose={onClose} />);
    await user.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows loading state when isPostAdd", () => {
    renderWithProviders(<AddModal open onClose={vi.fn()} />, {
      preloadedState: {
        posts: {
          posts: [],
          post: null,
          isPost: false,
          isPostAdd: true,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
        },
      },
    });
    expect(screen.getByTestId("add-submit")).toHaveTextContent("Menyimpan...");
    expect(screen.getByTestId("add-submit")).toBeDisabled();
  });
});