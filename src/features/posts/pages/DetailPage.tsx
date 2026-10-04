"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeletePost,
} from "@/features/posts/states/action";
import ChangeModal from "@/features/posts/modals/ChangeModal";
import ChangeCoverModal from "@/features/posts/modals/ChangeCoverModal";
import useInput from "@/hooks/useInput";
import { formatDate } from "@/helpers/toolsHelper";
import {
  IconHeart,
  IconHeartFilled,
  IconEdit,
  IconPhoto,
  IconTrash,
  IconArrowLeft,
  IconSend,
} from "@tabler/icons-react";
import type { PostComment } from "@/types";

type DetailPageProps = {
  postId: string;
};

export default function DetailPage({ postId }: DetailPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { post, isPost } = useAppSelector((state) => state.posts);
  const profile = useAppSelector((state) => state.users.profile);
  const [comment, onCommentChange, , resetComment] = useInput("");
  const [showChange, setShowChange] = useState(false);
  const [showCover, setShowCover] = useState(false);

  useEffect(() => {
    dispatch(asyncSetPost(postId));
  }, [dispatch, postId]);

  const isOwner = post && profile && post.user_id === profile.id;
  const likes = Array.isArray(post?.likes) ? post!.likes : [];
  const isLiked = profile ? likes.includes(profile.id) : false;
  const comments: PostComment[] = Array.isArray(post?.comments)
    ? (post!.comments as PostComment[]).filter(
        (c) => typeof c === "object" && c !== null && "comment" in c
      )
    : [];

  async function handleLike() {
    await dispatch(asyncLikePost(postId, isLiked ? 0 : 1));
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const success = await dispatch(asyncAddComment(postId, comment.trim()));
    if (success) resetComment();
  }

  async function handleDelete() {
    const success = await dispatch(asyncDeletePost(postId));
    if (success) router.replace("/");
  }

  if (isPost) {
    return (
      <div className="text-center py-16 text-slate-600" data-testid="detail-loading">
        Memuat...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16 text-slate-600" data-testid="detail-not-found">
        Postingan tidak ditemukan
      </div>
    );
  }

  return (
    <div data-testid="detail-page" className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 mb-4"
      >
        <IconArrowLeft className="w-4 h-4" aria-hidden="true" />
        Kembali
      </button>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt="Cover"
            className="w-full max-h-80 object-cover"
            data-testid="detail-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-teal-700">
            Tanpa cover
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-semibold text-slate-800">
                {post.author?.name || "Anonim"}
              </p>
              <p className="text-xs text-slate-600">
                {formatDate(post.created_at)}
              </p>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowCover(true)}
                  data-testid="btn-change-cover"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                  title="Ubah cover"
                  aria-label="Ubah cover"
                >
                  <IconPhoto className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowChange(true)}
                  data-testid="btn-change-post"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                  title="Ubah postingan"
                  aria-label="Ubah postingan"
                >
                  <IconEdit className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  data-testid="btn-delete-post"
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  title="Hapus postingan"
                  aria-label="Hapus postingan"
                >
                  <IconTrash className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <p className="text-slate-700 leading-relaxed mb-4" data-testid="detail-description">
            {post.description}
          </p>

          <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLike}
              data-testid="btn-like"
              className={`flex items-center gap-1.5 text-sm ${
                isLiked ? "text-red-600" : "text-slate-600 hover:text-red-600"
              }`}
            >
              {isLiked ? (
                <IconHeartFilled className="w-5 h-5" aria-hidden="true" />
              ) : (
                <IconHeart className="w-5 h-5" aria-hidden="true" />
              )}
              {likes.length} Suka
            </button>
            <span className="text-sm text-slate-600">
              {comments.length} Komentar
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Komentar</h2>

        <form onSubmit={handleComment} className="flex gap-2 mb-6">
          <input
            type="text"
            value={comment}
            onChange={onCommentChange}
            placeholder="Tulis komentar..."
            aria-label="Tulis komentar"
            data-testid="comment-input"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <button
            type="submit"
            data-testid="comment-submit"
            aria-label="Kirim komentar"
            className="px-3 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800"
          >
            <IconSend className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-4">
            Belum ada komentar
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="flex items-start justify-between gap-2 p-3 rounded-lg bg-slate-50"
                data-testid={`comment-${c.id}`}
              >
                <div>
                  <p className="text-sm text-slate-700">{c.comment}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatDate(c.created_at)}
                  </p>
                </div>
                {post.my_comment && post.my_comment.id === c.id && (
                  <button
                    type="button"
                    onClick={() => dispatch(asyncDeleteComment(postId))}
                    data-testid="btn-delete-comment"
                    aria-label="Hapus komentar"
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <IconTrash className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ChangeModal
        open={showChange}
        onClose={() => setShowChange(false)}
        postId={postId}
        initialDescription={post.description}
      />
      <ChangeCoverModal
        open={showCover}
        onClose={() => setShowCover(false)}
        postId={postId}
      />
    </div>
  );
}