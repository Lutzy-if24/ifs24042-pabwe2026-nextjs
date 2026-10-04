import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import HomePage from "./HomePage";

let searchParamsValue = new URLSearchParams();
const deleteAllMock = vi.fn();
const setPostsMock = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsValue,
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/",
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

vi.mock("@/features/posts/states/action", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/posts/states/action")>();
  return {
    ...actual,
    asyncSetPosts: (...args: unknown[]) => setPostsMock(...args),
    asyncDeleteAllPosts: (...args: unknown[]) => deleteAllMock(...args),
    asyncAddPost: () => async () => true,
  };
});

const emptyPostsState = {
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

const samplePosts = [
  {
    id: 1,
    user_id: 1,
    description: "First post about coding",
    author: { name: "Alice" },
    likes: [1, 2],
    comments: [1],
    cover: "https://example.com/c.jpg",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: 2,
    description: "Second item",
    author: { name: "Bob" },
    likes: undefined,
    comments: undefined,
    cover: null,
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsValue = new URLSearchParams();
    setPostsMock.mockImplementation(() => async () => undefined);
    deleteAllMock.mockImplementation(() => async () => true);
  });

  it("renders empty state", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
    expect(screen.getByTestId("empty-posts")).toBeInTheDocument();
    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
  });

  it("renders posts with cover and without", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: { posts: { ...emptyPostsState, posts: samplePosts } },
    });
    await waitFor(() => {
      expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
    });
    expect(screen.getByText("Tanpa cover")).toBeInTheDocument();
  });

  it("shows Anonim when a post has no author", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: {
          ...emptyPostsState,
          posts: [
            {
              id: 3,
              user_id: 3,
              description: "Postingan tanpa penulis",
              author: null,
              likes: [],
              comments: [],
              cover: null,
              created_at: "2024-01-01T00:00:00Z",
            },
          ] as never,
        },
      },
    });
    await waitFor(() =>
      expect(screen.getByTestId("post-card-3")).toBeInTheDocument()
    );
    expect(screen.getByText("Anonim")).toBeInTheDocument();
  });

  it("filters by search description and author", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />, {
      preloadedState: { posts: { ...emptyPostsState, posts: samplePosts } },
    });
    await waitFor(() =>
      expect(screen.getByTestId("post-card-1")).toBeInTheDocument()
    );
    await user.type(screen.getByTestId("search-input"), "coding");
    expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("post-card-2")).not.toBeInTheDocument();

    await user.clear(screen.getByTestId("search-input"));
    await user.type(screen.getByTestId("search-input"), "bob");
    expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
  });

  it("shows Postingan Saya and delete all when is_me", async () => {
    searchParamsValue = new URLSearchParams("is_me=1");
    const user = userEvent.setup();
    renderWithProviders(<HomePage />, {
      preloadedState: { posts: { ...emptyPostsState, posts: samplePosts } },
    });
    await waitFor(() => {
      expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
      expect(screen.getByTestId("delete-all-btn")).toBeInTheDocument();
    });
    await user.click(screen.getByTestId("delete-all-btn"));
    expect(deleteAllMock).toHaveBeenCalled();
  });

  it("does not show delete all when is_me but no posts", async () => {
    searchParamsValue = new URLSearchParams("is_me=1");
    renderWithProviders(<HomePage />);
    await waitFor(() =>
      expect(screen.getByTestId("home-page")).toBeInTheDocument()
    );
    expect(screen.queryByTestId("delete-all-btn")).not.toBeInTheDocument();
  });

  it("opens add modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await waitFor(() =>
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("add-post-btn"));
    expect(screen.getByTestId("add-modal")).toBeInTheDocument();
  });

  it("closes add modal via onClose", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await waitFor(() =>
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("add-post-btn"));
    expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    // onClose={() => setShowAdd(false)}
    await user.click(screen.getByText("Batal"));
    await waitFor(() => {
      expect(screen.queryByTestId("add-modal")).not.toBeInTheDocument();
    });
  });

  it("calls onSuccess after successful add which refreshes posts", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await waitFor(() =>
      expect(screen.getByTestId("add-post-btn")).toBeInTheDocument()
    );
    const callsBefore = setPostsMock.mock.calls.length;
    await user.click(screen.getByTestId("add-post-btn"));
    await user.type(screen.getByTestId("add-description"), "Fresh post");
    await user.click(screen.getByTestId("add-submit"));
    // onSuccess={() => dispatch(asyncSetPosts(isMe))}
    await waitFor(() => {
      expect(setPostsMock.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });
});