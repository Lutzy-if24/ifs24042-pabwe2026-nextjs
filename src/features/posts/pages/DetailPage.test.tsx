import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import DetailPage from "./DetailPage";

const replace = vi.fn();
const back = vi.fn();
const likeMock = vi.fn();
const addCommentMock = vi.fn();
const deleteCommentMock = vi.fn();
const deletePostMock = vi.fn();
const setPostMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back, replace }),
}));

vi.mock("@/features/posts/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/states/action")>();
  return {
    ...actual,
    asyncSetPost: (...args: unknown[]) => setPostMock(...args),
    asyncLikePost: (...args: unknown[]) => likeMock(...args),
    asyncAddComment: (...args: unknown[]) => addCommentMock(...args),
    asyncDeleteComment: (...args: unknown[]) => deleteCommentMock(...args),
    asyncDeletePost: (...args: unknown[]) => deletePostMock(...args),
    asyncChangePost: () => async () => true,
    asyncChangePostCover: () => async () => true,
  };
});

const basePosts = {
  posts: [],
  post: null as null | Record<string, unknown>,
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

const ownerProfile = {
  users: [],
  user: null,
  profile: { id: 1, name: "Owner", email: "o@t.com" },
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
};

const fullPost = {
  id: 1,
  user_id: 1,
  description: "Detail desc",
  author: { name: "Owner" },
  likes: [1, 2],
  comments: [
    { id: 10, comment: "Nice", created_at: "2024-01-01T00:00:00Z" },
    { id: 11, comment: "Other" },
  ],
  my_comment: { id: 10, comment: "Nice", created_at: "2024-01-01T00:00:00Z" },
  cover: "https://example.com/c.jpg",
  created_at: "2024-01-01T00:00:00Z",
};

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setPostMock.mockImplementation(() => async () => undefined);
    likeMock.mockImplementation(() => async () => true);
    addCommentMock.mockImplementation(() => async () => true);
    deleteCommentMock.mockImplementation(() => async () => true);
    deletePostMock.mockImplementation(() => async () => true);
  });

  it("shows loading", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: { posts: { ...basePosts, isPost: true } },
    });
    expect(screen.getByTestId("detail-loading")).toBeInTheDocument();
  });

  it("shows not found", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: { posts: basePosts },
    });
    await waitFor(() => {
      expect(screen.getByTestId("detail-not-found")).toBeInTheDocument();
    });
  });

  it("renders detail with cover and owner actions", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("detail-page")).toBeInTheDocument()
    );
    expect(screen.getByTestId("detail-description")).toHaveTextContent(
      "Detail desc"
    );
    expect(screen.getByTestId("detail-cover")).toBeInTheDocument();
    expect(screen.getByTestId("btn-change-cover")).toBeInTheDocument();
    expect(screen.getByTestId("btn-change-post")).toBeInTheDocument();
    expect(screen.getByTestId("btn-delete-post")).toBeInTheDocument();
  });

  it("renders without cover and non-owner hides actions", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: {
          ...basePosts,
          post: { ...fullPost, cover: null, user_id: 99, likes: [] },
        },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("detail-page")).toBeInTheDocument()
    );
    expect(screen.getByText("Tanpa cover")).toBeInTheDocument();
    expect(screen.queryByTestId("btn-delete-post")).not.toBeInTheDocument();
  });

  it("likes and unlikes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-like")).toBeInTheDocument()
    );
    // already liked (id 1 in likes) -> unlike with 0
    await user.click(screen.getByTestId("btn-like"));
    await waitFor(() => expect(likeMock).toHaveBeenCalledWith("1", 0));
  });

  it("likes when not liked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: { ...fullPost, likes: [2] } },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-like")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-like"));
    await waitFor(() => expect(likeMock).toHaveBeenCalledWith("1", 1));
  });

  it("adds comment and resets", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("comment-input")).toBeInTheDocument()
    );
    await user.type(screen.getByTestId("comment-input"), "Hello");
    await user.click(screen.getByTestId("comment-submit"));
    await waitFor(() => {
      expect(addCommentMock).toHaveBeenCalledWith("1", "Hello");
      expect(screen.getByTestId("comment-input")).toHaveValue("");
    });
  });

  it("does not add empty comment", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("comment-input")).toBeInTheDocument()
    );
    fireEvent.submit(screen.getByTestId("comment-submit").closest("form")!);
    expect(addCommentMock).not.toHaveBeenCalled();
  });

  it("does not reset comment on fail", async () => {
    addCommentMock.mockImplementation(() => async () => false);
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("comment-input")).toBeInTheDocument()
    );
    await user.type(screen.getByTestId("comment-input"), "Stay");
    await user.click(screen.getByTestId("comment-submit"));
    await waitFor(() => expect(addCommentMock).toHaveBeenCalled());
    expect(screen.getByTestId("comment-input")).toHaveValue("Stay");
  });

  it("deletes own comment", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-delete-comment")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-delete-comment"));
    await waitFor(() => expect(deleteCommentMock).toHaveBeenCalledWith("1"));
  });

  it("deletes post and redirects", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-delete-post")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-delete-post"));
    await waitFor(() => {
      expect(deletePostMock).toHaveBeenCalledWith("1");
      expect(replace).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when delete fails", async () => {
    deletePostMock.mockImplementation(() => async () => false);
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-delete-post")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-delete-post"));
    await waitFor(() => expect(deletePostMock).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });

  it("opens change and cover modals", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-change-post")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-change-post"));
    expect(screen.getByTestId("change-modal")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Tutup"));
    await user.click(screen.getByTestId("btn-change-cover"));
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
  });

  it("back button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByText("Kembali")).toBeInTheDocument()
    );
    await user.click(screen.getByText("Kembali"));
    expect(back).toHaveBeenCalled();
  });

  it("handles comments as non-object array and empty comments", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: {
          ...basePosts,
          post: { ...fullPost, comments: [1, 2], my_comment: null, likes: null },
        },
        users: { ...ownerProfile, profile: null },
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("detail-page")).toBeInTheDocument()
    );
    expect(screen.getByText("Belum ada komentar")).toBeInTheDocument();
  });

  it("shows Anonim when post has no author", async () => {
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: { ...fullPost, author: null } },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("detail-page")).toBeInTheDocument()
    );
    expect(screen.getByText("Anonim")).toBeInTheDocument();
  });

  it("closes cover modal via onClose handler", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DetailPage postId="1" />, {
      preloadedState: {
        posts: { ...basePosts, post: fullPost },
        users: ownerProfile,
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("btn-change-cover")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("btn-change-cover"));
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
    // triggers onClose={() => setShowCover(false)}
    await user.click(screen.getByLabelText("Tutup"));
    await waitFor(() => {
      expect(
        screen.queryByTestId("change-cover-modal")
      ).not.toBeInTheDocument();
    });
  });
});