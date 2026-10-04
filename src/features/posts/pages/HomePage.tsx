"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPosts,
  asyncDeleteAllPosts,
} from "@/features/posts/states/action";
import AddModal from "@/features/posts/modals/AddModal";
import { formatDate } from "@/helpers/toolsHelper";
import {
  IconPlus,
  IconSearch,
  IconHeart,
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons-react";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isMe = searchParams.get("is_me") === "1";
  const { posts } = useAppSelector((state) => state.posts);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(asyncSetPosts(isMe));
  }, [dispatch, isMe]);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.description?.toLowerCase().includes(q) ||
        p.author?.name?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  function getLikesCount(likes?: number[]) {
    return Array.isArray(likes) ? likes.length : 0;
  }

  function getCommentsCount(comments?: unknown) {
    if (Array.isArray(comments)) return comments.length;
    return 0;
  }

  return (
    <div data-testid="home-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {isMe ? "Postingan Saya" : "Semua Postingan"}
          </h2>
          <p className="text-sm text-slate-500">
            {filtered.length} postingan ditemukan
          </p>
        </div>
        <div className="flex gap-2">
          {isMe && posts.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(asyncDeleteAllPosts())}
              data-testid="delete-all-btn"
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <IconTrash className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            data-testid="add-post-btn"
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700"
          >
            <IconPlus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari postingan..."
          data-testid="search-input"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400" data-testid="empty-posts">
          Belum ada postingan
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              data-testid={`post-card-${post.id}`}
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {post.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover}
                  alt="Cover"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-teal-400 text-sm">
                  Tanpa cover
                </div>
              )}
              <div className="p-4">
                <p className="text-sm font-medium text-slate-800 line-clamp-2 mb-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{post.author?.name || "Anonim"}</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <IconHeart className="w-3.5 h-3.5" />
                    {getLikesCount(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMessageCircle className="w-3.5 h-3.5" />
                    {getCommentsCount(post.comments)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => dispatch(asyncSetPosts(isMe))}
      />
    </div>
  );
}
