"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Comment } from "@/lib/types";

export function useComments(itemType: string, itemId: string, initialCommentCount = 0) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });

    // Fetch comments
    fetch(`/api/comments?itemType=${itemType}&itemId=${encodeURIComponent(itemId)}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setCommentCount(data.commentCount ?? initialCommentCount);
      })
      .finally(() => setIsLoading(false));
  }, [itemType, itemId]);

  const submitComment = useCallback(async (body: string) => {
    if (!currentUserId || isSubmitting) return;
    setIsSubmitting(true);

    // Optimistic add
    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      userId: currentUserId,
      itemType: itemType as Comment["itemType"],
      itemId,
      body,
      createdAt: new Date().toISOString(),
      user: { username: "you", avatarUrl: null },
    };
    setComments((prev) => [optimistic, ...prev]);
    setCommentCount((prev) => prev + 1);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, body }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Replace optimistic with real
      setComments((prev) => prev.map((c) => (c.id === optimistic.id ? data.comment : c)));
      setCommentCount(data.commentCount);
    } catch {
      // Revert
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      setCommentCount((prev) => prev - 1);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUserId, isSubmitting, itemType, itemId]);

  const deleteComment = useCallback(async (commentId: string) => {
    let removed: Comment | undefined;

    // Optimistic remove
    setComments((prev) => {
      removed = prev.find((c) => c.id === commentId);
      return prev.filter((c) => c.id !== commentId);
    });
    setCommentCount((prev) => prev - 1);

    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCommentCount(data.commentCount);
    } catch {
      // Revert
      if (removed) {
        setComments((prev) =>
          [...prev, removed!].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        setCommentCount((prev) => prev + 1);
      }
    }
  }, []);

  return { comments, commentCount, isLoading, isSubmitting, currentUserId, submitComment, deleteComment };
}
