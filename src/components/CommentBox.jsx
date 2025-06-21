import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function CommentBox({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/comments/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("❌ Error fetching comments:", err.response?.data || err.message);
    }
  }, [ticketId]);

  const addComment = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/api/comments/${ticketId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchComments();
    } catch (err) {
      console.error("❌ Failed to add comment:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg mt-4 text-white">
      <h4 className="font-bold mb-3 text-lg">💬 Comments</h4>

      {comments.length === 0 ? (
        <p className="text-slate-400">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="mb-3 border-b border-slate-700 pb-2">
            <p className="text-sm text-blue-400 font-semibold">{c.userName}</p>
            <p className="text-slate-300">{c.text}</p>
          </div>
        ))
      )}

      <textarea
        className="w-full p-2 mt-4 rounded bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={addComment}
        disabled={loading || !text.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>
    </div>
  );
}

export default CommentBox;
