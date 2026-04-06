"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useComments } from "@/lib/hooks/use-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentSidebarProps {
  itemType: string;
  itemId: string;
  initialCommentCount?: number;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function CommentSidebar({ itemType, itemId, initialCommentCount = 0 }: CommentSidebarProps) {
  const pathname = usePathname();
  const { comments, commentCount, isLoading, isSubmitting, currentUserId, submitComment, deleteComment } = useComments(itemType, itemId, initialCommentCount);
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    await submitComment(trimmed);
    setBody("");
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4">
        Comments {commentCount > 0 && `(${commentCount})`}
      </p>

      {/* Submit area */}
      {currentUserId ? (
        <div className="mb-4 space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            maxLength={1000}
            rows={3}
            className="w-full text-sm bg-transparent border border-border p-2 resize-none focus:outline-none focus:border-ring placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !body.trim()}
            className="text-xs uppercase tracking-[0.12em] px-3 py-1.5 border border-primary text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <div className="mb-4 py-3 text-center border border-border">
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="text-xs text-primary hover:underline"
          >
            Login to comment
          </Link>
        </div>
      )}

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-24 bg-muted mb-2" />
              <div className="h-3 w-full bg-muted" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={comment.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px]">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground">{relativeTime(comment.createdAt)}</span>
                </div>
                {comment.userId === currentUserId && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                    title="Delete comment"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed">{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
