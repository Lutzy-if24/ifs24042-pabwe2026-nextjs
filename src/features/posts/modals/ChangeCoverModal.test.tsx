import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import ChangeCoverModal from "./ChangeCoverModal";

const changeCoverMock = vi.fn();

vi.mock("@/features/posts/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/states/action")>();
  return {
    ...actual,
    asyncChangePostCover: (...args: unknown[]) => changeCoverMock(...args),
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

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeCoverMock.mockImplementation(() => async () => true);
    global.URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("returns null when closed", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal open={false} onClose={vi.fn()} postId={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders when open", () => {
    renderWithProviders(
      <ChangeCoverModal open onClose={vi.fn()} postId={1} />
    );
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
    expect(screen.getByTestId("cover-dropzone")).toBeInTheDocument();
  });

  it("does not submit without file", () => {
    renderWithProviders(
      <ChangeCoverModal open onClose={vi.fn()} postId={1} />
    );
    fireEvent.submit(screen.getByTestId("cover-submit").closest("form")!);
    expect(changeCoverMock).not.toHaveBeenCalled();
  });

  it("selects file, shows preview, submits success", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeCoverModal open onClose={onClose} postId={3} onSuccess={onSuccess} />
    );
    const file = new File(["img"], "cover.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByTestId("cover-input"), file);
    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
    await user.click(screen.getByTestId("cover-submit"));
    await waitFor(() => {
      expect(changeCoverMock).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not close on fail", async () => {
    changeCoverMock.mockImplementation(() => async () => false);
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeCoverModal open onClose={onClose} postId={1} />
    );
    const file = new File(["img"], "cover.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByTestId("cover-input"), file);
    await user.click(screen.getByTestId("cover-submit"));
    await waitFor(() => expect(changeCoverMock).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ignores empty file change", () => {
    renderWithProviders(
      <ChangeCoverModal open onClose={vi.fn()} postId={1} />
    );
    fireEvent.change(screen.getByTestId("cover-input"), {
      target: { files: [] },
    });
    expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
  });

  it("handleClose via Batal", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeCoverModal open onClose={onClose} postId={1} />
    );
    await user.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });

  it("clicks dropzone to open file input", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ChangeCoverModal open onClose={vi.fn()} postId={1} />
    );
    const input = screen.getByTestId("cover-input") as HTMLInputElement;
    const clickSpy = vi.fn();
    input.click = clickSpy;
    await user.click(screen.getByTestId("cover-dropzone"));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("shows uploading state", () => {
    renderWithProviders(
      <ChangeCoverModal open onClose={vi.fn()} postId={1} />,
      { preloadedState: { posts: { ...basePosts, isPostChangeCover: true } } }
    );
    expect(screen.getByTestId("cover-submit")).toHaveTextContent("Mengunggah...");
  });
});
