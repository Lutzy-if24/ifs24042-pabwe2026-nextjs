import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import ChangeModal from "./ChangeModal";

const changePostMock = vi.fn();

vi.mock("@/features/posts/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/states/action")>();
  return {
    ...actual,
    asyncChangePost: (...args: unknown[]) => changePostMock(...args),
  };
});

const basePosts = {
  posts: [],
  post: null,
  isPost: false,
  isPostAdd: false,
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
};

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changePostMock.mockImplementation(() => async () => true);
  });

  it("returns null when closed", () => {
    const { container } = renderWithProviders(
      <ChangeModal open={false} onClose={vi.fn()} postId={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders with initial description", () => {
    renderWithProviders(
      <ChangeModal
        open
        onClose={vi.fn()}
        postId={1}
        initialDescription="Old text"
      />
    );
    expect(screen.getByTestId("change-modal")).toBeInTheDocument();
    expect(screen.getByTestId("change-description")).toHaveValue("Old text");
  });

  it("does not submit when empty", () => {
    renderWithProviders(
      <ChangeModal open onClose={vi.fn()} postId={1} initialDescription="" />
    );
    fireEvent.submit(screen.getByTestId("change-submit").closest("form")!);
    expect(changePostMock).not.toHaveBeenCalled();
  });

  it("submits success closes and onSuccess", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeModal
        open
        onClose={onClose}
        postId={5}
        initialDescription="Old"
        onSuccess={onSuccess}
      />
    );
    const input = screen.getByTestId("change-description");
    await user.clear(input);
    await user.type(input, "Updated text");
    await user.click(screen.getByTestId("change-submit"));
    await waitFor(() => {
      expect(changePostMock).toHaveBeenCalledWith(5, "Updated text");
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not close on fail", async () => {
    changePostMock.mockImplementation(() => async () => false);
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeModal open onClose={onClose} postId={1} initialDescription="Keep" />
    );
    await user.click(screen.getByTestId("change-submit"));
    await waitFor(() => expect(changePostMock).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes via Batal", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeModal open onClose={onClose} postId={1} initialDescription="x" />
    );
    await user.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows loading when isPostChange", () => {
    renderWithProviders(
      <ChangeModal open onClose={vi.fn()} postId={1} initialDescription="x" />,
      { preloadedState: { posts: { ...basePosts, isPostChange: true } } }
    );
    expect(screen.getByTestId("change-submit")).toHaveTextContent("Menyimpan...");
    expect(screen.getByTestId("change-submit")).toBeDisabled();
  });
});
